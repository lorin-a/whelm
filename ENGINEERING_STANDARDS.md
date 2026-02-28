# Frontend Engineering Standards

> If a developer cannot change a font, color, or spacing value in ONE place
> and have it update everywhere, the architecture is broken. Fix it before building more.

**Design tokens (colors, typography, spacing, motion, layout) live in `DESIGN_SPEC.md` and are implemented in `globals.css`.** This document covers code craft, architecture, and engineering practices. It does not duplicate token values — when tokens change, only `DESIGN_SPEC.md` and `globals.css` need updating.

---

## 1. Design Token Architecture

All shared tokens live in `globals.css` under `:root`, organized by category. Components reference variables, never raw values.

### The One Rule

**Every visual property that appears more than once must be defined as a variable.** Fonts, colors, spacing, border radii, shadows, transition timing — all of it lives in `globals.css`. Components reference tokens, never hex codes or pixel values.

### One-offs Are Fine. Undocumented One-offs Are Not.

Not every value needs to be a token. A decorative pull quote with a unique size, a page-specific accent color, a chart with project-specific data colors — these are legitimate one-offs. The rule: **if it's custom, comment why.**

```css
/* One-off: oversized pull quote unique to this case study hero */
font-size: 2.4rem;
```

If you find yourself commenting the same "one-off" in three files, it's not a one-off anymore. Promote it to a token.

### Page-Level Custom Properties

When a page or case study needs its own accent colors, define them scoped to that page — not in the global `:root`.

```css
/* At the top of a page's module.css */
.page {
  --page-accent: #554E65;
  --page-accent-light: #E4E0EB;
}

/* Components on this page reference --page-accent */
.heading {
  color: var(--page-accent);
}
```

This keeps the global token system clean while giving individual pages their own identity.

### What Gets Tokenized vs. What Doesn't

| Tokenize (global `:root`) | Don't tokenize |
|---|---|
| Brand colors, text colors, backgrounds | Project-specific case study colors |
| Font families and standard size scale | One-off decorative sizes (comment why) |
| Spacing scale used across components | Third-party embed overrides |
| Shared motion values | Data viz / chart-specific colors |

---

## 2. File Structure

### Components With Styles Get Folders

```
ComponentName/
├── ComponentName.js
└── ComponentName.module.css
```

### Utility Components Live Together

Small, style-free utility components (under ~15 lines, no CSS) don't need individual folders:

```
components/
├── index.js              ← barrel file for clean imports
├── Nav/
│   ├── Nav.js
│   └── Nav.module.css
├── CardDeck/
│   ├── CardDeck.js
│   └── CardDeck.module.css
├── utils/                ← style-free utilities
│   ├── VisuallyHidden.js
│   └── ConditionalWrap.js
```

The test: does this component have its own CSS module? If yes, it gets a folder. If no, it lives in `utils/`.

### Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase folder + file | `CardDeck/CardDeck.js` |
| CSS Modules | Match component name | `CardDeck/CardDeck.module.css` |
| CSS classes | camelCase | `.heroTitle` |
| Routes/pages | kebab-case | `app/projects/[slug]/page.js` |
| Images | kebab-case with project prefix | `gs-workshop-01.jpg` |
| Constants | UPPER_SNAKE | `MAX_CAROUSEL_ITEMS` |

---

## 3. CSS Rules

### Single Source of Truth

Every selector defined ONCE. Never append a second copy further down the file.

### Components Reference Tokens

```css
/* CORRECT */
.heading {
  font-family: var(--font-heading);
  font-size: var(--text-h2);
  font-weight: var(--weight-title);
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

/* WRONG — hardcoded values that exist as tokens */
.heading {
  font-family: 'Fraunces', serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #2C2C2C;
  margin-bottom: 1rem;
}
```

### Responsive Styles: Depends on File Size

**In shared/page-level stylesheets (100+ lines):** consolidate media queries at the bottom.

```css
/* page.module.css — consolidate at bottom */
.hero { ... }
.card { ... }
.grid { ... }

@media (max-width: 900px) {
  .hero { ... }
  .card { ... }
}

@media (max-width: 600px) {
  .hero { ... }
  .card { ... }
}
```

**In component CSS modules (under ~100 lines):** co-locate media queries with their selectors.

```css
/* CardDeck.module.css — co-locate is fine */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
}
```

### No `!important`

If you need `!important`, the specificity is wrong. Fix the selector hierarchy.

**One exception:** the `prefers-reduced-motion` global override, where `!important` is correct to ensure animations are truly disabled.

### CSS Module Classes Only

No global class names in component files. Every class comes through the module.

---

## 4. JavaScript / React Rules

### Component Documentation

Every component gets a top comment explaining what it does, where it's used, and what it accepts.

```jsx
/**
 * QuoteBlock — Styled pull quote with optional attribution.
 * Used in: Case study pages, about page.
 *
 * @param {string} quote - The quote text
 * @param {string} [attribution] - Who said it
 * @param {string} [as='blockquote'] - HTML element to render as
 */
```

### Client vs. Server

`'use client'` only on components that actually use hooks, event handlers, or browser APIs. Don't blanket every file with it.

### Inline Styles

**Use inline styles when:** the value is calculated at runtime from JS state, props, or user interaction. Grid column counts from data, scroll-position-based transforms, dynamically sized elements.

**Don't use inline styles when:** the value could live in a stylesheet. If it's a static color, font, or spacing value, it belongs in CSS.

The test: *"Does this value change based on data, state, or user interaction?"* If yes, inline style. If no, stylesheet.

### Semantic HTML

Use the right element, not a styled div.

- `<main>` — one per page
- `<section>` — thematic groupings
- `<article>` — self-contained content
- `<nav>` — navigation
- `<header>` / `<footer>` — page or section boundaries
- `<button>` for actions, `<a>` for navigation

