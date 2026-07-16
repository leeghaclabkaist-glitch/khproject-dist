# KH Project MCP 배포 패키지

**버전:** v0.0.6

Claude Desktop에서 내부 규정 DB와 국가법령을 검색할 수 있는 MCP 서버 패키지입니다.

---

## 포함된 MCP 서버

| 서버 | 설명 |
|------|------|
| `kh_rules` | 내부 규정 DB 검색 (규정명 · 조문 · 별표 전문 검색, 규정 목록 · 개수 조회) |
| `korean-law-mcp-kh` | 국가법령정보 검색 (법령 · 판례 · 행정해석) |

---

## 사전 요구사항

### Python 3.10 이상
- https://www.python.org/downloads/
- 설치 시 **"Add Python to PATH"** 체크 필수

```
python --version
```

### Node.js 18 이상 (LTS)
- https://nodejs.org/

```
node --version
```

---

## 설치

### 1. 다운로드 및 압축 해제

[Releases](../../releases/latest) 페이지에서 `khproject_dist.zip` 다운로드 후 원하는 경로에 압축 해제합니다.

```
예: C:\tools\khproject_dist\
```

### 2. 패키지 설치

압축 해제된 폴더에서 `setup.bat` 더블클릭

---

## Claude Desktop 설정

### 1. 법제처 API 키 발급 (국가법령 서버용)

https://open.law.go.kr 접속 → 회원가입 → API 신청

### 2. 설정 파일 열기

```
C:\Users\[사용자이름]\AppData\Roaming\Claude\claude_desktop_config.json
```

> AppData 폴더가 안 보이면 탐색기 주소창에 `%APPDATA%\Claude` 직접 입력

### 3. 설정 추가

`[설치경로]`와 `[API키]`를 실제 값으로 교체합니다.

```json
{
  "mcpServers": {
    "내부규정DB": {
      "command": "python",
      "args": ["-X", "utf8", "[설치경로]\\kh_rules\\mcp_server.py"]
    },
    "국가법령": {
      "command": "node",
      "args": ["[설치경로]\\korean-law-mcp-kh\\build\\index.js"],
      "env": {
        "LAW_OC": "[API키]",
        "NODE_OPTIONS": "--use-system-ca"
      }
    }
  }
}
```

**예시** (설치 경로: `C:\tools\khproject_dist`):

```json
{
  "mcpServers": {
    "내부규정DB": {
      "command": "python",
      "args": ["-X", "utf8", "C:\\tools\\khproject_dist\\kh_rules\\mcp_server.py"]
    },
    "국가법령": {
      "command": "node",
      "args": ["C:\\tools\\khproject_dist\\korean-law-mcp-kh\\build\\index.js"],
      "env": {
        "LAW_OC": "여기에API키입력",
        "NODE_OPTIONS": "--use-system-ca"
      }
    }
  }
}
```

> 이미 다른 MCP 서버가 등록되어 있다면 `"mcpServers"` 안에 위 내용을 추가합니다.

### 4. Claude Desktop 재시작

설정 저장 후 Claude Desktop을 완전히 종료했다가 다시 실행합니다.

### 5. 확인

채팅창 좌측 하단에 MCP 도구 아이콘이 표시되면 정상 등록 완료입니다.

---

## 지원 기관 (내부규정DB)

| ID | 기관명 | 별칭 |
|----|--------|------|
| ADD | 국방과학연구소 | 국과연 |
| KRIT | 국방기술진흥연구소 | 국기연 |
| DTAQ | 국방기술품질원 | 기품원 |

---

## 출처 및 라이선스

`korean-law-mcp-kh`는 [chrisryugj/korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp)를 기반으로 기능을 추가·수정한 포크 버전입니다.

---

## 릴리스 노트

### v0.0.6
- 규정명 매칭 개선: 괄호 표기(개정 표기 등)를 저장·질의 양쪽에서 동일하게 제거해 비교.
  "휴직자 복무관리 방침(21년 6월 개정)"처럼 개정 표기가 붙은 원표기도 인식(공백·괄호 유무 무관).

### v0.0.5
- **get_rule_full 도구 추가**: 규정 본문 전문을 한 번에 조회(조문 병합). 중복 청크 자동 제거,
  별표는 기본 제외, 긴 규정은 max_chars(기본 15000) 초과 시 이어받기 지원.
- 조회 도구(get_article/get_toc/get_annex/get_rule_full)의 규정명 매칭을 공백무시로 통일
  ("휴직자 복무관리 방침"·"휴직자복무관리방침" 모두 인식).

### v0.0.4
- ALIO 원본 PDF가 '모아 찍기(2쪽 모아)' 형태여서 조문이 뒤섞이던 규정 수정
  (휴직자 복무관리 방침, 절충교역 업무방침 등). 세로 1쪽으로 복원 후 재색인.

### v0.0.3
- 내부규정DB 검색 개선:
  - 규정 **목록/개수 조회** 추가 (`list_rules` / `count_rules`) — 검색어 없이 기관·종류별 전수 조회. 종류(규정/방침/요령 등)는 규정명 접미어에서 파생.
  - **규정 검색이 본문(조문)까지 대상**으로 확장되고 관련도(bm25)순 정렬로 개선.
  - 검색 결과 **페이지네이션**(offset) 지원.
- HWP→PDF "모아 찍기(2쪽 모아)" 변환으로 일부 규정 본문이 뒤섞이던 문제 수정 후 ADD 규정 DB 재빌드 (현행 213건).

### v0.0.2
- `korean-law-mcp-kh`를 원본 upstream 4.0.3 → 4.7.3으로 업데이트
  (신규: 다단계 리서치, 정밀분석, 시점 비교, 시민 5단계 안내 등)
- KH 커스텀 기능(편/장/절/관 계층 위치 표시)은 새 버전에도 유지
- 보안 수정: 이전 빌드에 포함되어 있던 하드코딩 API 키 fallback 제거

### v0.0.1
- 최초 배포
- 내부규정DB: ADD / KRIT / DTAQ 다기관 지원
- 국가법령: 법령 · 판례 · 행정해석 검색 지원
