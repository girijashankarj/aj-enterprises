# Command: Pre-release / staging checklist

## Build
- [ ] `npm run typecheck` (root)
- [ ] `npm run build` (root)

## Configuration
- [ ] `apps/api/.env` on server: `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID` (no defaults in prod).
- [ ] CORS allows only known web origins.
- [ ] TLS termination configured (Nginx / load balancer).

## Security
- [ ] No secrets in git; `.env` not committed.
- [ ] JWT expiry and secret strength acceptable for environment.

## Data
- [ ] Migrations applied on staging DB.
- [ ] Backup/restore tested for PostgreSQL (periodicity defined).

## Apps
- [ ] Web: `VITE_USE_MOCK_API=false` and correct `VITE_API_BASE_URL` for staging.
- [ ] Mobile: `EXPO_PUBLIC_USE_MOCK_API=false` when pointing at real API; EAS env vars set.
