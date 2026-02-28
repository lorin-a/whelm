# CLAUDE.md — Whelm Void Prototype

You are working on Whelm, a trauma-informed digital wellness tool. This branch
contains the "void" prototype — the brain dump step where users pour out overwhelm
and see their emotionally charged words distilled from dissolving narrative.

## What This Prototype Is

A single-file HTML/CSS/JS prototype (void-rain-v9.html) implementing the "brain dump"
step of the Whelm framework. The user types stream-of-consciousness text. As they type:

- Older text "trails" (ghosts out) behind a moving window
- Emotionally charged words crystallize into pill-shaped tags inline
- Trailed text falls as rain (individual characters drifting down and fading)
- Charged words fall as intact pills and collect in a pile at the bottom
- Tapping a collected pill reveals progressive context (fragment → sentence → full text)
- Stacking connectors ("but", "even though") become "+" pills showing both sides of a tangle

The contract with the user: "The story will fall away. The feelings will stay."

## Project Context

This prototype lives on a testing branch, separate from the main app which has:
- An intro sequence ("overwhelm" → "whelm" animation)
- A hub with four nodules
- A body scan / overwhelm-o-meter
- Breathing exercises

This prototype will eventually integrate as Step 2 of the flow (after body snapshot,
before word portrait), but right now it's being developed and tested independently.

## Tech Stack (This Prototype)

- Single HTML file with embedded CSS and JS
- Vanilla JavaScript — no frameworks, no build step
- DM Sans font via Google Fonts
- No external dependencies

The main Whelm app uses React + CSS custom properties + Framer Motion, but this
prototype is intentionally standalone for rapid iteration.

## Architecture of the Prototype

### Word Parsing Engine

The parser follows the Word Parsing Ruleset (WORD_PARSING_RULESET.md in the docs
folder). It uses a three-layer approach, currently implementing Layer 1:

**Layer 1 (implemented): Heuristic pattern matching**
- Word sets: ADJECTIVES, IDENTITY_NOUNS, INTENSIFIERS, IDENTITY_VERBS, EXTRA_CHARGED
- Phrase patterns via `checkPhrase()` — ordered by specificity (longest match first)
- Stacking connectors via `checkStackingPhrase()` and STACKING_SINGLE
- `parseWords()` tokenizes text and applies phrase detection in priority order

**Layer 2 (future): AI-assisted semantic analysis**
- Context-dependent signals (distinguishing "behind the house" from "behind in my life")
- Echoed language detection, sarcasm, spiral structure recognition
- NOT YET IMPLEMENTED — do not build this without explicit direction

**Layer 3 (always): User agency**
- Users should eventually be able to dismiss pills that don't resonate and highlight
  words the system missed
- NOT YET IMPLEMENTED

### Signal Categories (from the Ruleset)

The parser detects words/phrases from these categories. When expanding detection,
refer to WORD_PARSING_RULESET.md for full definitions and examples:

1. Self-Judgment Language (identity statements, verbs as identity, metaphorical nouns)
2. Intensity Markers ("too", "so", "really" + charged word)
3. Absolutist Language ("always", "never", "everything", "nothing")
4. Obligation / Externalized Authority ("should", "supposed to", "have to")
5. Minimizing & Dismissal ("just", "probably overreacting", "i'm fine")
6. Metaphorical & Embodied Language (spatial, weight, water, container, temperature)
7. Comparative & Relational Positioning ("not enough", "everyone else", "normal")
8. Echoed & Borrowed Language (clinical terms used as self-punishment, accusation words)
9. Conflation & Structural Markers ("but" as negation, "and" chains, "because" self-blame)
10. Catastrophizing & Permanence ("forever", "it's over", "ruined", "destroyed")
11. Agency & Power Language ("can't", "helpless", "trapped", "no choice")
12. Meta-Anxiety ("why can't I just", "what's wrong with me", self-monitoring)
13. Relational Language ("abandoned", "after everything", obligation about others)
14. Silence & Absence Signals (trailing off, topic shifts — hard to detect heuristically)

### Rendering Pipeline

```
Input event → parseWords() → scheduleRender() [RAF] → renderTypingLine()
                                                    ↓
                                          scheduleRelease() [double-RAF]
                                                    ↓
                                          releaseTrailing() → spawnRain() + dropPill()
```

Key performance decisions:
- Single input handler (not duplicated)
- Render debounced via requestAnimationFrame
- Release uses double-RAF (render frame, then measure frame) to avoid layout thrash
- Re-entrance guard (`isReleasing`) prevents collision between trailing and force release
- Pre-built remaining strings for stacking phrase lookup

### Pill Context System

When a charged word is released, `storePillContext()` snapshots the source text and
character positions. When the user taps a collected pill:

- Regular pills: show 3 progressive depth levels (fragment → sentences → full text)
  with the charged word highlighted
- Stacking "+" pills: show both sides of the tangle with a "· + ·" divider

Context is retrieved most-recent-first via `findContextForPill()`.

### Auto-Release Triggers

Text is released (dissolved into rain) via:
1. **Trailing**: As the user types, words older than TRAIL_DISTANCE fall away
2. **Punctuation**: 1s after sentence-ending punctuation (. ! ?)
3. **Pause**: 3.5s after typing stops (if >5 chars present)
4. **Enter key**: Immediately releases all text

