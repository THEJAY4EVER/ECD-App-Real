# Masuka Junior School ECD

Cross-platform installable PWA aligned with Zimbabwe's ECD curriculum.

## Stack
- React + Vite + Wouter + TanStack Query + Tailwind + shadcn/ui (PWA, mobile-first)
- Express 5 + Drizzle ORM + Postgres
- Cookie session auth (bcryptjs), no third-party auth — teachers seed accounts
- OpenAPI + Orval codegen → typed React Query hooks
- Anthropic SDK (claude-haiku-4-5) via Replit AI Integrations proxy for AI quizzes
- framer-motion for animations, Web Audio for music, SpeechSynthesis for narration

## Student-side enrichment
- AI quiz on every lesson (POST `/api/lessons/:id/quiz`) — non-repeating via localStorage avoid-list
- Toggleable procedural background music (header MusicToggle, persisted)
- "Read aloud" narrator on lessons & stories (browser TTS, BCP47 lang map, graceful fallback)
- Drawing pad at `/draw` with localStorage gallery (capped at 30)
- Bubbly framer-motion animations on student side ONLY; teacher side stays plain
- 5-language i18n: en, fr, zh, sn (Shona), nd (Ndebele)

## Admin User Management (fully upgraded)
- `usersTable` has `isActive boolean NOT NULL DEFAULT true` — disabled users cannot log in (403 response with "Account disabled" message surfaced on login page)
- `POST /api/admin/users` — accepts optional `username` (validated, unique) and `password` (min 6 chars); auto-generates both from fullName if not provided
- `PATCH /api/admin/users/:id` — accepts optional `password` (min 6 chars, invalidates sessions) and `isActive` (false disables login + invalidates sessions)
- Admin Users UI: active/inactive badge per user, one-click toggle to enable/disable, custom username field with preview in create dialog, custom password field in create/edit dialogs, password reveal with copy on creation and reset
- `ApiError` exported from `@workspace/api-client-react` for typed error handling in the frontend

## Roles
- **Admin**: exclusive access to Admin Dashboard — stats, full user CRUD (create/edit/delete/reset-password for teachers & students). No student/teacher content visible.
- **Student**: home dashboard, curated YouTube lessons by subject, assignment list, submission flow
- **Teacher**: dashboard, create/grade assignments, student roster, auto-generated progress reports with milestones

## Accounts
- `admin` / `Admin@Masuka1` (or `ADMIN_PASSWORD` env var) — School Administrator. Created automatically on server startup via `ensureAdmin()`.
- `teacher` / `pass123` — Mrs. Chiweshe (demo)
- `student` / `pass123` — Tariro Moyo ECD A (demo, + 3 more students)

## Architecture — API server embedding
The `artifacts/api-server` is not served directly by Replit's proxy (its `/api` path entry was removed from artifact.toml to avoid 502s caused by Replit's broken port detection). Instead, `vite.config.ts` spawns the compiled API server (`dist/index.mjs`) as a child process on port 9001 and proxies `/api/*` through Vite. To update the API: build (`pnpm --filter @workspace/api-server run build`), then restart the `artifacts/masuka-ecd: web` workflow.

## Key files
- `lib/api-spec/openapi.yaml` — single source of truth for API
- `lib/db/src/schema/index.ts` — users/sessions/lessons/assignments/submissions
- `artifacts/api-server/src/routes/admin.ts` — admin CRUD routes (`/api/admin/*`)
- `artifacts/api-server/src/routes/*` — Express handlers
- `artifacts/api-server/src/ensure-admin.ts` — called on startup to seed admin account
- `artifacts/masuka-ecd/vite.config.ts` — spawns API server as child process
- `artifacts/masuka-ecd/src/App.tsx` — role-based router (admin branch)
- `artifacts/masuka-ecd/src/pages/admin/home.tsx` — Admin Dashboard
- `artifacts/masuka-ecd/src/pages/admin/users.tsx` — Admin User Management
