# Bugbot / PR review — AJ Enterprises

Project-specific review rules (in addition to generic quality).

## Security
- [ ] No hardcoded secrets, API keys, or JWT strings.
- [ ] No logging of `Authorization`, cookies, full `req.body`, or PII (emails/phones) in production code paths.

## API and contracts
- [ ] Public JSON shapes match or update `docs/10-API-CONTRACT-EXAMPLES.md`.
- [ ] Mutations validated before DB; parameterized Prisma only (no string-built SQL).

## Authz
- [ ] Role checks for `ADMIN` / `MANAGER` / `EMPLOYEE` match `docs/05-DOCUMENT-ALIGNMENT-AND-REFERENCE.md` matrix.

## Mocks
- [ ] If API response shape changes, `packages/mock-api` updated or ticket filed.

## Monorepo
- [ ] `npm run typecheck` would pass for affected workspaces.
