# Project Checks

Run these after significant updates:

```bash
npm run typecheck
npm run build
```

API-only checks:

```bash
npm run prisma:generate --workspace api
npm run dev:api
```

Web/Mobile dev:

```bash
npm run dev:web
npm run dev:mobile
```
