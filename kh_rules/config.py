import json
import os
from pathlib import Path

PRIMARY_ORG: str = os.environ.get("KH_PRIMARY_ORG", "ADD")

PROJECT_ROOT = Path(__file__).resolve().parent
_ORGS_PATH = PROJECT_ROOT / "orgs.json"

_DEFAULT_ORGS: dict[str, dict] = {
    "ADD":  {"name": "국방과학연구소",   "aliases": ["국과연"]},
    "KRIT": {"name": "국방기술진흥연구소", "aliases": ["국기연"]},
    "KARI": {"name": "한국항공우주연구원", "aliases": ["항우연"]},
}


def load_orgs() -> dict[str, dict[str, str]]:
    """orgs.json에서 기관 목록을 읽어 반환. 없으면 기본값 사용."""
    if _ORGS_PATH.exists():
        try:
            data = json.loads(_ORGS_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict) and data:
                return data
        except Exception:
            pass
    return dict(_DEFAULT_ORGS)


def save_orgs(orgs: dict[str, dict[str, str]]) -> None:
    """기관 목록을 orgs.json에 저장."""
    _ORGS_PATH.write_text(
        json.dumps(orgs, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# 모듈 로드 시 orgs.json → 없으면 기본값
ORGS: dict[str, dict] = load_orgs()


def _compute_primary_orgs(orgs: dict[str, dict]) -> list[str]:
    """is_primary=true 인 기관 ID 목록. 없으면 PRIMARY_ORG(환경변수) fallback."""
    result = [oid for oid, info in orgs.items() if info.get("is_primary", False)]
    return result or [PRIMARY_ORG]


# 런타임에 in-place 수정 가능한 mutable list — rule_db 등이 참조를 유지한다.
PRIMARY_ORGS: list[str] = _compute_primary_orgs(ORGS)


def set_org_primary(org_id: str, is_primary: bool) -> None:
    """기관의 primary 여부를 변경하고 ORGS·PRIMARY_ORGS·orgs.json에 반영한다.

    primary로 지정하면 기존 primary 기관은 자동으로 해제된다 (단일 primary 보장).
    """
    if is_primary:
        # 기존 primary 전부 해제 후 새 기관 지정
        for oid in ORGS:
            ORGS[oid]["is_primary"] = (oid == org_id)
        PRIMARY_ORGS.clear()
        PRIMARY_ORGS.append(org_id)
    else:
        # primary 해제만 (빈 상태 허용 — fallback은 _compute_primary_orgs 참고)
        if org_id in ORGS:
            ORGS[org_id]["is_primary"] = False
        if org_id in PRIMARY_ORGS:
            PRIMARY_ORGS.remove(org_id)
    save_orgs(ORGS)


def build_org_lookup(orgs: dict[str, dict] | None = None) -> dict[str, str]:
    """org_id·기관명·별칭 → 정규 org_id 소문자 역인덱스.

    예: {"add": "ADD", "국방과학연구소": "ADD", "국과연": "ADD", ...}
    AI가 어떤 표현으로 기관을 지칭해도 올바른 org_id로 해석하기 위해 사용한다.
    """
    if orgs is None:
        orgs = ORGS
    lookup: dict[str, str] = {}
    for org_id, info in orgs.items():
        lookup[org_id.lower()] = org_id
        name = info.get("name", "")
        if name:
            lookup[name] = org_id
        for alias in info.get("aliases", []):
            if alias:
                lookup[alias] = org_id
    return lookup
