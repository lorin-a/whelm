# Whelm Styleguide

The visual and motion system for whelm. Source of truth for color, type, surface, and gesture across every prototype embedded in the portfolio.

This document describes the system. The implementation lives in `src/brand-tokens.css` as CSS custom properties. Components consume tokens, never hardcoded hex.

## Color

### Core palette

| Token | Hex | Role |
|---|---|---|
| `--color-void` | `#040008` | Pure void. Pour background, blackout bars. |
| `--color-deep` | `#1F0536` | Deep purple. Primary dark surface, primary text on light. |
| `--color-shadow` | `#49325D` | Muted purple. Secondary text, soft dark surface. |
| `--color-amethyst` | `#895FAE` | Primary accent. Active state, link, brand pulse. |
| `--color-lavender` | `#BDB7E9` | Lavender. Mid-tone accent, divider, soft UI. |
| `--color-lavender-soft` | `#BDB7E999` | Lavender at 60% alpha. Overlay, hover veil. |
| `--color-haze` | `#F0E2FF` | Pale violet. Primary light surface, page wash. |
| `--color-paper` | `#F3EFF7` | Off-white. Secondary light surface, card. |

### Gradient

`--gradient-pulse` — `linear-gradient(107deg, #6825A2 6.34%, #8552B2 43.93%, #BDB7E9 74.46%)`.

Used for moments of warmth or transition. Reserve for: brand marks, the moment text reconstitutes from rain into legibility, hero pulses. Not for general buttons or surfaces.

### Surface logic across the flow

The Pour earns dark. The work of reading and choosing earns light. The transition between them is itself meaningful.

- **Pour** — `--color-void` ground, `--color-haze` text, `--color-amethyst` for live cursor / active typing.
- **Sift + Blackout** — `--color-haze` page, `--color-paper` card, `--color-deep` text. Blackout bars are `--color-void`.
- **Mirror** — `--color-paper` canvas, fragments inherit colors the user assigns from a feeling-family palette.
- **Untangle** — `--color-haze` page with `--color-deep` framing for inquiry cards.

### Contrast notes

`--color-deep` on `--color-haze` clears WCAG AA at all body sizes. `--color-shadow` on `--color-haze` clears AA for body but not for fine print under 14px — reserve for ≥16px copy. `--color-amethyst` on `--color-haze` clears AA for large text and UI components, not body — use for buttons and headers, not body links.

## Typography

Three faces, three jobs.

| Family | Use | Weights |
|---|---|---|
| **P22 Mackinac Pro** | Display, page titles, hero moments | Medium, Bold |
| **Crimson Pro** | Subheads, pull quotes, framework callouts | Regular, Italic, Semibold |
| **Noto Sans** | Body, UI, captions, labels | Regular, Medium |

### Loading

Mackinac Pro is licensed. Load via the Adobe Fonts kit (current kit ID: `ryb0aoq`) or self-host at `public/fonts/mackinac/` with a valid license and `@font-face`. Never load from a generic mirror CDN (jsDelivr, Font Library, etc.) — those copies are unlicensed.

Crimson Pro and Noto Sans load from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Noto+Sans:wght@400;500&display=swap" rel="stylesheet">
```

### Scale

Mobile-first. Override per surface when needed.

| Token | Value | Use |
|---|---|---|
| `--text-xs` | 12px | Meta, caption |
| `--text-sm` | 14px | Fine print |
| `--text-base` | 16px | Body |
| `--text-md` | 18px | Body large, lead |
| `--text-lg` | 24px | Subhead |
| `--text-xl` | 32px | Section title |
| `--text-2xl` | 44px | Page title |
| `--text-3xl` | 64px | Display |

### Leading

Body copy sits at `--leading-body` (1.6). Generous on purpose — readers under cognitive load need room. Display sits at `--leading-tight` (1.15). Subheads at `--leading-snug` (1.3).

### Pairing rules

- Display in Mackinac, body in Noto. Don't mix Mackinac with Crimson at display sizes — the warmth fights itself.
- Crimson Pro italic carries the framework voice (manifesto lines, "the story will fall away"). Use sparingly. One italic block per screen, max.
- Noto Sans Medium for buttons. Never bold body Noto Sans for emphasis inside a paragraph.

## Motion

Easing tokens live in `brand-tokens.css`. Pick by feel:

- `--ease-glide` — UI movement, pills floating
- `--ease-settle` — landing, settling, coming to rest
- `--ease-calm` — slow regulation, breath-paced
- `--ease-organic` — text reveals, character staggers

Durations: `--dur-instant` (120ms), `--dur-quick` (240ms), `--dur-soft` (420ms), `--dur-breath` (800ms), `--dur-settle` (1200ms).

`prefers-reduced-motion: reduce` collapses all durations to 0.01ms globally. Components that hide content behind motion (the rain falling, the blackout bars sliding in) must implement a per-component static fallback so content is still visible.

## Spacing & layout

Spacing scale: `--space-1` through `--space-8` (4px to 72px). Touch target floor is `--touch-min` (44px). Radii: `--radius-sm` (6px), `--radius-md` (14px), `--radius-lg` (24px), `--radius-pill` (999px).

## Brand assets

Located at `public/brand/`:

- `cursivewhelm.svg` — wordmark
- `accents.svg` — decorative flourishes
- `Portal.svg` — concentric tunnel ("Overwhelm is a Portal")
- `Signal.svg` — radiant pulse mark
- `New Tangle.svg` — overwhelm tangle illustration (used in Mirror portrait)
- `typologies.svg` — Fog / Flood / Frenzy
- `self-caremap.svg` — ecosystem diagram

When embedding in a prototype, reference via absolute path from `public/`.

## Voice in UI

Per CLAUDE.md and the global voice rules: companion, not authority. Invitations, not directives. Lowercase for soft prompts, sentence case for instructional copy, title case (or display Mackinac) only for proper section names.

- "you might notice…" — yes
- "try to…" — no
- "tap to begin" — yes
- "click here to start your journey" — never

## What's not in this guide yet

- Form input treatment
- Modal / overlay system
- Feeling-family color palette for Mirror (the colors users assign to fragments)
- Iconography system
- Embed frame chrome (header, reset, save-image affordances)

These get added as we build the surfaces that need them. One in, one out.
