# Command: Keep mocks aligned with the API

When `packages/mock-api` or API contracts drift, run through this list.

## Triggers
- Any change to JSON shape in `docs/10-API-CONTRACT-EXAMPLES.md`.
- Any Prisma model field used in API responses that fixtures mirror.

## Steps
- [ ] Update `packages/mock-api/src/fixtures/*.ts` (or `bootstrap.ts`).
- [ ] Ensure `getWebAdminMockBootstrap()` / `getMobileMockBootstrap()` still match Redux expectations.
- [ ] If samples in `fixtures/api-shapes.ts` exist, refresh them.
- [ ] `npm run typecheck` (workspaces that import `@aj/mock-api`).

## Web / mobile
- [ ] Smoke: web with `VITE_USE_MOCK_API=true` loads dashboard and lists.
- [ ] Smoke: mobile with mock on shows tasks and leave list.

See `docs/12-MOCK-PROTOTYPE.md`.
