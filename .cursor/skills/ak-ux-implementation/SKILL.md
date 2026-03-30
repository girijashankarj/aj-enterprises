---
name: ak-ux-implementation
description: Implement or refine UI using AJ Enterprises Microsoft-inspired standards. Use when building or updating web/mobile screens, component styling, states, accessibility, or workflow UX.
---

# AJ UX Implementation

Apply this skill when touching UI in `apps/web-admin` or `apps/mobile`.

## Core references

- `docs/13-MICROSOFT-INSPIRED-UX-STANDARDS.md`
- `docs/04-ARCHITECTURE-AND-USER-FLOWS.md`

## Workflow

1. Identify domain flow (`tasks`, `progress logs`, `leave`, `finance ledger`).
2. Keep structure clean and productivity-first: clear title, next action, concise labels.
3. Implement all interaction states for changed controls:
   - rest, hover (web), pressed, focus-visible, disabled.
4. Add complete UI states for changed screens:
   - loading, empty, error, success.
5. Verify accessibility baseline:
   - contrast, keyboard focus (web), readable touch targets (mobile).

## Output expectations

- Keep visuals calm (neutral surfaces + one primary accent).
- Preserve role clarity for `ADMIN`, `MANAGER`, `EMPLOYEE`.
- Reuse existing components/tokens before introducing new variants.
