#!/bin/bash
set -e

echo "========================================"
echo "  NestJS + React + Supabase Boilerplate"
echo "  Gitpod Setup"
echo "========================================"

# ── BACKEND ──────────────────────────────────
echo ""
echo "[BACKEND] Setting up..."

cd backend/

cp .env.example .env

# Append Gitpod-specific values
echo "" >> .env
echo "FRONTEND_URL=$(gp url 3000)" >> .env

npm install
docker-compose up --build -d
npm run db:seed
npm run swagger:ts

echo "[BACKEND] Ready at $(gp url 6001)"
echo "[BACKEND] Swagger at $(gp url 6001)/api"

# ── FRONTEND ─────────────────────────────────
echo ""
echo "[FRONTEND] Setting up..."

cd ../frontend/

cp .env.example .env

# Set Gitpod backend URL
echo "" >> .env
echo "VITE_BACKEND_API_URL=$(gp url 6001)" >> .env

cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm install
docker-compose --profile dev up --build -d

echo "[FRONTEND] Ready at $(gp url 3000)"
echo ""
echo "All done!"
