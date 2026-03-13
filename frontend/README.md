[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/hassenamri005/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

# Frontend — React App

React 18 + TypeScript + Vite frontend with role-based routing, Redux auth state, and Ant Design UI.

## Stack

- **React 18**, TypeScript, Vite
- **Ant Design 5** — UI components with custom theme
- **Redux Toolkit + redux-persist** — auth state
- **React Router 7** — routing with role guards
- **@supabase/supabase-js** — Supabase client (storage, realtime, etc.)

## Auth Flow

Auth is handled by the backend (`/auth/*` endpoints). The frontend:
1. Calls `POST /auth/login` → receives `{ accessToken, refreshToken, user: { id, email, roleId } }`
2. Stores tokens in Redux (persisted)
3. Routes to the correct dashboard based on `roleId` (2 = Admin, 3 = User)

## Routes

| Path | Access |
|---|---|
| `/` | Public — Landing page |
| `/login` | Public — Login |
| `/user/dashboard` | Private — roleId 3 (User) |
| `/admin/dashboard` | Private — roleId 2 (Admin) |
| `*` | Fallback |

## Add a New Route

1. Create your page in `src/pages/`
2. Open `App.tsx` and add the route inside the appropriate section:
   - Public routes: accessible to all
   - Private routes: wrapped in role guard (user or admin)

## Environment

Copy `.env.example` to `.env`:

```
VITE_BACKEND_API_URL=http://localhost:6001
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Run with Docker

**Development:**
```sh
docker compose --profile dev up --build
```

**Production:**
```sh
docker compose --profile prod up --build
```

## Run Locally (no Docker)

```sh
npm install
npm run dev
```

App runs at `http://localhost:3000`.
