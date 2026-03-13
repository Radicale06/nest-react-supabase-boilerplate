[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/hassenamri005/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

# Backend — NestJS API

NestJS 10 REST API with Supabase Auth, Prisma (empty schema ready for custom tables), and Docker.

## Stack

- **NestJS 10** — Node.js framework
- **Prisma 5** — ORM (schema is empty, ready for your models)
- **Supabase Auth** — authentication proxied through the API
- **Node 20**, TypeScript, ESLint v9

## Auth Flow

```
POST /auth/login    → supabase.auth.signInWithPassword()
POST /auth/register → supabase.auth.admin.createUser()
POST /auth/refresh-token
POST /auth/request-reset-password-email
POST /auth/reset-password
GET  /auth/me       → requires Bearer token
```

Protected routes use `SupabaseAuthGuard` — validates the JWT via `supabase.auth.getUser(token)`.

Response shape: `{ accessToken, refreshToken, user: { id, email, roleId } }`
`roleId` comes from `user.app_metadata.roleId` (default: 3).

## Environment

Copy `.env.example` to `.env` and fill in the values:

```
SUPABASE_URL=http://localhost:8000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
APP_PORT=6001
FRONTEND_URL=http://localhost:3000
```

## Run with Docker

**Development:**
```sh
docker compose -f docker-compose.yaml up --build
```

**Production:**
```sh
docker compose -f docker-compose.prod.yaml up --build
```

The dev container runs `scripts/start.dev.sh` which:
1. Generates Prisma client
2. Deploys migrations
3. Seeds Supabase users
4. Starts the app in watch mode

## Run Locally (no Docker)

```sh
npm install
npm run start:dev
```

## Useful Commands

```sh
npm run db:migrate          # create a new migration
npm run db:migrate:deploy   # deploy migrations
npm run db:seed             # seed Supabase users
npm run db:studio           # open Prisma Studio
npm run swagger:ts          # generate API client from swagger.json
```

## Seeded Users

| Email | Password | Role |
|---|---|---|
| superadmin@mail.com | password123 | SUPERADMIN (roleId 1) |
| admin@mail.com | password123 | ADMIN (roleId 2) |
| user@mail.com | password123 | USER (roleId 3) |

## Swagger

Available at `http://localhost:6001/api` when the server is running.
