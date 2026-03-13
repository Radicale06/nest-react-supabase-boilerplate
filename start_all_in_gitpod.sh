#!/bin/bash
set -e

echo "========================================"
echo "  NestJS + React + Supabase Boilerplate"
echo "  Gitpod Setup"
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
echo "[SUPABASE] Ready at $(gp url 8000)"

# ── BACKEND ──────────────────────────────────
echo ""
echo "[BACKEND] Setting up..."

cd ../backend/

cp .env.example .env
echo "" >> .env
echo "FRONTEND_URL=$(gp url 3000)" >> .env

npm install
docker-compose up --build -d
npm run db:seed

echo "[BACKEND] Ready at $(gp url 6001)"
echo "[BACKEND] Swagger at $(gp url 6001)/api"

# ── FRONTEND ─────────────────────────────────
echo ""
echo "[FRONTEND] Setting up..."

cd ../frontend/

cp .env.example .env
echo "" >> .env
echo "VITE_BACKEND_API_URL=$(gp url 6001)" >> .env

cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm install
docker-compose --profile dev up --build -d

echo "[FRONTEND] Ready at $(gp url 3000)"
echo ""
echo "All done!"
