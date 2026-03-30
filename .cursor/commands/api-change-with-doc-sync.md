# Command: API change with documentation sync

Use this when adding or changing behavior under `apps/api`.

## 1. Design and security
- [ ] Endpoint path/method follows existing domain module conventions.
- [ ] Auth middleware protects non-public routes.
- [ ] Input validation exists at route boundary (params/query/body).
- [ ] Errors returned to clients are safe and non-internal.

## 2. Implementation
- [ ] ORM queries stay typed and parameterized.
- [ ] Role checks are explicit (`ADMIN`, `MANAGER`, `EMPLOYEE`) where required.
- [ ] Shared contracts updated in `packages/shared-types` when needed.

## 3. Documentation sync
- [ ] Contract changes -> update `docs/10-API-CONTRACT-EXAMPLES.md`.
- [ ] Route/behavior changes -> update `docs/03-TECHNICAL-EXECUTION-BLUEPRINT.md`.
- [ ] Prisma schema/entity changes -> update `docs/04-ARCHITECTURE-AND-USER-FLOWS.md` and `docs/09-REPO-STRUCTURE.md`.
- [ ] Permission changes -> update RBAC matrix in `docs/05-DOCUMENT-ALIGNMENT-AND-REFERENCE.md`.

## 4. Verify
- [ ] `npm run typecheck --workspace api`
- [ ] Smoke test route locally (`GET /health` + updated endpoint path).
