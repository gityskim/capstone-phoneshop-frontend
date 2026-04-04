#!/bin/bash

# ====================================================
# 프론트엔드 배포 스크립트 (EC2용)
# 사용법: bash deploy_frontend.sh
# ====================================================

set -e  # 에러 발생 시 즉시 중단

FRONTEND_DIR="$HOME/capstone-phoneshop-frontend"
BUILD_DIR="$FRONTEND_DIR/build"

echo "======================================"
echo "  프론트엔드 배포 시작"
echo "======================================"

# 1. 프론트엔드 디렉토리로 이동
cd "$FRONTEND_DIR"
echo "[1/4] 디렉토리: $FRONTEND_DIR"

# 2. 최신 코드 pull
echo "[2/4] git pull 중..."
git pull origin main

# 3. 의존성 설치 (package.json 변경 시만 실제로 설치됨)
echo "[3/4] npm install 중..."
npm install

# 4. 프로덕션 빌드
echo "[4/4] npm run build 중..."
npm run build

echo ""
echo "======================================"
echo "  빌드 완료!"
echo "  빌드 결과: $BUILD_DIR"
echo "  Nginx가 자동으로 새 빌드를 서비스합니다."
echo "======================================"
