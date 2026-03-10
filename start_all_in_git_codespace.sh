#!/bin/bash
set -e

echo "========================================"
echo "  NestJS + React + Supabase Boilerplate"
echo "  GitHub Codespaces Setup"
echo "========================================"

# Derive Codespace base URL
CODESPACE_NAME=$(gh codespace view | awk '/Name/{print $2; exit}')
BACKEND_URL="https://${CODESPACE_NAME}-6001.app.github.dev"
FRONTEND_URL="https://${CODESPACE_NAME}-3000.app.github.dev"

# ── BACKEND ──────────────────────────────────
echo ""
echo "[BACKEND] Setting up..."

cd backend/

cp .env.example .env

# Append Codespace-specific values
echo "" >> .env
echo "FRONTEND_URL=${FRONTEND_URL}" >> .env

npm install
docker-compose up --build -d
npm run db:seed
npm run swagger:ts

echo "[BACKEND] Ready at ${BACKEND_URL}"
echo "[BACKEND] Swagger at ${BACKEND_URL}/api"

# ── FRONTEND ─────────────────────────────────
echo ""
echo "[FRONTEND] Setting up..."

cd ../frontend/

cp .env.example .env

# Set Codespace backend URL
echo "" >> .env
echo "VITE_BACKEND_API_URL=${BACKEND_URL}" >> .env

cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm install
docker-compose --profile dev up --build -d

echo "[FRONTEND] Ready at ${FRONTEND_URL}"
echo ""
echo "All done!"
