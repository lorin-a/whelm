# Body Scan Integration Guide (Updated)

## What Changed

### 1. Overwhelm-o-Meter
- **Question**: Changed from "What does your overwhelm look like right now?" to "How intense is your overwhelm right now?"
- **Levers**: Traditional pill-shaped lever handles instead of glowing circles
- **Data passing**: Now passes intensity level and normalized value to parent

### 2. Body Scan
- **Size**: Body silhouette increased by 1.5x (from 160x260 to 240x390)
- **"Show fewer" button**: Now matches the "+ more words" dotted border style
- **Summary**: Now displays the overwhelm intensity from the meter

### 3. Data Flow
The overwhelm intensity is now passed through the flow:
```
OverwhelmOMeter → App (stores intensity) → BodyScan (displays in summary)
```

---

## Files to add to your project

Copy these files to `~/Desktop/whelm/src/`:
- `App.tsx` (updated)
- `BodyScan.tsx` (updated)
- `BodyScan.css` (updated)
- `OverwhelmOMeter.tsx` (updated)
- `styles.css` (updated)
- `tokens.ts`
- `index.tsx`

---

## Type Updates

### OverwhelmOMeter Props
```typescript
interface OverwhelmOMeterProps {
  onComplete: (intensity: { level: string; normalizedValue: number }) => void;
  onBack: () => void;
}
```

### BodyScan Props
```typescript
interface BodyScanProps {
  onComplete: (result: BodyScanResult) => void;
  onBack?: () => void;
  overwhelmIntensity?: OverwhelmIntensity | null;  // NEW
}

interface OverwhelmIntensity {
  level: string;           // e.g. "very overwhelmed"
  normalizedValue: number; // 0-1 range
}
```

---

## Full Flow After Integration

1. **Intro** → "welcome to overwhelm" animation
2. **Ready** → "begin" circle appears
3. **Meter** → "How intense is your overwhelm right now?" with lever handles
4. **Body Scan** → Location → Water → Sensation → Color → Summary (with intensity)
5. **Hub Active** → Hub reveals with nodules

---

## Summary Display

The body scan summary now shows:
- Body silhouette with colors and water texture
- **Overwhelm intensity level** (from the meter)
- Water state description
- Body location
- Selected sensation words

---

## Notes

- All class names are prefixed with `body-scan-` to avoid conflicts
- The component is self-contained with its own CSS
- Back button on step 1 calls `onBack` prop (returns to meter)
- Back button on other steps navigates within the body scan
- The lever styling uses a subtle gradient and shadow for a physical feel
