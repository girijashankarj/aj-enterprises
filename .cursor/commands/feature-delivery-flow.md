# Command: Feature delivery flow (end-to-end)

Use this as the default command for shipping a feature from implementation to QA.

## 0. Confirm scope
- [ ] Identify impacted areas: `apps/web-admin`, `apps/mobile`, `apps/api`, `packages/shared-types`, docs.
- [ ] Confirm role impact (`ADMIN`, `MANAGER`, `EMPLOYEE`) and domain impact (`tasks`, `progress logs`, `leave`, `finance ledger`).

## 1. Build UI (if UI is in scope)
- [ ] Follow `.cursor/commands/ui-screen-implementation.md`.
- [ ] Apply Microsoft-inspired standards from `docs/13-MICROSOFT-INSPIRED-UX-STANDARDS.md`.

## 2. Build API and contracts (if API is in scope)
- [ ] Follow `.cursor/commands/api-change-with-doc-sync.md`.
- [ ] Keep validation/auth/error handling aligned with `.cursor/rules/security-guardrails.mdc`.

## 3. Synchronize docs
- [ ] Update docs using mapping from `.cursor/skills/ak-doc-sync/SKILL.md`.
- [ ] Ensure `README.md` and `docs/00-INDEX.md` links remain valid when docs are added/renamed.

## 4. QA and accessibility
- [ ] Follow `.cursor/commands/qa-accessibility-check.md`.
- [ ] Smoke test changed role flows on web and/or mobile.

## 5. Final verification
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] If Prisma changed: `npm run prisma:generate --workspace api` and required migration workflow.

## 6. Handoff notes
- [ ] Summarize what changed (UI, API, docs).
- [ ] Summarize tested scenarios and any known limitations.
- [ ] Call out follow-up tasks if intentionally deferred.
