[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-yellow)](https://github.com/your-profile/your-repo/releases)

<div align="center">
  <h1>NestJS · React TS · Supabase Boilerplate 🚀</h1>
  <p>A full-stack boilerplate integrating <b>NestJS</b>, <b>React TypeScript</b>, and <b>Supabase Auth</b>,<br/>
  with <b>Docker</b> support for seamless development and production environments.</p>
</div>

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Ant Design 5, Redux Toolkit, React Router 7 |
| Backend | NestJS 10, Prisma (empty schema), PostgreSQL |
| Auth | Supabase Auth (proxied via NestJS) |
| API Client | Auto-generated from Swagger (`swagger-typescript-api`) |

---

## Features

### Frontend
- **React 18 + TypeScript** with Vite for fast development
- **Role-Based Routing** — separate dashboards for Admin (roleId: 2) and User (roleId: 3)
- **Persistent Redux Store** — auth state survives page refresh
- **Ant Design** with a custom theme
- **Prebuilt pages**: Landing, Login, Admin Dashboard, User Dashboard, Unauthorized
- **Docker**: dev (Vite) and prod (Nginx) via Docker Compose profiles

### Backend
- **NestJS 10** with modular architecture
- **Supabase Auth** — login, register, refresh token, password reset, get current user
- **Supabase JWT Guard** — protects routes by validating tokens against Supabase
- **Prisma** — empty schema ready to add your own tables
- **Swagger** — auto-generated API docs at `/api`
- **File upload/download** endpoints
- **Docker**: dev and prod configurations

---

## Project Structure

```
nest-react-supabase-boilerplate/
├── backend/
│   ├── src/
│   │   ├── auth/               # Supabase auth endpoints
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── supabase-auth.guard.ts
│   │   │   └── dto/
│   │   ├── supabase/           # Supabase admin client
│   │   │   ├── supabase.service.ts
│   │   │   └── supabase.module.ts
│   │   ├── user/               # Empty stub — add your user logic here
│   │   ├── prisma/             # Prisma service
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma       # Empty — add your models here
│   │   └── seed.ts             # Seeds default Supabase users
│   ├── scripts/
│   │   ├── start.dev.sh        # Linux/Mac dev startup
│   │   ├── start.prod.sh       # Linux/Mac prod startup
│   │   ├── start.dev.bat       # Windows dev startup
│   │   └── start.prod.bat      # Windows prod startup
│   ├── docker/
│   │   ├── Dockerfile.dev
│   │   └── Dockerfile.prod
│   └── docker-compose.yaml
├── frontend/
│   ├── src/
│   │   ├── api/                # Auto-generated from Swagger
│   │   ├── pages/
│   │   ├── store/              # Redux store + auth slice
│   │   ├── components/
│   │   ├── theme/
│   │   └── utils/
│   ├── docker/
│   │   ├── Dockerfile.dev
│   │   └── Dockerfile.prod
│   └── docker-compose.yml
├── supabase/                      # Self-hosted Supabase (optional)
├── start_all_local.sh             # Local dev — Linux/Mac
├── start_all_windows.bat          # Local dev — Windows
├── start_all_in_gitpod.sh         # Gitpod setup
└── start_all_in_git_codespace.sh  # GitHub Codespaces setup
```

---

## Auth Flow

```
Frontend  →  POST /auth/login { email, password }
Backend   →  supabase.auth.signInWithPassword()
Supabase  →  returns session + user
Backend   →  { accessToken, refreshToken, user: { id, email, roleId } }
Frontend  →  stores in Redux, routes by roleId
```

**roleId** is stored in Supabase `user.app_metadata.roleId`:
- `1` — SUPERADMIN
- `2` — ADMIN
- `3` — USER (default)
- `4` — OTHER

Protected routes use `@UseGuards(SupabaseAuthGuard)` which validates the token via `supabase.auth.getUser(token)`.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 20+ and npm
- A running Supabase instance (self-hosted via `supabase/` folder, or [Supabase Cloud](https://supabase.com))

---

### 1. Backend Setup

```bash
cd backend/
cp .env.example .env
```

Edit `.env`:
```env
APP_PORT=6001
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=http://localhost:8000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

```bash
npm install
docker-compose up --build -d
npm run db:seed
npm run start:dev
```

Swagger docs: [http://localhost:6001/api](http://localhost:6001/api)

---

### 2. Frontend Setup

```bash
cd frontend/
cp .env.example .env
```

Edit `.env`:
```env
VITE_BACKEND_API_URL=http://localhost:6001
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm install
cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)

---

### 3. One-Command Startup Scripts

| Platform | Script |
|---|---|
| Linux / Mac (local) | `./start_all_local.sh` |
| Windows (local) | `start_all_windows.bat` |
| Gitpod | `./start_all_in_gitpod.sh` |
| GitHub Codespaces | `./start_all_in_git_codespace.sh` |

> Before running any script, edit the `.env` files in `backend/` and `frontend/` with your Supabase credentials.

---

### Default Seeded Users

| Email | Password | Role |
|---|---|---|
| `superadmin@example.com` | `password123` | SUPERADMIN |
| `admin@example.com` | `password123` | ADMIN |
| `user@example.com` | `password123` | USER |

---

## Adding a New API Endpoint

1. Create a NestJS module or add to an existing one
2. Protect routes with `@UseGuards(SupabaseAuthGuard)`
3. Run `npm run swagger:ts` in the backend
4. Copy `backend/src/api/myApi.ts` to `frontend/src/api/myApi.ts`

---

## Adding a New Prisma Table

1. Add your model to `backend/prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Inject `PrismaService` in your NestJS service

---

## Adding a New Frontend Route

1. Create your page in `frontend/src/pages/`
2. Register it in `frontend/src/App.tsx` using `<PrivateRoute>` or `<PublicRoute>`
3. Add its path to `frontend/src/utils/routes_name.ts`

---

## Docker

```bash
# Backend (PostgreSQL + API)
cd backend/ && docker-compose up --build -d

# Frontend dev (Vite)
cd frontend/ && docker-compose --profile dev up --build -d

# Frontend prod (Nginx)
cd frontend/ && docker-compose --profile prod up --build -d
```

---

## Scripts Reference

### Backend
| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build for production |
| `npm run db:migrate` | Create a new Prisma migration |
| `npm run db:migrate:deploy` | Deploy migrations |
| `npm run db:seed` | Seed default Supabase users |
| `npm run db:studio` | Open Prisma Studio |
| `npm run swagger:ts` | Generate API TypeScript client |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
