---
name: ak-doc-sync
description: Keep AJ Enterprises documentation synchronized with implementation changes using the docs dependency map. Use when code changes affect API contracts, Prisma schema, RBAC, environment variables, or architecture.
---

# AJ Documentation Sync

Use this skill after meaningful implementation changes.

## Core references

- `docs/00-INDEX.md`
- `docs/05-DOCUMENT-ALIGNMENT-AND-REFERENCE.md`
- `README.md`

## Mapping rules

- API request/response changes -> update `docs/10-API-CONTRACT-EXAMPLES.md`
- Route/module behavior changes -> update `docs/03-TECHNICAL-EXECUTION-BLUEPRINT.md`
- Prisma entity/schema changes -> update `docs/04-ARCHITECTURE-AND-USER-FLOWS.md` and `docs/09-REPO-STRUCTURE.md`
- Environment variable changes -> update `README.md` and `docs/07-MONOREPO-AND-DEPLOYMENT.md`
- Permission changes -> update RBAC matrix in `docs/05-DOCUMENT-ALIGNMENT-AND-REFERENCE.md`

## Review steps

1. List changed files.
2. Apply mapping rules to identify required docs.
3. Update docs with concise, concrete details and examples.
4. Ensure links in `docs/00-INDEX.md` and `README.md` remain accurate.
