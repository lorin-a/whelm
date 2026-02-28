/**
 * Whelm Design Tokens
 */

export const colors = {
  text: "#2D2438",
  background: "#F8F7FC",
  accent: "#E6E6FA",
  line: "#D0D0D0",
  nodules: {
    checkIn: "#B8D4E3",
    returnToReal: "#A8C8DC",
    makeSense: "#9DC1D9",
    integrate: "#B0CFE8",
  } as Record<string, string>,
  nodulesMuted: {
    checkIn: "#D8DFE3",
    returnToReal: "#D4DBDF",
    makeSense: "#D2D9DD",
    integrate: "#D6DEE4",
  } as Record<string, string>,
  textMuted: "#9A939F",
  textInactive: "#8A8490",
};

export const timing = {
  introSequence: [100, 500, 700, 900, 900, 1800, 1400, 2000, 1200, 3200, 100] as number[],
  replayDelay: 2500,
  sweep: {
    checkInPause: 800,
    sweepDuration: 900,
    stickPause: 650,
    settleDelay: 400,
  },
  retract: {
    staggerDelay: 250,
    duration: 600,
  },
  breathing: {
    shrinkDelay: 400,      // Delay before orb starts shrinking
    shrinkDuration: 800,   // How long the shrink animation takes
    hubRevealDelay: 600,   // Delay after shrink before hub reveals
  },
};

export const easings = {
  organic: "cubic-bezier(0.45, 0, 0.55, 1)",
  glide: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  soft: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  settle: "cubic-bezier(0.23, 1, 0.32, 1)",
  calm: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};

export const sizing = {
  noduleSize: 80,
  noduleRadius: 40,
  noduleDistance: 200,
  circle: { small: 160, medium: 200, large: 240 },
};

export const introStages: Record<string, number> = {
  RESET: -1,
  INITIAL: 0,
  W_APPEARS: 1,
  WELCOME: 2,
  WELCOME_TO: 3,
  OVERWHELM: 4,
  STRIKETHROUGH: 5,
  OVER_DROPS: 6,
  WHELM_CENTERS: 7,
  CIRCLE_GROWS: 8,
  PAUSE_ON_WHELM: 9,
  FADE_TO_ENTER: 10,
};

export interface HubStage {
  id: string;
  label: string | string[];
  angle: number;
}

export const hubStages: HubStage[] = [
  { id: "checkIn", label: "Check-In", angle: -90 },
  { id: "returnToReal", label: ["Return to", "R.E.A.L."], angle: 0 },
  { id: "makeSense", label: ["Make", "Sense"], angle: 90 },
  { id: "integrate", label: "Integrate", angle: 180 },
];

// Updated flow phases to include body scan intro and breathing transition
export type FlowPhase = 
  | "intro" 
  | "explaining" 
  | "ready" 
  | "expanding-to-meter"  // Circle expanding to fill screen
  | "meter" 
  | "meter-fading-out"    // Meter fading out before contraction
  | "contracting-to-intro" // Circle shrinking back to begin
  | "bodyscan-intro"  // New: trauma-informed framing before body scan
  | "bodyscan" 
  | "breathing"       // Full-screen breathing exercise
  | "breathing-settling" // Orb is shrinking to corner
  | "hub-active";
