@echo off
chcp 65001 >nul
echo ===================================================
echo  KH Project 설치 스크립트
echo ===================================================
echo.

echo [1/2] Python 패키지 설치 중...
pip install mcp
if %errorlevel% neq 0 (
    echo [오류] pip 실패. Python이 설치되어 있는지 확인하세요.
    pause
    exit /b 1
)

echo.
echo [2/2] Node.js 패키지 설치 중...
cd korean-law-mcp-kh
npm install --production
if %errorlevel% neq 0 (
    echo [오류] npm 실패. Node.js가 설치되어 있는지 확인하세요.
    pause
    exit /b 1
)
cd ..

echo.
echo ===================================================
echo  설치 완료!
echo ===================================================
pause
