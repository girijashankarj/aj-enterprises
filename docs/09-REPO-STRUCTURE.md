# Repository Structure

Detailed **tree** and **ownership** of directories in the AJ Enterprises monorepo.

---

## 1. Top-level tree

```text
aj-enterprises/
  apps/
    api/                 # Express + Prisma + PostgreSQL
    web-admin/           # Vite + React + Redux + Tailwind
    mobile/              # Expo + React Native + Redux
  packages/
    mock-api/            # Shared prototype fixtures
    shared-types/        # Zod/TS shared contracts
  docs/                  # Numbered documentation set
  .vscode/               # launch.json debug profiles
  docker-compose.yml     # Dev Postgres (optional)
  package.json           # npm workspaces root
```

---

## 2. API app (`apps/api`)

| Path | Purpose |
|------|---------|
| `prisma/schema.prisma` | **Source of truth** for database schema |
| `prisma/migrations/` | Versioned migrations |
| `src/` | Application code: `app.ts` mounts routes; `server.ts` listens |
| `src/config/` | Environment loading |
| `src/middleware/` | Auth (JWT) |
| `src/modules/` | Domain routers: auth, employees, tasks, dashboard, finance, leave, attendance |
| `mocks/` | Placeholder for future API test doubles (see README there) |

---

## 3. Web app (`apps/web-admin`)

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Routes, layout, persona preview |
| `src/store/` | Redux slices |
| `src/mocks/` | Mock mode config + `webPreload` |
| `src/store/api/akApi.ts` | RTK Query API client (mock + live) |
| `src/vite-env.d.ts` | Vite env typings |

---

## 4. Mobile app (`apps/mobile`)

| Path | Purpose |
|------|---------|
| `App.tsx` | Redux store + screens |
| `mocks/` | Mock mode config |
| `services/akApi.ts` | Future live bootstrap |

---

## 5. Packages

### `packages/mock-api`

| Path | Purpose |
|------|---------|
| `src/fixtures/` | Employees, tasks, dashboard, finance, leave, attendance, API-shaped samples |
| `src/bootstrap.ts` | `getWebAdminMockBootstrap`, `getMobileMockBootstrap` |
| `src/delay.ts` | Artificial latency for async loaders |

### `packages/shared-types`

| Path | Purpose |
|------|---------|
| `src/index.ts` | Zod schemas + exported TypeScript types |

---

## 6. Prisma domain entities (summary)

| Model | Role |
|-------|------|
| `User` | Login identity + role |
| `EmployeeProfile` | Salary, leave allowance, phone |
| `TaskTemplate` | Part number + name |
| `TaskAssignment` | Dated work unit with target/achieved |
| `TaskProgressLog` | Incremental progress + issue |
| `TaskSuggestion` | Manager comment |
| `Attendance` | Daily presence per employee profile; unique `(employeeProfileId, attendanceDate)` |
| `LeaveRequest` | Leave workflow |
| `SalaryLedger` | Financial entries |

---

## 7. Related documents

- Architecture ER-style view: [04-ARCHITECTURE-AND-USER-FLOWS.md](./04-ARCHITECTURE-AND-USER-FLOWS.md)
- Decisions: [08-TECH-DECISIONS.md](./08-TECH-DECISIONS.md)
