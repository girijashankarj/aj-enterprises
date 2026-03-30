# Microsoft-Inspired UX Standards (AJ Enterprises)

This document defines a Microsoft-inspired, enterprise-grade look and feel for AJ Enterprises across web and mobile apps.

Goal: keep the experience **calm, productive, accessible, and trustworthy** for `ADMIN`, `MANAGER`, and `EMPLOYEE` workflows.

---

## 1. Design principles

1. **Clarity first**: every screen should clearly answer "where am I?" and "what should I do next?".
2. **Productivity over decoration**: optimize for task completion speed.
3. **Consistent patterns**: same interaction model in `apps/web-admin` and `apps/mobile`.
4. **Accessibility by default**: keyboard, focus, contrast, readable text.
5. **Calm confidence**: neutral surfaces, one primary accent, subtle feedback.

---

## 2. Visual language

### 2.1 Color system

Use semantic tokens instead of hard-coded colors.

| Token | Light | Dark | Usage |
|------|------|------|------|
| `color.bg.canvas` | `#F5F7FA` | `#0F1115` | App background |
| `color.bg.surface` | `#FFFFFF` | `#171A21` | Cards, panels, dialogs |
| `color.bg.subtle` | `#EEF2F7` | `#1F2430` | Alternate rows, section bg |
| `color.text.primary` | `#1B1F24` | `#F3F5F8` | Primary content |
| `color.text.secondary` | `#5B6472` | `#B4BECC` | Supporting text |
| `color.border.default` | `#D6DCE5` | `#2E3543` | Inputs, cards, separators |
| `color.brand.primary` | `#0F6CBD` | `#4AA3FF` | Primary actions, active states |
| `color.success` | `#107C10` | `#6CCB5F` | Success badges/messages |
| `color.warning` | `#C75C00` | `#F5A55A` | Warning states |
| `color.error` | `#C42B1C` | `#FF7A6E` | Error states |
| `color.info` | `#005A9E` | `#66B7FF` | Informational alerts |

Rules:
- Keep `color.brand.primary` as the only strong accent.
- Never use red for normal actionable controls.
- Status colors are reserved for status semantics only.

### 2.2 Typography

- Font family:
  - Web: `"Segoe UI", "Inter", system-ui, -apple-system, sans-serif`
  - Mobile: platform default sans + fallback to `Inter` if available
- Scale:
  - `display`: 28/36, semibold
  - `h1`: 24/32, semibold
  - `h2`: 20/28, semibold
  - `h3`: 18/24, semibold
  - `body`: 14/20, regular
  - `caption`: 12/16, regular
- Content text should remain left-aligned.

### 2.3 Spacing and shape

- Base unit: `4px`.
- Primary spacing steps: `4, 8, 12, 16, 20, 24, 32`.
- Container gutters:
  - Web desktop: `24px`
  - Web tablet: `16px`
  - Mobile: `16px`
- Corner radius:
  - Inputs/buttons: `8px`
  - Cards/dialogs: `12px`

---

## 3. Interaction model

### 3.1 Input and button behavior

- Minimum touch target: `44x44` on mobile, `36px` min height on web.
- Every interactive element must have visible states:
  - `rest`, `hover` (web), `pressed`, `focus-visible`, `disabled`.
- Focus ring: `2px` outline using `color.brand.primary`.
- Primary button:
  - solid `color.brand.primary`, white text.
- Secondary button:
  - subtle surface with border.
- Destructive action:
  - neutral button + explicit confirmation dialog before execution.

### 3.2 Navigation patterns

- Web admin:
  - left navigation rail + top title/action bar.
  - selected nav state must be visually obvious.
- Mobile:
  - bottom tabs for primary modules.
  - stack navigation inside each tab.
- Keep labels short and action-oriented: "Assign Task", "Update Progress", "Submit Leave".

### 3.3 Motion and feedback

- Use short transitions (`120ms` to `200ms`) with ease-out.
- Loading:
  - skeleton for lists/cards,
  - inline spinner for button submit.
- Success:
  - non-blocking toast/snackbar.
- Error:
  - inline field error + top-level summary if multiple fields fail.

---

## 4. Accessibility requirements

- WCAG AA contrast minimum for text and controls.
- Keyboard access required for all web actions.
- Screen reader labels for icon-only controls.
- Do not rely on color alone for status; add icon or text label.
- Respect reduced motion preferences where available.

---

## 5. UX patterns for AJ product domains

### 5.1 Tasks and progress logs

- Assignment form order:
  1) Employee
  2) Part number
  3) Part name
  4) Date
  5) Target count
  6) Notes
- Progress entry defaults to incremental update (`+count`) with optional issue note.
- Show live completion meter (`achieved / target`) with numeric value + progress bar.

### 5.2 Leave workflow

- Use clear status chips: `Pending`, `Approved`, `Rejected`.
- Approval screens must show requester, date range, total days, and note.
- Confirm approve/reject actions to prevent accidental submissions.

### 5.3 Finance ledger

- Ledger table defaults:
  - newest first,
  - amount right-aligned,
  - signed amounts (`+` credit, `-` deduction/advance).
- Use clear row labels (`Salary Credit`, `Advance`, `Deduction`, `Adjustment`).
- Always show running balance in sticky summary area.

---

## 6. Content guidelines

- Use plain operational language.
- Prefer action verbs in CTAs:
  - good: "Save Assignment", "Approve Leave"
  - avoid: "Proceed", "Submit Now!!!"
- Empty states should include:
  - what this screen is for,
  - why no data is shown,
  - one clear next action.

---

## 7. Implementation guide in this monorepo

1. Create shared UI tokens in:
   - `apps/web-admin` theme config (Tailwind variables)
   - `apps/mobile` theme constants
2. Standardize core components:
   - button, input, select, modal, table/list item, status badge, toast
3. Add role-based UX checks:
   - `ADMIN`, `MANAGER`, `EMPLOYEE` views should share visual structure while limiting actions appropriately
4. Validate with UX quality gates:
   - keyboard pass (web), contrast pass, loading/error/success state check, mobile touch target audit

---

## 8. Definition of done (UX)

A feature is UX-complete only if:

- Visual tokens come from the standard palette and spacing system.
- Interaction states are implemented and testable.
- Empty/loading/error/success states are present.
- Accessibility checks pass for the modified screens.
- Behavior remains consistent between web and mobile for the same domain task.

