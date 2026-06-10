import json
import sys

from mcp.server.fastmcp import FastMCP

from config import PRIMARY_ORG, PRIMARY_ORGS, ORGS, build_org_lookup
from rule_db import (
    get_annex as db_get_annex,
    get_article as db_get_article,
    get_toc as db_get_toc,
    search_articles as db_search_articles,
    search_rules as db_search_rules,
)


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


mcp = FastMCP("Internal_Rules_DB")

def _primary_names() -> str:
    """현재 primary 기관 명칭 목록 문자열 (도구 설명용)."""
    names = [ORGS.get(oid, {}).get("name", oid) for oid in PRIMARY_ORGS]
    return ", ".join(names) if names else PRIMARY_ORG

_PRIMARY_NAME = _primary_names()
_ORG_LOOKUP: dict[str, str] = build_org_lookup()


def _json(data: object) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2)


def _resolve_org(org: str) -> str | None:
    """org_id·기관명·별칭 → 정규 org_id. 빈 문자열 → None(전체 검색).

    예: "국과연" → "ADD", "국방기술진흥연구소" → "KRIT", "dtaq" → "DTAQ"
    인식 불가 문자열은 그대로 반환(DB가 빈 결과를 돌려줌으로써 안전하게 처리).
    """
    v = org.strip()
    if not v:
        return None
    return _ORG_LOOKUP.get(v) or _ORG_LOOKUP.get(v.lower()) or v


def _org_ref() -> str:
    """도구 설명에 삽입할 기관 ID·명칭·별칭 참조 테이블 문자열을 반환한다."""
    lines = ["    기관 org 파라미터 참조표 (ID / 공식명 / 별칭):"]
    for org_id, info in ORGS.items():
        name    = info.get("name", "")
        aliases = ", ".join(info.get("aliases", []))
        marker  = " ★primary" if org_id in PRIMARY_ORGS else ""
        alias_part = f" / {aliases}" if aliases else ""
        lines.append(f"      {org_id} / {name}{alias_part}{marker}")
    lines.append('    "" → 전체 기관 검색 (primary 기관 결과 우선 정렬)')
    return "\n".join(lines)


@mcp.tool()
def search_rules(query: str, limit: int = 10, org: str = "") -> str:
    """
    내부 규정의 규정명과 규정 ID를 검색합니다.

    사용 시점:
    - 사용자가 특정 주제, 업무, 절차에 어떤 내부 규정이 적용되는지 묻는 경우 먼저 사용하세요.
    - 정확한 규정명을 모를 때 후보 규정을 찾기 위해 사용하세요.
    - 결과에는 org_id, 규정 ID, 규정명, 현행 여부, is_primary(primary 기관 여부) 가 포함됩니다.

{org_ref}

    예: search_rules("출장"), search_rules("개인정보"), search_rules("계약", org="ADD"),
        search_rules("계약", org="국과연"), search_rules("급여", org="국기연")
    """.format(org_ref=_org_ref())
    return _json(db_search_rules(query, limit=limit, org=_resolve_org(org)))


@mcp.tool()
def search_articles(query: str, limit: int = 10, org: str = "") -> str:
    """
    내부 규정의 조문, 별표, 별지, 부칙 본문을 전문 검색합니다.

    사용 시점:
    - 사용자가 내부 규정의 구체적인 요건, 절차, 권한, 기준, 금액, 기한 등을 묻는 경우 사용하세요.
    - 규정명보다 질의 키워드가 더 명확한 경우 이 도구로 관련 조문을 직접 찾으세요.
    - 답변할 때는 규정명, 조문 번호, 조문 제목, org_id(기관), 출처 PDF, PDF 페이지 정보를 근거로 제시하세요.
    - 검색 결과가 여러 조각으로 나뉜 경우 part_idx/part_total을 확인해 이어지는 조문인지 판단하세요.
    - is_primary=1이면 primary 기관(현재: {primary}) 규정, 0이면 참고용 타 기관 규정입니다.

{org_ref}

    예: search_articles("출장 여비 지급 기준"), search_articles("개인정보 파기"),
        search_articles("수의계약", org="국과연"), search_articles("급여", org="기품원")
    """.format(primary=_PRIMARY_NAME, org_ref=_org_ref())
    return _json(db_search_articles(query, limit=limit, org=_resolve_org(org)))


