# Breathing Orb Integration Guide

## Overview

This update adds a **Breathing Orb** component that bridges the transition between the Body Scan and the Hub. The breathing exercise uses a 4:6 ratio (4 second inhale, 6 second exhale) to activate the parasympathetic nervous system.

## New Flow Sequence

```
Intro → Begin → Meter → Body Scan → Breathing Orb → Hub Active
                                     ↓
                               (orb settles to
                                persistent button)
```

### First Encounter Flow

1. Body scan completes
2. Full-screen breathing orb appears with message: "Nice work checking in with yourself. Let's take a breath together."
3. User breathes with the expanding/contracting orb
4. User taps "I'm ready to continue" (or "skip for now")
5. Orb shrinks and settles to persistent button position (below ? button)
6. Onboarding tooltip appears: "this breathing exercise is always here for you, at your own pace"
7. Hub reveals with sweep animation

### Persistent Access

- Small button always visible in top-right (below About button)
- Tap to expand full-screen breathing exercise
- X to close and return to hub
- No tooltip on subsequent uses

---

## Files Added/Modified

### New Files

| File | Purpose |
|------|---------|
| `BreathingOrb.tsx` | Breathing orb component |
| `BreathingOrb.css` | Styles for breathing orb |

### Modified Files

| File | Changes |
|------|---------|
| `App.tsx` | Integrated breathing orb into flow |
| `tokens.ts` | Added `breathing` and `breathing-settling` flow phases |

---

## Installation

Copy all files to your `~/Desktop/whelm/src/` directory:

```bash
cp App.tsx ~/Desktop/whelm/src/
cp tokens.ts ~/Desktop/whelm/src/
cp BreathingOrb.tsx ~/Desktop/whelm/src/
cp BreathingOrb.css ~/Desktop/whelm/src/
```

---

## Type Definitions

### New FlowPhase Values

```typescript
export type FlowPhase = 
  | "intro" 
  | "explaining" 
  | "ready" 
  | "meter" 
  | "bodyscan" 
  | "breathing"          // NEW: full-screen breathing exercise
  | "breathing-settling" // NEW: orb shrinking to corner
  | "hub-active";
```

### BreathingOrb Props

```typescript
interface BreathingOrbProps {
  mode: "fullscreen" | "minimized" | "expanding";
  onComplete: () => void;
  onSkip?: () => void;
  isFirstEncounter?: boolean;
  onExpand?: () => void;
}
```

### New Timing Tokens

```typescript
timing.breathing = {
  shrinkDelay: 400,      // Before orb starts shrinking
  shrinkDuration: 800,   // Shrink animation duration
  hubRevealDelay: 600,   // After shrink before hub reveals
};
```

---

## Design Decisions

### Trauma-Informed Choices

| Decision | Rationale |
|----------|-----------|
| 4:6 breath ratio | Longer exhale activates parasympathetic response |
| User-controlled duration | No pressure to complete a set number |
| Always skippable | Honors agency, even on first encounter |
| Soft language | "Let's take a breath together" vs "You need to calm down" |
| Gentle cycle count | Shows "X breaths" without gamification |
| Persistent access | Tool is available without being pushy |

### Visual Choices

| Element | Approach |
|---------|----------|
| Orb colors | Subtle gradient shift between inhale/exhale |
| Motion | Slow, organic easing (no bouncing) |
| Size change | 80px → 160px expansion range |
| Mini button | 44px touch target with gentle pulse |

### Accessibility

- `prefers-reduced-motion` respected
- `aria-live` regions for instruction changes
- Keyboard navigable
- Clear focus states
- No meaning conveyed only through motion

---

## Animation Details

### Breath Cycle Timing

```
┌─────────┬──────────┬─────────────┬──────────┐
│ Inhale  │ Hold     │ Exhale      │ Rest     │
│ 4000ms  │ 300ms    │ 6000ms      │ 300ms    │
└─────────┴──────────┴─────────────┴──────────┘
Total cycle: 10,600ms (~10.6 seconds)
```

### Orb Size Animation

- Min size: 80px (exhale complete)
- Max size: 160px (inhale complete)
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` (calm, organic)

---

## State Management in App.tsx

New state variables:

```typescript
// Breathing orb state
const [breathingOrbMode, setBreathingOrbMode] = 
  useState<"fullscreen" | "minimized" | "expanding">("fullscreen");
const [isFirstBreathingEncounter, setIsFirstBreathingEncounter] = 
  useState(true);
const [showBreathingOrb, setShowBreathingOrb] = 
  useState(false);
```

Key handlers:

```typescript
// After body scan completes
handleBodyScanComplete → setFlowPhase("breathing")

// After breathing completes/skips
handleBreathingComplete → setFlowPhase("breathing-settling")
                       → setBreathingOrbMode("minimized")
                       → setTimeout → setFlowPhase("hub-active")

// Expand minimized orb
handleBreathingExpand → setBreathingOrbMode("expanding")

// Close expanded orb
handleBreathingOrbClose → setBreathingOrbMode("minimized")
```

---

## What This Does NOT Do

Per project philosophy, this implementation intentionally avoids:

- Forced completion (always skippable)
- Gamification (no "achieve X breaths" achievements)
- Urgency language (no countdown timers)
- Progress bars or completion percentages
- Notification pressure to use the tool
- Dependency creation

---

## Next Steps (Not Implemented)

These features are planned but not included in this PR:

1. **Hub Center Transformation** - Replace empty circle with body scan output
2. **Hub Reveal Animation** - New organic reveal based on sketch
3. **Body Scan Summary in Hub** - Tap center to review/edit

---

## Testing Checklist

- [ ] Body scan → breathing transition is smooth
- [ ] "Skip for now" works on first encounter
- [ ] "I'm ready to continue" completes the exercise
- [ ] Orb shrinks to corner after completion
- [ ] Tooltip appears on first settle
- [ ] Mini button expands to full-screen
- [ ] X closes expanded orb
- [ ] Hub reveals after breathing settles
- [ ] Reduced motion preference is respected
- [ ] Works on mobile viewport

---

## Notes

- The breathing orb persists in hub-active phase as a nervous system support tool
- The About button ("?") represents cognitive support; the breathing orb represents somatic support
- First encounter tooltip auto-dismisses after 6 seconds
- The cycle count is non-judgmental ("X breaths" vs "only X breaths")
