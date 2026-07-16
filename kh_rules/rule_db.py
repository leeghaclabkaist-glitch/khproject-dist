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


def _normalize_name(value: str) -> str:
    """규정명 매칭용 정규화: 괄호(개정·부가 표기) 제거 + 공백 제거.

    저장 제목과 질의를 '대칭으로' 이 함수로 정규화해 비교하므로,
    개정 표기 괄호('(21년 6월 개정)')든 의미형 괄호('(TRA)')든 양쪽 표기 모두 매칭된다.
    예: '휴직자 복무관리 방침(21년 6월 개정)' → '휴직자복무관리방침'
        '기술성숙도평가(TRA) 수행지침' → '기술성숙도평가수행지침'
    """
    value = re.sub(r"\([^)]*\)", "", value or "")
    return re.sub(r"\s+", "", value)


def connect(db_path: str | Path = DEFAULT_DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    # 규정명 정규화 매칭용 SQL 함수 등록 (저장 제목·질의를 동일 규칙으로 비교)
    try:
        conn.create_function("nrm", 1, _normalize_name, deterministic=True)
    except TypeError:
        conn.create_function("nrm", 1, _normalize_name)   # 구버전 sqlite3 호환
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


# 규정 종류(doc_type) 파생용 접미어 토큰. rule_id 접두어는 신뢰할 수 없어
# (과거 규정번호·부설_ 접두어 충돌 이력) 제목 접미어에서 파생한다.
_DOC_TYPE_TOKENS = ("규정", "방침", "요령", "지침", "규칙", "정관", "강령", "기준")


def _derive_doc_type(title: str) -> str:
    """규정 제목에서 종류를 파생한다(규정/방침/요령/…). 판별 불가 시 '기타'.

    괄호 이하(개정일 등)를 제거한 본문에서 유형 토큰 중 '가장 뒤에' 등장하는 것을
    택한다. 예: '경력산정기준방침 …' → 기준(앞) 보다 방침(뒤) 우선.
    """
    base = re.split(r"[(\[]", title or "", maxsplit=1)[0]
    best_tok, best_pos = "기타", -1
    for tok in _DOC_TYPE_TOKENS:
        pos = base.rfind(tok)
        if pos > best_pos:
            best_pos, best_tok = pos, tok
    return best_tok


def list_rules(
    org: str | None = None,
    doc_type: str | None = None,
    current_only: bool = True,
    limit: int = 500,
    offset: int = 0,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> dict[str, Any]:
    """규정을 전수 조회한다(query 불필요).

    org=None 이면 전체 기관. doc_type 지정 시 해당 종류만. current_only=True 면 현행만.
    반환: {"total", "count", "offset", "rules": [...]} — rules 각 항목에 doc_type 포함.
    """
    org_filter = "AND r.org_id = :org" if org else ""
    current_filter = "AND r.is_current = 1" if current_only else ""
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
            WHERE 1 = 1 {org_filter} {current_filter}
            GROUP BY r.org_id, r.rule_id
            ORDER BY is_primary DESC, r.rule_title
            """,
            {"org": org, **primary_params},
        ).fetchall()

    items = [_row_to_dict(row) for row in rows]
    for item in items:
        item["doc_type"] = _derive_doc_type(item.get("rule_title", ""))
    if doc_type and doc_type.strip():
        want = doc_type.strip()
        items = [it for it in items if it["doc_type"] == want]

    total = len(items)
    offset = max(0, offset)
    page = items[offset:]
    if limit is not None and limit >= 0:
        page = page[:limit]
    return {"total": total, "count": len(page), "offset": offset, "rules": page}


def count_rules(
    org: str | None = None,
    current_only: bool = True,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> dict[str, Any]:
    """규정 개수를 집계한다(query 불필요).

    반환: {"total", "by_doc_type": {...}, "by_org": {...}}.
    org=None 이면 전체 기관, 지정 시 해당 기관만.
    """
    from collections import Counter

    org_filter = "AND org_id = :org" if org else ""
    current_filter = "AND is_current = 1" if current_only else ""
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT org_id, rule_title
            FROM rules
            WHERE 1 = 1 {org_filter} {current_filter}
            """,
            {"org": org},
        ).fetchall()

    by_doc_type: Counter = Counter()
    by_org: Counter = Counter()
    for row in rows:
        by_doc_type[_derive_doc_type(row["rule_title"])] += 1
        by_org[row["org_id"]] += 1
    return {
        "total": len(rows),
        "by_doc_type": dict(by_doc_type.most_common()),
        "by_org": dict(by_org.most_common()),
    }


def search_rules(
    query: str,
    limit: int = 10,
    org: str | None = None,
    offset: int = 0,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    """규정을 검색한다. 제목·ID(LIKE)뿐 아니라 본문(FTS bm25)까지 대상으로 하며
    관련도순으로 정렬한다. offset 으로 페이지네이션 가능.

    정렬: primary 기관 → 제목/ID 직접 일치 → 본문 관련도(bm25) → 현행 → 제목.
    각 결과에 doc_type(규정/방침/요령…)을 파생해 포함한다.
    """
    query = query.strip()
    if not query:
        return []

    like_query = f"%{query}%"
    org_filter = "AND r.org_id = :org" if org else ""
    primary_expr, primary_params = _primary_named("r.org_id")
    params = {
        "q": _fts_query(query),
        "like": like_query,
        "org": org,
        "limit": limit,
        "offset": max(0, offset),
        **primary_params,
    }
    with connect(db_path) as conn:
        # 본문 관련도: FTS bm25 점수를 임시 테이블로 실체화한 뒤 규정별 최적 점수로 집계.
        # (bm25()는 aggregate 인자나 join/CTE 경유가 불가하므로 직접 SELECT로 먼저 저장한다.)
        body_ok = True
        try:
            conn.execute("DROP TABLE IF EXISTS temp._body_scores")
            conn.execute(
                """
                CREATE TEMP TABLE _body_scores AS
                SELECT c.org_id AS oid, c.rule_id AS rid, bm25(chunks_fts) AS s
                FROM chunks_fts
                JOIN chunks c ON c.id = chunks_fts.rowid
                WHERE chunks_fts MATCH :q
                """,
                {"q": params["q"]},
            )
            # trigram FTS는 3글자 미만 질의를 못 잡는다. 매칭이 비면 본문 LIKE로
            # 멤버십만 보완(점수 NULL → FTS 매칭 뒤에 정렬).
            if conn.execute("SELECT COUNT(*) FROM _body_scores").fetchone()[0] == 0:
                like_org = "AND c.org_id = :org" if org else ""
                conn.execute(
                    f"""
                    INSERT INTO _body_scores(oid, rid, s)
                    SELECT DISTINCT c.org_id, c.rule_id, NULL
                    FROM chunks c
                    WHERE c.text LIKE :like {like_org}
                    """,
                    {"like": like_query, "org": org},
                )
        except sqlite3.OperationalError:
            body_ok = False       # FTS5 미지원 환경

        if body_ok:
            rows = conn.execute(
                f"""
                WITH body AS (
                    SELECT oid, rid, MIN(s) AS best_score
                    FROM _body_scores GROUP BY oid, rid
                )
                SELECT
                    r.org_id,
                    r.rule_id,
                    r.rule_title,
                    r.is_current,
                    {primary_expr} AS is_primary,
                    COUNT(c.id) AS chunk_count,
                    ((r.rule_title LIKE :like) OR (r.rule_id LIKE :like)) AS title_hit,
                    b.best_score AS score
                FROM rules r
                LEFT JOIN chunks c ON c.org_id = r.org_id AND c.rule_id = r.rule_id
                LEFT JOIN body   b ON b.oid = r.org_id AND b.rid = r.rule_id
                WHERE ((r.rule_title LIKE :like) OR (r.rule_id LIKE :like)
                       OR b.rid IS NOT NULL)
                  {org_filter}
                GROUP BY r.org_id, r.rule_id
                ORDER BY is_primary DESC, title_hit DESC,
                         (score IS NULL), score,
                         r.is_current DESC, r.rule_title
                LIMIT :limit OFFSET :offset
                """,
                params,
            ).fetchall()
            conn.execute("DROP TABLE IF EXISTS temp._body_scores")
        else:
            # 제목/ID LIKE 전용 폴백
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
                LIMIT :limit OFFSET :offset
                """,
                params,
            ).fetchall()
    result = [_row_to_dict(row) for row in rows]
    for row in result:
        row["doc_type"] = _derive_doc_type(row.get("rule_title", ""))
    return result


def search_articles(
    query: str,
    limit: int = 10,
    org: str | None = None,
    offset: int = 0,
    db_path: str | Path = DEFAULT_DB_PATH,
) -> list[dict[str, Any]]:
    query = query.strip()
    if not query:
        return []

    offset = max(0, offset)
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
                LIMIT :limit OFFSET :offset
                """,
                {"q": _fts_query(query), "org": org, "limit": limit,
                 "offset": offset, **primary_params},
            ).fetchall()
        except sqlite3.OperationalError:
            rows = _like_search(conn, query, limit, org=org, offset=offset)
        if not rows:
            rows = _like_search(conn, query, limit, org=org, offset=offset)
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
              AND (rule_id = :name OR nrm(rule_title) LIKE :like_nrm)
              AND article_no = :article_no
              {org_filter}
            ORDER BY {primary_expr} DESC, part_idx, id
            """,
            {
                "name": rule_name,
                "like_nrm": "%" + _normalize_name(rule_name) + "%",
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
              AND (rule_id = :name OR nrm(rule_title) LIKE :like_nrm)
              AND article_no IS NOT NULL AND article_no != ''
              AND article_title IS NOT NULL AND article_title != ''
              {org_filter}
            GROUP BY org_id, rule_id, article_no
            ORDER BY {primary_expr} DESC, rule_id, article_no
            """,
            {
                "name": rule_name,
                "like_nrm": "%" + _normalize_name(rule_name) + "%",
                "org": org,
                **primary_params,
            },
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
              AND (rule_id = :name OR nrm(rule_title) LIKE :like_nrm)
              {annex_filter}
              {org_filter}
            ORDER BY {primary_expr} DESC, article_no, part_idx, id
            """,
            {
                "name": rule_name,
                "like_nrm": "%" + _normalize_name(rule_name) + "%",
                "annex_no": f"%{annex_no}%",
                "org": org,
                **primary_params,
            },
        ).fetchall()
    return [_row_to_dict(row) for row in rows]


def get_rule_full(
    rule_name: str,
    org: str | None = None,
    include_annex: bool = False,
    max_chars: int = 15000,
    start_article: str = "",
    db_path: str | Path = DEFAULT_DB_PATH,
) -> dict[str, Any]:
    """규정 전문을 한 번에 반환한다(조문 병합).

    - 매칭된 규정 중 primary·현행을 우선해 단일 rule_id를 선택.
    - (article_no, part_idx) 기준으로 중복 청크를 흡수하고 조 순서로 정렬·병합.
    - 별표(annex)는 기본 제외(include_annex=True 시 별도 키로 반환).
    - 본문이 max_chars 를 넘으면 조 경계에서 잘라 truncated/next_start_article 반환
      (max_chars=0 이면 제한 없음). start_article 을 주면 그 조부터 이어받는다.
    """
    name = (rule_name or "").strip()
    if not name:
        return {}
    org_filter = "AND org_id = :org" if org else ""
    primary_expr, primary_params = _primary_named("org_id")
    params = {
        "name": name,
        "like_nrm": "%" + _normalize_name(name) + "%",
        "org": org,
        **primary_params,
    }
    with connect(db_path) as conn:
        head = conn.execute(
            f"""
            SELECT org_id, rule_id, rule_title, MAX(is_current) AS is_current
            FROM chunks
            WHERE (rule_id = :name OR nrm(rule_title) LIKE :like_nrm)
              {org_filter}
            GROUP BY org_id, rule_id
            ORDER BY {primary_expr} DESC, is_current DESC, rule_id
            LIMIT 1
            """,
            params,
        ).fetchone()
        if not head:
            return {}
        org_id = head["org_id"]
        rule_id = head["rule_id"]
        rule_title = head["rule_title"]
        rows = conn.execute(
            """
            SELECT chunk_type, article_no, article_title, text, part_idx,
                   source_pdf, pdf_page_start
            FROM chunks
            WHERE org_id = ? AND rule_id = ?
            """,
            (org_id, rule_id),
        ).fetchall()

    # (article_no, part_idx) dedupe 후 병합
    intro_parts: dict[int, str] = {}
    articles: dict[str, dict] = {}
    annexes: dict[str, dict] = {}
    for r in rows:
        ctype = r["chunk_type"]
        ano = r["article_no"] or ""
        pidx = r["part_idx"] or 0
        if ctype == "article":
            entry = articles.setdefault(ano, {"title": r["article_title"] or "", "parts": {}})
            entry["parts"].setdefault(pidx, r["text"])
        elif ctype == "annex":
            annexes.setdefault(ano, {"parts": {}})["parts"].setdefault(pidx, r["text"])
        elif ctype == "intro":
            intro_parts.setdefault(pidx, r["text"])

    def _merge(parts: dict[int, str]) -> str:
        return "\n".join(parts[k] for k in sorted(parts)).strip()

    ordered = sorted(articles.items(), key=lambda kv: _article_sort_key(kv[0]))
    all_articles = [
        {"article_no": ano, "article_title": d["title"], "text": _merge(d["parts"])}
        for ano, d in ordered
    ]
    total_chars = sum(len(a["text"]) for a in all_articles)

    start_key = re.sub(r"\s+", "", start_article or "")
    started = not start_key
    intro_text = "" if start_key else _merge(intro_parts)

    out: list[dict] = []
    used = len(intro_text)
    truncated = False
    next_start = None
    for a in all_articles:
        if not started:
            if re.sub(r"\s+", "", a["article_no"]) == start_key:
                started = True
            else:
                continue
        alen = len(a["text"]) + len(a["article_no"]) + len(a["article_title"])
        if out and max_chars and used + alen > max_chars:
            truncated = True
            next_start = a["article_no"]
            break
        out.append(a)
        used += alen

    result: dict[str, Any] = {
        "org_id": org_id,
        "rule_id": rule_id,
        "rule_title": rule_title,
        "is_current": head["is_current"],
        "article_count": len(all_articles),
        "returned_articles": len(out),
        "total_chars": total_chars,
        "returned_chars": used,
        "truncated": truncated,
        "next_start_article": next_start,
        "intro": intro_text,
        "articles": out,
    }
    if include_annex:
        annex_sorted = sorted(annexes.items(), key=lambda kv: _article_sort_key(kv[0]))
        result["annexes"] = [
            {"annex_no": k, "text": _merge(v["parts"])} for k, v in annex_sorted
        ]
    else:
        result["annex_count"] = len(annexes)
    return result


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
    offset: int = 0,
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
    params.append(max(0, offset))

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
        LIMIT ? OFFSET ?
        """,
        params,
    ).fetchall()


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}
