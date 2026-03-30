# Command: UI screen implementation checklist

Use this when creating or updating screens in `apps/web-admin` or `apps/mobile`.

## 1. Scope and flow
- [ ] Screen maps to AJ domain flow (`tasks`, `progress logs`, `leave`, `finance ledger`).
- [ ] Primary user action is obvious in first view.
- [ ] Role behavior is explicit for `ADMIN`, `MANAGER`, `EMPLOYEE`.

## 2. UX standard alignment
- [ ] Follow `docs/13-MICROSOFT-INSPIRED-UX-STANDARDS.md`.
- [ ] Calm visual hierarchy: neutral surfaces + one primary accent.
- [ ] Labels and CTAs are short and action-oriented.

## 3. Interaction quality
- [ ] Controls include states: rest, hover (web), pressed, focus-visible, disabled.
- [ ] Loading, empty, error, and success states are implemented.
- [ ] Mobile touch targets are readable and easy to tap.

## 4. Accessibility
- [ ] Text and controls meet WCAG AA contrast.
- [ ] Keyboard navigation works for web controls.
- [ ] Icon-only controls include accessible labels.

## 5. Verify
- [ ] `npm run typecheck`
- [ ] Run app (`npm run dev:web` or `npm run dev:mobile`) and smoke test changed flow.
