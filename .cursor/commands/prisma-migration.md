# Command: Prisma schema change and migration

## 1. Edit schema
- [ ] Change `apps/api/prisma/schema.prisma` (models, enums, indexes).

## 2. Create migration
From repo root (or `apps/api`):

```bash
npm run prisma:migrate --workspace api
```

Use a descriptive migration name when prompted.

## 3. Regenerate client
```bash
npm run prisma:generate --workspace api
```

## 4. Fix TypeScript
- [ ] Resolve compile errors in `apps/api/src` (new required fields, renames).

## 5. Document
- [ ] Update `docs/04-ARCHITECTURE-AND-USER-FLOWS.md` or `docs/09-REPO-STRUCTURE.md` if entities/relationships changed materially.

## Rollback note
Do not rewrite old migration files. To undo in dev: restore schema + `migrate reset` (destructive) or add a forward migration.