## Hard Constraints (Non-Negotiable)

These come from the Whelm ethical framework and PRD. Violating them is a blocker.

### Trauma-Informed
- User can exit at any time — exit paths must be visible, not hidden
- No language implying something is "wrong" with the user
- No forced emotional depth
- When uncertainty increases, slow down, soften, offer choice
- Reduced motion must be a first-class path (`prefers-reduced-motion`)

### Parsing Ethics
- Surface, don't interpret — the parser identifies what carries weight, not what it means
- No pathologizing — never show clinical category names to users
- The void contract is sacred — narrative falls away, words stay, no surveillance
- Err toward under-detection — false negatives are better than false positives
- Crisis detection is separate — self-harm language triggers safety protocol, not the word portrait

### Visual & Interaction
- Organic forms, not grid-based or mechanical
- Animation is regulatory, not decorative — never creates urgency
- Motion resembles breath/gravity/settling, not springs or bounces
- Touch-first design, minimum 44×44px touch targets
- One primary action per screen

### Voice & Tone
- Companion, not authority
- Invitations over directives ("you might notice..." not "try to...")
- No productivity metaphors (reset, reboot, efficiency)
- No framing emotions as problems to solve
- No framing regulation as "getting back to normal"

## What NOT to Do

- Do not add frameworks, build tools, or package managers to this prototype
- Do not introduce React — this file stays vanilla JS until explicitly migrated
- Do not add localStorage or session persistence (ephemeral by default for now)
- Do not add AI API calls without explicit direction
- Do not add user accounts, analytics, or telemetry
- Do not add streaks, badges, progress indicators, or completion framing
- Do not interpret or diagnose — the system surfaces, the user decides
- Do not expand scope beyond the brain dump step without checking in

## How to Work on This

### Testing

Open `void-rain-v9.html` directly in a browser. No build step.

Test with these phrases from the Word Parsing Ruleset test passages:

**Test 1 (high signal):**
"I had a hypersensitive moment and I'm feeling shame and embarrassed and I keep
doing this toxic thing and I feel damaged and I'm probably sabotaging everything."

Expected: hypersensitive, shame, embarrassed, stacking "+" for "and" chains,
toxic, damaged, sabotaging, everything

**Test 2 (comparison + timeline):**
"I feel so behind in my life. Everyone else seems to have it figured out and I'm
just stuck. I should be further along by now. What's wrong with me?"

Expected: so behind, everyone else, stuck, should be, by now, what's wrong with me

**Test 3 (echoed + meta-anxiety):**
"I know this is irrational but I feel like I can't breathe whenever he doesn't
text back. I'm being clingy. A normal person wouldn't care this much. I'm too much."

Expected: i know... irrational, stacking "+" for "but", can't breathe, clingy,
normal person, too much

**Test 4 (should produce nothing):**
"I need to pick up groceries and also call the dentist. My car needs an oil change."

Expected: No pills.

### Making Changes

1. Before editing, identify: what files change, what's the expected result on
   mobile AND desktop, what could break
2. Keep changes small and reversible
3. Test on mobile viewport (375px width) — the primary user is on their phone
4. Check that `prefers-reduced-motion` still works after animation changes
5. If expanding the word lists or phrase patterns, add a test phrase that
   exercises the new detection

### File Structure

Currently a single file. If it needs to split:
```
void-prototype/
├── void-rain.html          # Main file
├── parsing-engine.js       # Word detection (if extracted)
├── CLAUDE.md               # This file
└── tests/                  # Test phrases and expected results
    └── test-passages.md
```

Do not split prematurely — single-file is fine until complexity demands it.

## Known Issues / Open Questions

- Mobile keyboard can obscure the pill pile or typing area — needs viewport management
- No visible exit/skip path yet (required by ethical framework)
- Deduplication: same charged word from different sentences only shows once in pile
  — may want to allow multiples eventually
- "and" as stacking connector is intentionally excluded (too noisy) — but "and...and...and"
  chains are meaningful stacking patterns not yet detected
- Auto-release timing (1s punct, 3.5s pause) needs user testing — may feel too fast or
  too slow depending on typing speed
- Pill pile layout is functional but not yet a "word portrait" — the visual arrangement
  could communicate more

## Reference Documents

These live in the project's docs folder and are the source of truth:

- **WORD_PARSING_RULESET.md** — Complete ruleset for the perception engine (14 categories)
- **Whelm_Updated_Framework** — The full flow from body snapshot through reframed story
- **Whelm_Voice_and_Tone_Guide** — Anti-colonial, anti-capitalist voice constraints
- **Whelm_Animation_Philosophy** — Trauma-informed motion principles
- **Whelm_PRD_Related_Files** — Product requirements, tech stack, safety guardrails
- **Whelm_PR_Reviewer_Prompt** — Review lens for changes (safety → agency → cognitive load → accessibility → coherence)
- **ETHICAL_FRAMEWORK.md** — Values-based decisions and accessibility commitments
- **RESPONSIVE_STRATEGY_UNIVERSAL.md** — CSS handles scaling, JS handles state

## Closing Orientation

This prototype serves people who are overwhelmed, on their phone, at low capacity.
Every decision should be tested against: "Would this help someone who can barely focus?"

The interaction IS the therapy. The contract is sacred. Move at the speed of trust.
