# Command: Add or change an API endpoint

Use this checklist when adding or modifying REST routes under `apps/api`.

## 1. Design
- [ ] Method and path follow existing modules (`/api/<domain>/...`).
- [ ] Request/response shapes align with `docs/10-API-CONTRACT-EXAMPLES.md` (update doc if public contract changes).

## 2. Implementation
- [ ] Route registered in `apps/api/src/app.ts` (or module router).
- [ ] **Auth**: `requireAuth` (or stricter) on non-public routes.
- [ ] **Validation**: Zod (or interim manual checks) for body/query/params.
- [ ] **Prisma**: typed queries; transactions if multiple writes must succeed together.

## 3. Docs and mocks
- [ ] Update `docs/10-API-CONTRACT-EXAMPLES.md` with at least one JSON example.
- [ ] Update `packages/mock-api` if the UI relies on the same shape in mock mode.

## 4. Verify
- [ ] `npm run typecheck --workspace api`
- [ ] Hit `GET /health` and smoke-test the new route locally.
