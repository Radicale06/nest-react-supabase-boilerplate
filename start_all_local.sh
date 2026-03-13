#!/bin/bash
set -e

echo "========================================"
echo "  NestJS + React + Supabase Boilerplate"
echo "  Local Dev Setup"
echo "========================================"

# ── SUPABASE ─────────────────────────────────
echo ""
echo "[SUPABASE] Creating Docker network..."
docker network create network 2>/dev/null || echo "[SUPABASE] Network already exists, skipping."

echo "[SUPABASE] Starting self-hosted Supabase..."
cd supabase/
docker compose up -d
echo "[SUPABASE] Waiting for Supabase to be ready..."
sleep 15
echo "[SUPABASE] Ready at http://localhost:8000"
echo "[SUPABASE] Studio at http://localhost:54323"

# ── BACKEND ──────────────────────────────────
echo ""
echo "[BACKEND] Setting up..."

cd ../backend/

if [ ! -f .env ]; then
  cp .env.example .env
  echo "[BACKEND] .env created from .env.example — fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before continuing."
  exit 1
fi

npm install
docker-compose up --build -d
npm run db:seed

echo "[BACKEND] Ready at http://localhost:6001"
echo "[BACKEND] Swagger at http://localhost:6001/api"

# ── FRONTEND ─────────────────────────────────
echo ""
echo "[FRONTEND] Setting up..."

cd ../frontend/

if [ ! -f .env ]; then
  cp .env.example .env
  echo "[FRONTEND] .env created from .env.example — fill in VITE_SUPABASE_ANON_KEY before continuing."
  exit 1
fi

cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm install
docker-compose --profile dev up --build -d

echo "[FRONTEND] Ready at http://localhost:3000"
echo ""
echo "All done!"