@mcp.tool()
def get_article(rule_name: str, article_no: str, org: str = "") -> str:
    """
    특정 규정의 특정 조문 원문을 가져옵니다.

    사용 시점:
    - 규정명 또는 rule_id와 조문 번호를 이미 알고 있고, 정확한 조문 원문이 필요할 때 사용하세요.
    - search_rules 또는 search_articles로 후보를 찾은 뒤, 인용할 조문을 확정할 때 사용하면 좋습니다.
    - rule_name에는 규정명 전체/일부 또는 rule_id를 사용할 수 있습니다.
    - article_no는 "제1조", "제10조"처럼 데이터에 저장된 조문 번호 형식으로 입력하세요.
    - org를 지정하면 해당 기관의 규정만 검색합니다. 같은 규정명이 여러 기관에 있을 때 유용합니다.

{org_ref}

    예: get_article("개인정보보호업무규정", "제1조"), get_article("급여규정", "제5조", org="ADD"),
        get_article("급여규정", "제5조", org="국과연")
    """.format(org_ref=_org_ref())
    return _json(db_get_article(rule_name, article_no, org=_resolve_org(org)))


@mcp.tool()
def get_annex(rule_name: str, annex_no: str = "", org: str = "") -> str:
    """
    규정의 별표, 별지, 서식, 부칙 등 annex 성격의 원문을 가져옵니다.

    사용 시점:
    - 사용자가 별표, 별지, 서식, 첨부 양식, 부칙, 세부 기준표를 묻는 경우 사용하세요.
    - annex_no를 비우면 해당 규정의 annex 성격 chunk를 가능한 범위에서 반환합니다.
    - 특정 별표/별지를 찾을 때는 "별표 1", "별지 제2호", "부칙"처럼 입력하세요.
    - 답변할 때는 규정명, annex 번호, org_id(기관), 출처 PDF, PDF 페이지 정보를 함께 근거로 제시하세요.

{org_ref}

    예: get_annex("개인정보보호업무규정", "별표 2"), get_annex("급여규정", org="ADD"),
        get_annex("급여규정", org="국과연"), get_annex("여비", org="기품원")
    """.format(org_ref=_org_ref())
    return _json(db_get_annex(rule_name, annex_no, org=_resolve_org(org)))


@mcp.tool()
def get_toc(rule_name: str, include_annex: bool = False, org: str = "") -> str:
    """
    특정 규정의 전체 조문 목차(조번호 + 조제목)를 반환합니다.

    사용 시점:
    - 특정 규정의 전체 조문 목차를 조회할 때 사용하세요.
    - search_articles로 키워드 검색 전에 어떤 조문이 존재하는지 파악하거나,
      get_article로 조회할 조문 번호를 확인할 때 활용하세요.
    - rule_name에는 규정명 전체/일부 또는 rule_id를 사용할 수 있습니다.
    - include_annex=True로 설정하면 별표·별지·부칙 등 annex 항목도 목차에 포함됩니다.
    - 같은 규정명이 여러 기관에 있을 경우 org로 기관을 특정하세요.

{org_ref}

    예: get_toc("개인정보보호업무규정"), get_toc("출장", include_annex=True, org="ADD"),
        get_toc("출장", org="국과연"), get_toc("복무", org="국기연")
    """.format(org_ref=_org_ref())
    return _json(db_get_toc(rule_name, include_annex=include_annex, org=_resolve_org(org)))


if __name__ == "__main__":
    mcp.run()
