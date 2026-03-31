# Monorepo and Deployment

This document covers **workspace layout**, **environment configuration**, **local developer workflow**, and **production deployment** patterns suitable for AJ Enterprises (self-hosted or AWS).

---

## 1. Monorepo layout

```mermaid
flowchart TB
  subgraph apps [apps]
    api[api]
    web[web-admin]
    mob[mobile]
  end
  subgraph packages [packages]
    mock[mock-api]
    st[shared-types]
  end
  apps --> packages
```

| Path | Responsibility |
|------|----------------|
| `apps/api` | HTTP API, Prisma, migrations |
| `apps/web-admin` | React admin UI |
| `apps/mobile` | Expo React Native |
| `packages/shared-types` | Cross-app DTOs / Zod |
| `packages/mock-api` | Prototype fixtures |
| `docs/` | Documentation |
| `.vscode/` | Debug launch configurations |

---

## 2. npm workspaces

Root `package.json` defines workspaces `apps/*` and `packages/*`. Install **once** at root:

```bash
npm install
```

Run scripts via workspace:

```bash
npm run dev:api
npm run dev:web
npm run dev:mobile
```

---

## 3. Environment variables (by app)

### API — `apps/api/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:port/db?schema=public` |
| `PORT` | No | Default `4000` |
| `JWT_SECRET` | Yes | Long random secret for signing JWTs |
| `GOOGLE_CLIENT_ID` | For Google auth | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | If using server OAuth | Secret |
| `GOOGLE_CALLBACK_URL` | If using redirects | Public URL |

### Web — `apps/web-admin` (Vite prefix `VITE_`)

| Variable | Description |
|----------|-------------|
| `VITE_USE_MOCK_API` | `true`/`false` — prototype vs API |
| `VITE_API_BASE_URL` | API origin when mock off |
| `VITE_DEV_ROLE` | `admin` / `employee` for UI preview |

**PWA (installable web app).** `apps/web-admin` uses `vite-plugin-pwa`: a web manifest, precache service worker (`sw.js` + Workbox runtime), and `registerSW.js`. The GitHub Pages workflow sets `VITE_BASE_PATH` to `/<repo>/` so `scope`, `start_url`, and the service worker URL stay aligned with the deployed path. Install prompts require HTTPS (or `localhost` in dev). Workbox is built with `mode: "development"` so minification does not rely on a terser path that can fail on newer Node versions.

### Mobile — Expo (`EXPO_PUBLIC_`)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_USE_MOCK_API` | Mock vs live |
| `EXPO_PUBLIC_INITIAL_ROLE` | `ADMIN` / `EMPLOYEE` for debug |

---

## 4. Local development sequence

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant PG as Postgres
  participant API as API
  participant UI as Web or Mobile

  Dev->>PG: docker compose up postgres
  Dev->>API: prisma migrate dev
  Dev->>API: npm run dev api
  Dev->>UI: npm run dev web or mobile
  UI->>API: HTTP or mock
```

---

## 5. Docker Compose (Postgres)

Root `docker-compose.yml` provides a **development** Postgres. **Do not** use default passwords in production.

---

## 6. Production deployment (EC2 baseline)

```mermaid
flowchart TB
  subgraph ec2 [EC2 example]
    nginx[Nginx TLS termination]
    node[Node or Docker container]
  end
  subgraph data [Data]
    pg[(PostgreSQL RDS or managed)]
  end
  internet[Users] --> nginx
  nginx --> node
  node --> pg
```

**Steps (high level):**

1. Provision **PostgreSQL** (RDS recommended).
2. Run **migrations** from CI or release job.
3. Run **API** as systemd service or container; bind **localhost** behind Nginx.
4. Serve **web** static files from Nginx or object storage + CDN.
5. **Mobile** via Expo EAS builds; store credentials in env.

**TLS:** Let’s Encrypt on Nginx or ACM in front of ALB (if used).

---

## 7. Operational checklist

| Item | Action |
|------|--------|
| **Secrets** | AWS Secrets Manager, SSM Parameter Store, or host env — not in git |
| **Backups** | Automated RDS snapshots; test restore quarterly |
| **CORS** | Allow only known web origins (`CORS_ORIGINS`); required for web-admin and `POST /api/public/leads` from the marketing site |
| **Rate limits** | Especially on `/api/auth/*`; consider limits on `/api/public/leads` if exposed publicly |
| **Logs** | Centralize (CloudWatch or similar) |
| **Uptime** | Health check on `/health` |

---

## 8. Related documents

- AWS costs: [11-AWS-INFRASTRUCTURE-COSTS.md](./11-AWS-INFRASTRUCTURE-COSTS.md)
- Mock workflow: [12-MOCK-PROTOTYPE.md](./12-MOCK-PROTOTYPE.md)
- Repo tree: [09-REPO-STRUCTURE.md](./09-REPO-STRUCTURE.md)
