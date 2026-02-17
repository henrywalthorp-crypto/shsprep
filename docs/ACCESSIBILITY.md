# Accessibility Audit — 2026-02-17

## Global (layout.tsx)
- ✅ `<html lang="en">` — Language attribute set
- ✅ Added skip-to-content link (`<a href="#main-content">Skip to main content</a>`)
- ✅ `<main id="main-content">` wraps all page content

## Sign-In Page
- ⚠️ **Missing form labels** — Email and password inputs use `placeholder` only, no `<label>` or `aria-label`. Screen readers may not identify these fields properly.
- ⚠️ **No aria-label on social buttons** — "Continue with Google" and "Continue with Apple" rely on visible text, which is acceptable, but icons lack `aria-hidden="true"`.
- ✅ Form uses semantic `<form>` element with `onSubmit`
- ✅ Link text is descriptive ("Sign Up", "Terms of Use", "Privacy Policy")
- ⚠️ **Password field auto-appears** — Progressive disclosure of password field may confuse screen readers. Consider `aria-live="polite"` on the container.

## Dashboard Page
- ✅ Semantic heading hierarchy (`<h1>`, `<h2>`)
- ⚠️ **Stats cards lack accessible labels** — The stat values (e.g., "Questions", "Accuracy") use tiny uppercase text. Consider adding `aria-label` to each card for screen readers.
- ✅ Interactive elements (buttons) are keyboard-accessible
- ⚠️ **Color-coded accuracy** (green/yellow/red) needs text alternatives — currently has percentage text which is sufficient

## Practice Page
- ⚠️ **Setup buttons lack aria-pressed** — Section, difficulty, count, and mode selection buttons should use `aria-pressed` or `role="radio"` with `aria-checked` to indicate selected state
- ⚠️ **Timer needs aria-live region** — The countdown timer should have `aria-live="polite"` and `aria-atomic="true"` so screen readers announce time updates
- ✅ Progress bar uses `<div>` — could benefit from `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- ⚠️ **Answer options** — Buttons work for keyboard nav, but selected state is only indicated visually (color). Should add `aria-pressed` or `aria-selected`.
- ✅ Feedback section uses color AND icons (check/X) AND text ("Correct!"/"Incorrect") — good multi-modal feedback

## Focus Indicators
- ⚠️ Many buttons use `focus:outline-none` or rely on default browser focus which may be suppressed by Tailwind's preflight. Consider adding explicit `focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2` to interactive elements.
- ✅ The sign-in form inputs have `focus:ring-2 focus:ring-deep-forest/10` — visible but low contrast

## Color Contrast
- ⚠️ `text-slate-400` on white background — ratio ~3.4:1, below WCAG AA 4.5:1 for normal text. Used extensively for descriptions and labels.
- ⚠️ `text-gray-300` for the "OR" divider — very low contrast
- ✅ Primary text (`text-deep-forest` on white) appears to meet contrast requirements
- ✅ Button text (white on `#4F46E5`) — good contrast

## Keyboard Navigation
- ✅ All buttons are natively keyboard-accessible
- ✅ Links use proper `<Link>` or `<a>` elements
- ⚠️ The practice page option buttons could benefit from arrow key navigation (radio group pattern)

## Recommendations (Priority Order)
1. **Add `aria-label` to form inputs** on sign-in page (or use visible `<label>`)
2. **Add `role="progressbar"` with aria attributes** to the practice progress bar
3. **Add `aria-pressed`/`aria-selected`** to toggle-style buttons (section, difficulty, answers)
4. **Improve focus indicators** — add `focus-visible:ring` styles globally
5. **Improve color contrast** — bump `text-slate-400` to `text-slate-500` for body text
6. **Add `aria-live="polite"`** to the timer and feedback regions
7. **Add `aria-hidden="true"`** to decorative icons (Lucide icons next to text labels)
