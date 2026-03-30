---
name: ak-api-change-playbook
description: Execute API changes safely in AJ Enterprises with RBAC, validation, Prisma discipline, and docs updates. Use when adding or changing API endpoints, handlers, DTOs, or Prisma-backed flows.
---

# AJ API Change Playbook

Use this skill for changes under `apps/api` and related shared contracts.

## Core references

- `docs/03-TECHNICAL-EXECUTION-BLUEPRINT.md`
- `docs/05-DOCUMENT-ALIGNMENT-AND-REFERENCE.md`
- `docs/10-API-CONTRACT-EXAMPLES.md`
- `.cursor/rules/security-guardrails.mdc`

## Workflow checklist

- [ ] Confirm role access (`ADMIN`, `MANAGER`, `EMPLOYEE`) before coding.
- [ ] Validate all external inputs at route boundary (params, query, body).
- [ ] Use safe client errors; do not leak stack internals.
- [ ] Keep ORM usage typed and query patterns parameterized.
- [ ] Keep domain naming consistent: tasks, progress logs, leave, finance ledger.
- [ ] If contract changed, update `docs/11`.
- [ ] If route/module behavior changed, update `docs/03`.
- [ ] If schema changed, update `docs/04` and `docs/10`.

## Done criteria

- Endpoint behavior is RBAC-safe and validation-covered.
- Types are shared where appropriate via `packages/shared-types`.
- Docs are updated for changed behavior.
