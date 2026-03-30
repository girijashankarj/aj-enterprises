# Cursor configuration — AJ Enterprises

This folder guides Cursor (and compatible tools) for the **aj-enterprises** monorepo: API (`Express` + `Prisma`), **web-admin** (`React` + `Redux` + `Tailwind`), **mobile** (`Expo`).

## Contents

| Path | Purpose |
|------|---------|
| **rules/** | Scoped rules (globs) — Prisma schema, API routes, Redux store, Expo mobile |
| **commands/** | Repeatable checklists: new endpoint, migration, release, mock sync |
| **agents/** | Short role prompts for backend, web, mobile |
| **skills/** | Reusable task skills for UX, API changes, and doc synchronization |
| **BUGBOT.md** | PR review checklist for this repo |
| `project-checks.md` | Quick `npm` commands for typecheck/build |

## Rules overview

| File | Applies to |
|------|------------|
| `main-rules.mdc` | Always — core monorepo + domain naming |
| `security-guardrails.mdc` | Always — secrets, auth, safe errors |
| `backend-prisma-api.mdc` | `apps/api` TS + Prisma (broad) |
| `prisma-schema.mdc` | `schema.prisma` + migrations only |
| `api-routes.mdc` | `apps/api/src` — handlers, validation, logging |
| `frontend-redux-tailwind.mdc` | `apps/web-admin` UI + Tailwind |
| `redux-patterns.mdc` | `apps/web-admin/src/store` only |
| `expo-mobile.mdc` | `apps/mobile` — env, UX, contracts |
| `microsoft-ux-ui.mdc` | `apps/web-admin` + `apps/mobile` UI consistency based on docs/15 |
| `doc-alignment.mdc` | `apps/api` updates requiring documentation sync |

## Commands overview

| Command file | Use when |
|--------------|----------|
| `api-add-endpoint.md` | Adding or changing REST handlers |
| `api-change-with-doc-sync.md` | Updating API behavior while keeping docs synchronized |
| `prisma-migration.md` | Schema / migration workflow |
| `release-checklist.md` | Before staging or production deploy |
| `mock-sync.md` | Keeping `@aj/mock-api` aligned with API |
| `ui-screen-implementation.md` | Implementing/refining web or mobile screens with UX standards |
| `qa-accessibility-check.md` | Final UI QA pass for accessibility and state behavior |
| `feature-delivery-flow.md` | Master end-to-end workflow from implementation to QA and handoff |
| `project-checks.md` | Local typecheck / dev servers |

## Agents overview

| Agent | Scope |
|-------|--------|
| `backend-prisma.md` | API + database |
| `frontend-web.md` | Web admin app |
| `mobile-expo.md` | Expo mobile app |

## Skills overview

| Skill | Use when |
|-------|----------|
| `ak-ux-implementation` | Building or refining UI using the Microsoft-inspired UX standards |
| `ak-api-change-playbook` | Adding/changing API endpoints with RBAC, validation, and contract discipline |
| `ak-doc-sync` | Syncing docs after code changes that affect contracts, schema, env, or permissions |

## Quick start for contributors

1. Read `main-rules.mdc` and `security-guardrails.mdc`.
2. Use scoped rules by touching files under `apps/*` — Cursor applies globs automatically.
3. Before PR: run checks in `commands/project-checks.md` and scan `BUGBOT.md`.
