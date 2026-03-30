# Command: QA accessibility check

Use this before merge for UI-heavy changes in web or mobile.

## 1. Functional state checks
- [ ] Loading state appears during async fetches.
- [ ] Empty state has clear message and next action.
- [ ] Error state explains failure safely and offers retry path.
- [ ] Success state confirms completion without blocking flow.

## 2. Visual and interaction checks
- [ ] Focus ring is visible on web keyboard navigation.
- [ ] Interactive states are visible (hover/pressed/disabled).
- [ ] Text remains readable at normal and larger device font sizes.
- [ ] Tap targets are usable on mobile screens.

## 3. Accessibility checks
- [ ] Contrast meets WCAG AA for text and key controls.
- [ ] Icon-only controls have accessible labels.
- [ ] Status is not represented by color alone; includes text/icon cue.
- [ ] Screen order and labels make sense with assistive tech.

## 4. Domain flow checks
- [ ] Task/progress flow works end-to-end for expected role.
- [ ] Leave flow submission/approval screens are clear and safe.
- [ ] Finance ledger values and signs are unambiguous.

## 5. Verify
- [ ] `npm run typecheck`
- [ ] Manual smoke test on changed screens in web/mobile dev mode.
