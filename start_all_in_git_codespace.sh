#!/bin/bash
set -e

echo "========================================"
echo "  NestJS + React + Supabase Boilerplate"
echo "  GitHub Codespaces Setup"
echo "========================================"

CODESPACE_NAME=$(gh codespace view | awk '/Name/{print $2; exit}')
BACKEND_URL="https://${CODESPACE_NAME}-6001.app.github.dev"
FRONTEND_URL="https://${CODESPACE_NAME}-3000.app.github.dev"
SUPABASE_URL="https://${CODESPACE_NAME}-8000.app.github.dev"

# ── SUPABASE ─────────────────────────────────
echo ""
echo "[SUPABASE] Creating Docker network..."
docker network create network 2>/dev/null || echo "[SUPABASE] Network already exists, skipping."

echo "[SUPABASE] Starting self-hosted Supabase..."
cd supabase/
docker compose up -d
echo "[SUPABASE] Waiting for Supabase to be ready..."
sleep 15
echo "[SUPABASE] Ready at ${SUPABASE_URL}"

# ── BACKEND ──────────────────────────────────
echo ""
echo "[BACKEND] Setting up..."

cd ../backend/

cp .env.example .env
echo "" >> .env
echo "FRONTEND_URL=${FRONTEND_URL}" >> .env

npm install
docker-compose up --build -d
npm run db:seed

echo "[BACKEND] Ready at ${BACKEND_URL}"
echo "[BACKEND] Swagger at ${BACKEND_URL}/api"

# ── FRONTEND ─────────────────────────────────
echo ""
echo "[FRONTEND] Setting up..."

cd ../frontend/

cp .env.example .env
echo "" >> .env
echo "VITE_BACKEND_API_URL=${BACKEND_URL}" >> .env

cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm install
docker-compose --profile dev up --build -d

echo "[FRONTEND] Ready at ${FRONTEND_URL}"
echo ""
echo "All done!"
