import json
import re
import sqlite3
from pathlib import Path
from typing import Any

from config import PRIMARY_ORG, PRIMARY_ORGS


PROJECT_ROOT = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = PROJECT_ROOT / "rule_data" / "rag_data"
DEFAULT_DB_PATH = PROJECT_ROOT / "rule_data" / "rules.sqlite3"


def repair_mojibake(value: Any) -> Any:
    """Repair common UTF-8 text that was decoded as Windows-1252."""
    if isinstance(value, dict):
        return {key: repair_mojibake(item) for key, item in value.items()}
    if isinstance(value, list):
        return [repair_mojibake(item) for item in value]
    if not isinstance(value, str):
        return value

    if not any(marker in value for marker in ("ì", "ê", "í", "ë", "â", "ã", "ï")):
        return value

    try:
        repaired = value.encode("cp1252").decode("utf-8")
    except UnicodeError:
        return value

    return repaired if _korean_score(repaired) > _korean_score(value) else value


def _korean_score(value: str) -> int:
    hangul = sum(1 for char in value if "\uac00" <= char <= "\ud7a3")
    mojibake = sum(value.count(marker) for marker in ("ì", "ê", "í", "ë", "â", "ã", "ï"))
    return hangul * 3 - mojibake


def connect(db_path: str | Path = DEFAULT_DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def _primary_named(col: str = "org_id") -> tuple[str, dict]:
    """named-param 쿼리용: (is_primary SQL 표현식, 추가 파라미터 dict).

    PRIMARY_ORGS 리스트를 매 호출 시 읽어 runtime 변경을 반영한다.
    """
    orgs = PRIMARY_ORGS
    if not orgs:
        return "0", {}
    if len(orgs) == 1:
        return f"({col} = :_porg0)", {"_porg0": orgs[0]}
    named = {f"_porg{i}": v for i, v in enumerate(orgs)}
    phs = ", ".join(f":_porg{i}" for i in range(len(orgs)))
    return f"({col} IN ({phs}))", named


def _primary_pos(col: str = "org_id") -> tuple[str, list]:
    """positional-param 쿼리용: (is_primary SQL 표현식, 추가 파라미터 list)."""
    orgs = PRIMARY_ORGS
    if not orgs:
        return "0", []
    if len(orgs) == 1:
        return f"({col} = ?)", list(orgs)
    phs = ",".join("?" * len(orgs))
    return f"({col} IN ({phs}))", list(orgs)


def build_database(
    data_dir: str | Path = DEFAULT_DATA_DIR,
    db_path: str | Path = DEFAULT_DB_PATH,
    *,
    repair_text: bool = True,
    reset: bool = True,
) -> dict[str, int]:
    """JSONL → SQLite 빌드.

    reset=True(기본): 테이블을 초기화 후 적재. 단일 기관 또는 첫 번째 기관 빌드 시 사용.
    reset=False: 기존 데이터 유지하고 추가 적재. 다기관 통합 빌드 시 두 번째 기관부터 사용.
    """
    data_dir = Path(data_dir)
    db_path = Path(db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    conn = connect(db_path)
    try:
        _create_schema(conn)
        if reset:
            _clear_tables(conn)

        counts = {
            "rules": _load_rules(conn, data_dir / "rules.jsonl", repair_text),
            "sources": _load_sources(conn, data_dir / "sources.jsonl", repair_text),
            "chunks": _load_chunks(conn, data_dir / "chunks.jsonl", repair_text),
        }
        if reset:
            _rebuild_fts(conn)
        else:
            # 추가 적재 시 해당 기관 행만 FTS에 삽입
            _append_fts(conn)
        conn.commit()
        return counts
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def search_rules(
    query: str,
    limit: int = 10,
    org: str | None = None,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    query = query.strip()
    if not query:
        return []

    like_query = f"%{query}%"
    org_filter = "AND r.org_id = :org" if org else ""
    primary_expr, primary_params = _primary_named("r.org_id")
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT
                r.org_id,
                r.rule_id,
                r.rule_title,
                r.is_current,
                {primary_expr} AS is_primary,
                COUNT(c.id) AS chunk_count
            FROM rules r
            LEFT JOIN chunks c ON c.org_id = r.org_id AND c.rule_id = r.rule_id
            WHERE (r.rule_title LIKE :like OR r.rule_id LIKE :like)
              {org_filter}
            GROUP BY r.org_id, r.rule_id
            ORDER BY is_primary DESC, r.is_current DESC, r.rule_title
            LIMIT :limit
            """,
            {"like": like_query, "org": org, "limit": limit, **primary_params},
        ).fetchall()
    return [_row_to_dict(row) for row in rows]


def search_articles(
    query: str,
    limit: int = 10,
    org: str | None = None,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    query = query.strip()
    if not query:
        return []

    org_filter = "AND c.org_id = :org" if org else ""
    primary_expr, primary_params = _primary_named("c.org_id")
    with connect(db_path) as conn:
        try:
            rows = conn.execute(
                f"""
                SELECT
                    c.org_id,
                    c.chunk_id,
                    c.rule_id,
                    c.rule_title,
                    c.chunk_type,
                    c.article_no,
                    c.article_title,
                    c.text,
                    c.source_pdf,
                    c.source_path,
                    c.pdf_page_start,
                    c.pdf_page_end,
                    c.is_current,
                    c.part_idx,
                    c.part_total,
                    {primary_expr} AS is_primary,
                    bm25(chunks_fts) AS score
                FROM chunks_fts
                JOIN chunks c ON c.id = chunks_fts.rowid
                WHERE chunks_fts MATCH :q
                  {org_filter}
                ORDER BY is_primary DESC, score
                LIMIT :limit
                """,
                {"q": _fts_query(query), "org": org, "limit": limit, **primary_params},
            ).fetchall()
        except sqlite3.OperationalError:
            rows = _like_search(conn, query, limit, org=org)
        if not rows:
            rows = _like_search(conn, query, limit, org=org)
    return [_row_to_dict(row) for row in rows]


def get_article(
    rule_name: str,
    article_no: str,
    org: str | None = None,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    org_filter = "AND org_id = :org" if org else ""
    primary_expr, primary_params = _primary_named()
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT
                org_id,
                chunk_id,
                rule_id,
                rule_title,
                chunk_type,
                article_no,
                article_title,
                text,
                source_pdf,
                source_path,
                pdf_page_start,
                pdf_page_end,
                is_current,
                part_idx,
                part_total
            FROM chunks
            WHERE chunk_type = 'article'
              AND (rule_id = :name OR rule_title = :name OR rule_title LIKE :like)
              AND article_no = :article_no
              {org_filter}
            ORDER BY {primary_expr} DESC, part_idx, id
            """,
            {
                "name": rule_name,
                "like": f"%{rule_name}%",
                "article_no": article_no,
                "org": org,
                **primary_params,
            },
        ).fetchall()
    return [_row_to_dict(row) for row in rows]


def get_toc(
    rule_name: str,
    include_annex: bool = False,
    org: str | None = None,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    rule_name = rule_name.strip()
    like_name = f"%{rule_name}%"

    chunk_types = ("'article'", "'annex'") if include_annex else ("'article'",)
    type_filter = f"chunk_type IN ({', '.join(chunk_types)})"
    org_filter = "AND org_id = :org" if org else ""

    primary_expr, primary_params = _primary_named()
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT DISTINCT
                org_id,
                rule_id,
                rule_title,
                chunk_type,
                article_no,
                article_title,
                MIN(pdf_page_start) AS pdf_page_start,
                is_current
            FROM chunks
            WHERE ({type_filter})
              AND (rule_id = :name OR rule_title = :name OR rule_title LIKE :like)
              AND article_no IS NOT NULL AND article_no != ''
              AND article_title IS NOT NULL AND article_title != ''
              {org_filter}
            GROUP BY org_id, rule_id, article_no
            ORDER BY {primary_expr} DESC, rule_id, article_no
            """,
            {"name": rule_name, "like": like_name, "org": org, **primary_params},
        ).fetchall()

    result = [_row_to_dict(row) for row in rows]

    # 여러 rule_id가 매칭된 경우 — org별로 현행(is_current=1)만 남김
    org_rule_pairs = {(r["org_id"], r["rule_id"]) for r in result}
    if len(org_rule_pairs) > 1:
        current_pairs = {(r["org_id"], r["rule_id"]) for r in result if r.get("is_current") == 1}
        if current_pairs:
            result = [r for r in result if (r["org_id"], r["rule_id"]) in current_pairs]

    result.sort(key=lambda r: (
        r["org_id"] not in PRIMARY_ORGS,
        _article_sort_key(r["article_no"]),
        r["chunk_type"] != "article",
    ))
    return result


def _article_sort_key(article_no: str) -> tuple[int, int, str]:
    """Sort key for Korean article numbers like 제1조, 제2조의3, 별표 1."""
    m = re.match(r"제\s*(\d+)\s*조(?:의\s*(\d+))?", article_no or "")
    if m:
        return (int(m.group(1)), int(m.group(2) or 0), "")
    # annex types (별표, 별지, 부칙, etc.) sort after articles
    m2 = re.search(r"(\d+)", article_no or "")
    return (10_000_000, int(m2.group(1)) if m2 else 0, article_no or "")


def get_annex(
    rule_name: str,
    annex_no: str = "",
    org: str | None = None,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    annex_no = annex_no.strip()
    annex_filter = "AND article_no LIKE :annex_no" if annex_no else ""
    org_filter = "AND org_id = :org" if org else ""

    primary_expr, primary_params = _primary_named()
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT
                org_id,
                chunk_id,
                rule_id,
                rule_title,
                chunk_type,
                article_no,
                article_title,
                text,
                source_pdf,
                source_path,
                pdf_page_start,
                pdf_page_end,
                is_current,
                part_idx,
                part_total
            FROM chunks
            WHERE chunk_type = 'annex'
              AND (rule_id = :name OR rule_title = :name OR rule_title LIKE :like)
              {annex_filter}
              {org_filter}
            ORDER BY {primary_expr} DESC, article_no, part_idx, id
            """,
            {
                "name": rule_name,
                "like": f"%{rule_name}%",
                "annex_no": f"%{annex_no}%",
                "org": org,
                **primary_params,
            },
        ).fetchall()
    return [_row_to_dict(row) for row in rows]


def _create_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;

        CREATE TABLE IF NOT EXISTS rules (
            org_id TEXT NOT NULL DEFAULT 'ADD',
            rule_id TEXT NOT NULL,
            rule_title TEXT NOT NULL,
            is_current INTEGER NOT NULL DEFAULT 1,
            raw_json TEXT NOT NULL,
            PRIMARY KEY (org_id, rule_id)
        );

        CREATE TABLE IF NOT EXISTS sources (
            org_id TEXT NOT NULL DEFAULT 'ADD',
            source_id TEXT NOT NULL,
            rule_id TEXT NOT NULL,
            rule_title TEXT,
            source_pdf TEXT,
            source_path TEXT,
            page_count INTEGER,
            is_current INTEGER NOT NULL DEFAULT 1,
            raw_json TEXT NOT NULL,
            PRIMARY KEY (org_id, source_id)
        );

        CREATE TABLE IF NOT EXISTS chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL DEFAULT 'ADD',
            chunk_id TEXT NOT NULL,
            rule_id TEXT NOT NULL,
            rule_title TEXT NOT NULL,
            source_id TEXT,
            source_pdf TEXT,
            source_txt TEXT,
            source_path TEXT,
            chunk_type TEXT,
            article_no TEXT,
            article_title TEXT,
            text TEXT NOT NULL,
            pdf_page_start INTEGER,
            pdf_page_end INTEGER,
            is_current INTEGER NOT NULL DEFAULT 1,
            part_idx INTEGER,
            part_total INTEGER,
            raw_json TEXT NOT NULL,
            UNIQUE (org_id, chunk_id)
        );

        CREATE INDEX IF NOT EXISTS idx_chunks_org_rule_article
            ON chunks(org_id, rule_id, article_no, chunk_type);
        CREATE INDEX IF NOT EXISTS idx_chunks_rule_title
            ON chunks(rule_title);
        CREATE INDEX IF NOT EXISTS idx_chunks_type
            ON chunks(chunk_type);
        CREATE INDEX IF NOT EXISTS idx_chunks_org
            ON chunks(org_id);
        """
    )

    conn.execute("DROP TABLE IF EXISTS chunks_fts")
    try:
        conn.execute(
            """
            CREATE VIRTUAL TABLE chunks_fts USING fts5(
                rule_title,
                article_no,
                article_title,
                text,
                content='chunks',
                content_rowid='id',
                tokenize='trigram'
            )
            """
        )
    except sqlite3.OperationalError:
        conn.execute(
            """
            CREATE VIRTUAL TABLE chunks_fts USING fts5(
                rule_title,
                article_no,
                article_title,
                text,
                content='chunks',
                content_rowid='id'
            )
            """
        )


def reset_org(org_id: str, db_path: str | Path = DEFAULT_DB_PATH) -> int:
    """특정 기관의 DB 레코드를 전부 삭제한다. 삭제된 rules 수를 반환."""
    with connect(db_path) as conn:
        deleted = conn.execute(
            "SELECT COUNT(*) FROM rules WHERE org_id = ?", (org_id,)
        ).fetchone()[0]
        conn.execute(
            "DELETE FROM chunks_fts WHERE rowid IN "
            "(SELECT id FROM chunks WHERE org_id = ?)", (org_id,)
        )
        conn.execute("DELETE FROM chunks  WHERE org_id = ?", (org_id,))
        conn.execute("DELETE FROM sources WHERE org_id = ?", (org_id,))
        conn.execute("DELETE FROM rules   WHERE org_id = ?", (org_id,))
        conn.commit()
    return deleted


def _clear_tables(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        DELETE FROM chunks;
        DELETE FROM sources;
        DELETE FROM rules;
        DELETE FROM sqlite_sequence WHERE name = 'chunks';
        """
    )


