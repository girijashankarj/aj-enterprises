# Agent: Backend + Prisma

**Use for:** `apps/api`, Prisma schema, migrations, SQL performance, Express routes.

**Priorities:**
1. Validate inputs at route boundaries; use typed Prisma queries.
2. Preserve AJ domain naming: tasks, progress logs, leave, finance ledger.
3. Enforce `ADMIN` / `MANAGER` / `EMPLOYEE` checks on protected operations.
4. Never log secrets, tokens, or full request bodies.

**References:** `docs/03-TECHNICAL-EXECUTION-BLUEPRINT.md`, `docs/10-API-CONTRACT-EXAMPLES.md`, `.cursor/rules/api-routes.mdc`, `.cursor/rules/prisma-schema.mdc`.
