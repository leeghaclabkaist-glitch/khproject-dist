# KH Project MCP 배포 패키지

**버전:** v0.0.1

Claude Desktop에서 내부 규정 DB와 국가법령을 검색할 수 있는 MCP 서버 패키지입니다.

---

## 포함된 MCP 서버

| 서버 | 설명 |
|------|------|
| `kh_rules` | 내부 규정 DB 검색 (규정명 · 조문 · 별표 전문 검색) |
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
      "args": ["[설치경로]\\kh_rules\\mcp_server.py"],
      "cwd": "[설치경로]\\kh_rules"
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
      "args": ["C:\\tools\\khproject_dist\\kh_rules\\mcp_server.py"],
      "cwd": "C:\\tools\\khproject_dist\\kh_rules"
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

## 릴리스 노트

### v0.0.1
- 최초 배포
- 내부규정DB: ADD / KRIT / DTAQ 다기관 지원
- 국가법령: 법령 · 판례 · 행정해석 검색 지원