def _load_jsonl(path: Path, repair_text: bool) -> list[dict[str, Any]]:
    if not path.exists():
        raise FileNotFoundError(f"JSONL file not found: {path}")

    rows = []
    with path.open("r", encoding="utf-8") as file:
        for line_no, line in enumerate(file, start=1):
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid JSON at {path}:{line_no}: {exc}") from exc
            rows.append(repair_mojibake(row) if repair_text else row)
    return rows


def _load_rules(conn: sqlite3.Connection, path: Path, repair_text: bool) -> int:
    rows = _load_jsonl(path, repair_text)
    conn.executemany(
        """
        INSERT OR REPLACE INTO rules(org_id, rule_id, rule_title, is_current, raw_json)
        VALUES (?, ?, ?, ?, ?)
        """,
        [
            (
                row.get("org_id", "ADD"),
                row.get("rule_id", ""),
                row.get("rule_title", ""),
                int(bool(row.get("is_current", True))),
                json.dumps(row, ensure_ascii=False),
            )
            for row in rows
        ],
    )
    return len(rows)


def _load_sources(conn: sqlite3.Connection, path: Path, repair_text: bool) -> int:
    rows = _load_jsonl(path, repair_text)
    conn.executemany(
        """
        INSERT OR REPLACE INTO sources(
            org_id, source_id, rule_id, rule_title, source_pdf, source_path,
            page_count, is_current, raw_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                row.get("org_id", "ADD"),
                row.get("source_id", ""),
                row.get("rule_id", ""),
                row.get("rule_title", ""),
                row.get("source_pdf", ""),
                row.get("source_path", ""),
                row.get("page_count"),
                int(bool(row.get("is_current", True))),
                json.dumps(row, ensure_ascii=False),
            )
            for row in rows
        ],
    )
    return len(rows)


def _load_chunks(conn: sqlite3.Connection, path: Path, repair_text: bool) -> int:
    rows = _load_jsonl(path, repair_text)
    conn.executemany(
        """
        INSERT OR REPLACE INTO chunks(
            org_id, chunk_id, rule_id, rule_title, source_id, source_pdf, source_txt,
            source_path, chunk_type, article_no, article_title, text,
            pdf_page_start, pdf_page_end, is_current, part_idx, part_total,
            raw_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                row.get("org_id", "ADD"),
                row.get("chunk_id", ""),
                row.get("rule_id", ""),
                row.get("rule_title", ""),
                row.get("source_id", ""),
                row.get("source_pdf", ""),
                row.get("source_txt", ""),
                row.get("source_path", ""),
                row.get("chunk_type", ""),
                row.get("article_no", ""),
                row.get("article_title", ""),
                _clean_text(row.get("text", "")),
                row.get("pdf_page_start"),
                row.get("pdf_page_end"),
                int(bool(row.get("is_current", True))),
                row.get("part_idx"),
                row.get("part_total"),
                json.dumps(row, ensure_ascii=False),
            )
            for row in rows
        ],
    )
    return len(rows)