### Heading Levels and Reusable Components

Strict h1→h2→h3 hierarchy must be maintained in the rendered DOM. Reusable components should be flexible about which heading level they render via an `as` prop:

```jsx
<SectionTitle as="h2">Research Approach</SectionTitle>
<SectionTitle as="h3">Key Findings</SectionTitle>
```

### Cleanup

- Remove all `console.log` before committing
- Remove all unused imports
- No dead code in production

---

## 5. Accessibility Baseline

These ship with every component. Not optional. For comprehensive accessibility standards, see `DESIGN_SPEC.md` Section 9.

### Required on Every Component

- All interactive elements: keyboard accessible
- All focus states: visibly styled via `:focus-visible`
- Color contrast: WCAG AA minimum (4.5:1 body, 3:1 large text)
- Touch targets: minimum 44×44px
- ARIA labels on icon-only buttons
- `prefers-reduced-motion` respected for all animations
- Hover effects gated behind `@media (hover: hover)`

### Images and Alt Text

**Content images:** descriptive alt text explaining what the image shows.

**Galleries and carousels:** the container gets a descriptive `aria-label` explaining the collection. Individual images get brief alt text — no need for 12 poetic descriptions, which creates screen reader fatigue.

**Images with visible captions:** use `aria-describedby` pointing to the caption element. Don't duplicate the caption in the alt text.

**Decorative images:** `alt=""` and `aria-hidden="true"`.

**Complex images (data visualizations, diagrams):** `aria-describedby` linking to a text description of the key insights.

### Image Optimization

- Target ~300KB per image maximum. Large images are the #1 performance killer.
- Prefer WebP format for all raster images. Cloudinary handles this via format auto-detection.
- Always resize and export at the exact dimensions needed. Never rely on the browser to downscale a larger file.
- Run Lighthouse performance audit before any deploy; flag any image over 500KB.

---

## 6. Motion Standards

All animations reference token values from `globals.css`. No magic numbers in component files. For the full motion system (curves, durations, primitives), see `DESIGN_SPEC.md` Section 6.

### Rules

- CSS handles animations. JS triggers state changes that CSS responds to.
- Use `transform` and `opacity` for performance (GPU-accelerated).
- Every animation must have a `prefers-reduced-motion` alternative.
- Individual components must explicitly set `opacity: 1; transform: none;` in their reduced-motion block — the global override kills durations but components need to ensure content is visible in its final state.

### Text Reveal Animations (clip-path wipes)

**Never use fixed durations for text wipes.** Scale duration by character count so all text reveals at the same visual pace regardless of length:

```js
const perChar = 0.1  // seconds per character
const minDuration = 1.0
const duration = Math.max(minDuration, text.length * perChar)
```

**Easing:** Use `power1.inOut` (GSAP) or `cubic-bezier(0.42, 0, 0.58, 1)` (CSS). This produces a calm, nearly linear reveal with soft edges. Never use `power3`/`power4` for text — they create an aggressive wind-up/snap feel. Text should appear at a steady, readable pace.

**For CSS transitions** where duration can't be set in the stylesheet (e.g., hover-triggered word swaps), calculate the clip-path duration in JS and apply it inline:

```jsx
const clipDur = Math.max(minDuration, word.length * perChar)
<span style={{ transitionDuration: `0.9s, ${clipDur}s` }}> // opacity, clip-path
```

---

## 7. Comments and Commented Code

### Good Comments Explain Why

```css
/* Offset accounts for sticky nav height */
scroll-margin-top: 4.5rem;
```

```jsx
/* Delay ring animation until type-on sequence completes —
   rings compete for attention if they start simultaneously */
```

### Remove

- Comments restating what the code does: `// set state to true`
- AI meta-comments: `// Added per user request`
- Generic labels: `// This is a component`

### Commented-Out Code

During **active development:** commented code is fine but must include a date and reason:

```jsx
/* REMOVED 2026-02-16: previous spring animation, keeping until
   new easing is verified on mobile */
```

**Before any handoff or release:** all commented code is removed. It's in git history if needed.

**Any commented code older than 2 weeks** without a clear reason gets deleted.

---

## 8. Git Hygiene

### Conventional Commits

```
type: concise description under 72 chars
```

| Type | When |
|------|------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `refactor` | Code restructure, no behavior change |
| `style` | Visual/CSS changes only |
| `docs` | Documentation updates |
| `chore` | Config, dependencies, cleanup |

Body is optional. Use it for complex changes to explain reasoning.

### .gitignore

```
node_modules/
.next/
out/
.env
.env.local
.env*.local
.DS_Store
Thumbs.db
*.log
.vercel
```

---

## 9. The Handoff Test

Before any page or component is considered done:

1. Can a developer change the primary font in ONE place and see it everywhere?
2. Can they change the primary color in ONE place?
3. Can they understand each component from its file name and top comment?
4. Can they run `npm install && npm run dev` and see a working site?
5. Is there a README with project structure and setup instructions?
6. Are there zero stale TODO comments or unexplained commented code?

If any answer is no, it's not ready for handoff.

---

## 10. Pre-Commit Checklist

- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — passes
- [ ] No hardcoded values that duplicate existing tokens
- [ ] No `console.log` statements
- [ ] No unused imports
- [ ] All images have appropriate alt text
- [ ] Checked at desktop (>900), tablet (900), mobile (600), small (400)
- [ ] New components have JSDoc comments
- [ ] Commit message uses conventional format

---

*This document covers engineering craft. For design decisions (tokens, colors, typography, motion values, case study structure, accessibility feature toggles), see `DESIGN_SPEC.md`.*
