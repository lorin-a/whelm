# Product Requirements Document (PRD)
## Product Name
Whelm
## One-Sentence Description
Whelm is a body-based, trauma-informed mental health tool that helps emotionally fluent but
overwhelmed people untangle their inner experience, discover values, and regain agency—at
their own pace.
## Problem Statement
Users are smart enough to know they are stuck, but not resourced enough to get unstuck.
They:
- Feel overwhelmed, tangled, and unable to find the thread
- Have tried meditation apps (too passive, too generic)
- Have tried journaling (gets messy, uncontained)
- May be in therapy but need support between sessions
- Feel they *should* be able to figure this out alone
Overwhelm is treated as a failure to fix—rather than material to work with.
## Core Philosophy
- Overwhelm is not a problem to solve, but information to be worked with
- The body holds truth before cognition
- The wound is the map to the value
- Users retain agency at all times (skip, pause, return)
- The tool should eventually be needed less (that is success)
- The tool should meet users where they already are (often on their phone)
- DO NO HARM, when in doubt, slow down, soften, and offer choice
## Target User
Emotionally intelligent, introspective people who:
- Overthink and intellectualize
- People-please and lose themselves
- Are highly sensitive and perceptive
- Want clarity, not platitudes
## Transformation (Before → After)
### Before
- Spinning, overwhelmed, fragmented
- No language for what they’re feeling
- Disconnected from body
- Knows patterns exist but can’t see them clearly
### After
- Has language for inner experience
- Recognizes patterns (“this is my autonomy thing again”)
- Trusts bodily signals
- Has personal artifacts (values map, dopamine menu)
- Can export insights to therapy
- Needs the tool less over time
## Differentiation / Moat
- Body-based, not just cognitive
- Framework-driven but not visible as cognitive load
- AI parses and untangles emotional input (“emotional Grammarly”)
- Values are revealed through use, not declared
- Personal artifacts accumulate and evolve over time
## Success Criteria
- Users feel less overwhelmed after a session
- Users report increased self-trust and clarity
- Users voluntarily return but don’t feel dependent
## Non-Goals
The following are explicitly not goals of this product:
- Maximizing time spent in the app
- Driving daily engagement or streaks
- Creating user dependency
- Gamifying emotional work
- Replacing therapy or professional care
- Optimizing for virality over safety
- Forcing completion of flows
# Product Requirements
## Core Functional Requirements (MVP)
- User can begin without account creation
- User can follow a guided flow to untangle overwhelm
- User can skip any step without penalty
- User can offload thoughts safely (ephemeral or saved)
- User can receive AI-assisted parsing and reflection
- User can export insights (text summary)
## Non-Functional Requirements
- Trauma-informed language and pacing
- No urgency, streaks, or gamification
- Accessible (reduced motion, readable typography)
- Privacy-respecting by default
- No diagnosis or clinical claims
- Fully usable on mobile, tablet, and desktop
## User Agency & Exit Paths
- User can exit any flow at any time
- User can save without finishing
- User can abandon without penalty
- The system never frames exit as failure
## Explicit Exclusions
- No streaks, points, badges, or rewards
- No notifications designed to induce guilt or urgency
- No dark patterns encouraging prolonged use
## Out of Scope (for now)
- Community features
- Therapist marketplace
- Full longitudinal analytics
- Crisis intervention or emergency response
# Experience Flow
## High-Level Framework
REAL → STILL → ROOT → RISE
This structure is architectural, not instructional.
## Phase Breakdown
### REAL — Regulate / Return to What’s Real
- Release tension
- Exhale
- Allow what is present
- Land in the body
### STILL — Assess / Be Still
- Body scan
- Internal weather report
- Inventory emotions and sensations
- Locate experience in the body
### OPEN — Explore
- ORGANIZE sort and separate tangled thoughts
- PRIORITIZE pick one at a time to examine further
- EXAMINE scan for what is at the 'core' (values, emotions, judgements, etc)
- NAME close by naming what is at the root of the untangled aspect
Instructional metaphors:
-
“Find your ROOT”
-
“Be OPEN”
-
“Get to the CORE”
### RISE — Integrate
- Recognize patterns and values
- Set small intentions
- Share or export insights
- Expand pathways for future work
## Progressive Disclosure Rules
- Depth is optional, never required
- Advanced tools appear only after initial grounding
- Skipped steps become invitations, not warnings
- The simple flow must always be sufficient on its own
## Entry Modes
- Crisis Mode: guided, minimal choice
- Explore Mode: optional depth and agency
Both enter the same ecosystem.
# Frontend Principles
## Emotional Goals
- Calm, held, grounded
- Never overwhelming
- Gentle guidance, not instruction
## Visual Language
- Organic forms
- Soft motion
- Breathing space
- Light typography hierarchy
- Purple accent used sparingly for emphasis/insight
## Interaction Rules
- No hard stops
- Skip always visible
- Motion communicates meaning, not decoration
- Text can disappear (offloading is not hoarding)
## Accessibility
- Reduced motion support
- Clear contrast
- Keyboard navigable
- No flashing or abrupt transitions
## Responsive & Touch Design
- Mobile-first thinking, desktop-enhanced layouts
- Touch-friendly interactions (no hover-only actions)
- Large, forgiving tap targets
- Gestures must be optional, not required
- No dense text blocks on small screens
- Flows should feel equally calm on phone, tablet, and desktop
## Cognitive Load Management
- One primary action per screen
- Secondary actions must be visually softer
- No screen should require reading more than a few short paragraphs
- AI responses should be skimmable, not dense
- White space is a functional feature, not decoration
# Backend & AI Principles
## AI Role
- Untangle
- Reflect
- Surface patterns
- Suggest language
AI must NOT:
- Diagnose
- Prescribe
- Teach emotionally in a top-down way
## Data Philosophy
- Minimal data retention
- User owns their artifacts
- Ephemeral by default where possible
## AI Tone
- Curious
- Non-assumptive
- Validating without reinforcing stuckness
## AI Uncertainty Rules
- If confidence is low, ask reflective questions instead of asserting meaning
- Prefer “might” and “could” over definitive statements
- Surface patterns gently and optionally
- Never surface more than 1–2 insights at a time
# Tech Stack
## Current
- React
- CSS (custom properties)
- AI-assisted development (Claude, Cursor)
## Likely Additions
- TypeScript (later)
- Lightweight backend (TBD)
- Secure storage for user artifacts
## Constraints
- Must support accessibility
- Must support motion preferences
- Must be easy to iterate quickly
- Must be responsive across mobile, tablet, and desktop
# Project Status
## Current Phase
Early exploratory build (vision + implementation evolving together)
## Known Unknowns
- Final naming of phases (ROOT / OPEN / CORE still in flux)
- Exact AI parsing depth
- Long-term monetization
## Guardrails
- Do not overbuild
- Protect the nervous system (yours and users’)
- Ship small, test resonance, iterate
## Definition of Progress
Clarity and coherence, not feature count
# Safety & Trauma-Informed Guardrails
## Core Rule
When uncertainty or intensity increases, the system must slow down, soften, and increase user
choice.
## Emotional Safety Principles
- Never imply something is “wrong” with the user
- Never force emotional depth
- Never interpret emotions as facts
- Never collapse complexity into certainty
## Intensity Management
- Offer grounding before exploration
- Limit AI output length during high-intensity flows
- Prefer reflection over interpretation
- Encourage pausing when signals of overwhelm appear
## Crisis Boundaries
- This tool is not a crisis intervention system
- If language indicates acute distress, respond with:
- Validation
- Grounding
- Encouragement to seek external support
- Do not escalate, alarm, or over-direct