def _rebuild_fts(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        INSERT INTO chunks_fts(rowid, rule_title, article_no, article_title, text)
        SELECT id, rule_title, article_no, article_title, text
        FROM chunks
        """
    )


def _append_fts(conn: sqlite3.Connection) -> None:
    """FTS5에 아직 없는 chunks 행만 추가 삽입 (다기관 통합 빌드 시 사용)."""
    conn.execute(
        """
        INSERT INTO chunks_fts(rowid, rule_title, article_no, article_title, text)
        SELECT c.id, c.rule_title, c.article_no, c.article_title, c.text
        FROM chunks c
        WHERE c.id NOT IN (SELECT rowid FROM chunks_fts)
        """
    )


def _clean_text(value: str) -> str:
    value = value.replace("\x00", " ")
    return re.sub(r"[ \t]+", " ", value).strip()


def _fts_query(query: str) -> str:
    terms = [term for term in re.split(r"\s+", query.strip()) if term]
    quoted_terms = [f'"{term.replace(chr(34), chr(34) + chr(34))}"' for term in terms]
    return " AND ".join(quoted_terms) if quoted_terms else '""'


def _like_search(
    conn: sqlite3.Connection,
    query: str,
    limit: int,
    org: str | None = None,
) -> list[sqlite3.Row]:
    terms = [term for term in re.split(r"\s+", query.strip()) if term]
    if not terms:
        return []

    term_clauses = " AND ".join(
        "(rule_title LIKE ? OR article_no LIKE ? OR article_title LIKE ? OR text LIKE ?)"
        for _ in terms
    )
    org_filter = "AND org_id = ?" if org else ""
    params: list[Any] = []
    for term in terms:
        like_query = f"%{term}%"
        params.extend([like_query, like_query, like_query, like_query])
    if org:
        params.append(org)
    primary_expr, primary_list = _primary_pos()
    params.extend(primary_list)
    params.append(limit)

    return conn.execute(
        f"""
        SELECT
            org_id,
            chunk_id,
            rule_id,
            rule_title,
            chunk_type,
            article_no,
            article_title,
            text,
            source_pdf,
            source_path,
            pdf_page_start,
            pdf_page_end,
            is_current,
            part_idx,
            part_total,
            {primary_expr} AS is_primary,
            NULL AS score
        FROM chunks
        WHERE {term_clauses}
          {org_filter}
        ORDER BY is_primary DESC, is_current DESC, id
        LIMIT ?
        """,
        params,
    ).fetchall()


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}
