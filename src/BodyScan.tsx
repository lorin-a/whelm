import React, { useState, useRef } from "react";
import "./BodyScan.css";
import OverwhelmOMeter, { OverwhelmIntensity } from "./OverwhelmOMeter";

// Option B body shape path
const BODY_PATH = `
  M 50 10
  C 60 10, 66 18, 66 28
  C 66 36, 60 42, 54 44
  
  C 62 46, 74 44, 86 38
  C 94 34, 98 38, 96 46
  C 94 54, 86 56, 76 54
  C 66 52, 58 50, 54 48
  
  C 60 58, 68 78, 74 100
  C 80 122, 82 148, 78 172
  C 74 190, 66 194, 58 190
  C 52 186, 52 176, 52 162
  C 52 148, 51 134, 50 122
  
  C 49 134, 48 148, 48 162
  C 48 176, 48 186, 42 190
  C 34 194, 26 190, 22 172
  C 18 148, 20 122, 26 100
  C 32 78, 40 58, 46 48
  
  C 42 50, 34 52, 24 54
  C 14 56, 6 54, 4 46
  C 2 38, 6 34, 14 38
  C 26 44, 38 46, 46 44
  
  C 40 42, 34 36, 34 28
  C 34 18, 40 10, 50 10
  Z
`;

// Water states with sensation word associations
const waterStates = [
  { id: "frozen", name: "frozen", suggestedWords: ["icy", "numb", "stuck", "cold", "paralyzed", "still", "heavy"] },
  { id: "boiling", name: "boiling", suggestedWords: ["burning", "pressure", "hot", "buzzy", "tight", "pulsing", "intense"] },
  { id: "churning", name: "churning", suggestedWords: ["dizzy", "queasy", "spinning", "unsettled", "knotted", "nauseous", "wobbly"] },
  { id: "rushing", name: "rushing", suggestedWords: ["pounding", "breathless", "floaty", "racing", "shaky", "electric", "overwhelming"] },
  { id: "flowing", name: "flowing", suggestedWords: ["fluid", "releasing", "moving", "warm", "draining", "tender", "open"] },
  { id: "still", name: "still", suggestedWords: ["calm", "spacious", "smooth", "relaxed", "open", "quiet", "light"] },
];

const allSensationWords = [
  "heavy", "light", "tight", "open", "warm", "cold", "buzzy", "numb",
  "prickly", "smooth", "hollow", "full", "shaky", "still", "burning", "frozen",
  "achy", "tender", "pressure", "spacious", "knotted", "fluid", "electric", "dull",
  "queasy", "grounded", "floaty", "dense", "expanding", "shrinking", "pulsing", "calm",
  "raw", "soft", "sharp", "icy", "racing", "slow", "stuck", "releasing"
];

const bodyRegions = [
  { id: "head", label: "head", yRange: [0, 0.18], xRange: [0.25, 0.75] },
  { id: "neck", label: "neck", yRange: [0.18, 0.24], xRange: [0.35, 0.65] },
  { id: "heart", label: "heart space", yRange: [0.24, 0.38], xRange: [0.25, 0.75] },
  { id: "center", label: "center", yRange: [0.38, 0.52], xRange: [0.25, 0.75] },
  { id: "belly", label: "belly", yRange: [0.52, 0.65], xRange: [0.2, 0.8] },
  { id: "lower", label: "lower body", yRange: [0.65, 1.0], xRange: [0.1, 0.9] },
];

const bodyLocations: Record<string, string> = {
  head: "head",
  neck: "neck",
  heart: "heart space",
  center: "center",
  belly: "belly",
  lower: "lower body",
  everywhere: "whole body",
  unsure: "somewhere (I'm not sure)",
};

// Generate tangle path based on lever positions (preserves width, centered in SVG)
const generateSummaryTangleWithPositions = (leftPos: number, rightPos: number): string => {
  const svgWidth = 140;
  const height = 50;
  const centerY = height / 2;
  const svgCenterX = svgWidth / 2;
  
  // Calculate the original width as a proportion, then center it
  const originalWidthPercent = (rightPos - leftPos) / 100;
  const displayWidth = originalWidthPercent * 110; // Scale to SVG space (leaving margins)
  const startX = svgCenterX - (displayWidth / 2);
  const endX = svgCenterX + (displayWidth / 2);
  const w = displayWidth;
  
  // Calculate normalized distance to determine complexity (same logic as OverwhelmOMeter)
  const normalizedDistance = Math.max(0, Math.min(1, (rightPos - leftPos) / 100));

  if (normalizedDistance > 0.9) {
    return `M ${startX} ${centerY} Q ${startX + w * 0.5} ${centerY - 3}, ${endX} ${centerY}`;
  }
  if (normalizedDistance > 0.7) {
    return `M ${startX} ${centerY} C ${startX + w * 0.2} ${centerY - 10}, ${startX + w * 0.35} ${centerY + 12}, ${startX + w * 0.5} ${centerY} C ${startX + w * 0.65} ${centerY - 12}, ${startX + w * 0.8} ${centerY + 10}, ${endX} ${centerY}`;
  }
  if (normalizedDistance > 0.5) {
    return `M ${startX} ${centerY} C ${startX + w * 0.15} ${centerY - 15}, ${startX + w * 0.25} ${centerY + 18}, ${startX + w * 0.35} ${centerY - 5} C ${startX + w * 0.45} ${centerY - 20}, ${startX + w * 0.55} ${centerY + 20}, ${startX + w * 0.65} ${centerY + 5} C ${startX + w * 0.75} ${centerY - 18}, ${startX + w * 0.85} ${centerY + 15}, ${endX} ${centerY}`;
  }
  if (normalizedDistance > 0.3) {
    return `M ${startX} ${centerY} C ${startX + w * 0.1} ${centerY - 18}, ${startX + w * 0.15} ${centerY + 20}, ${startX + w * 0.22} ${centerY - 8} C ${startX + w * 0.28} ${centerY - 22}, ${startX + w * 0.35} ${centerY + 22}, ${startX + w * 0.42} ${centerY} C ${startX + w * 0.48} ${centerY - 20}, ${startX + w * 0.55} ${centerY + 20}, ${startX + w * 0.62} ${centerY + 6} C ${startX + w * 0.7} ${centerY - 22}, ${startX + w * 0.8} ${centerY + 20}, ${endX} ${centerY}`;
  }
  if (normalizedDistance > 0.15) {
    const loop = 12;
    return `M ${startX} ${centerY} C ${startX + w * 0.08} ${centerY - loop * 2}, ${startX + w * 0.05} ${centerY + loop * 2}, ${startX + w * 0.15} ${centerY - loop} C ${startX + w * 0.2} ${centerY - loop * 2.2}, ${startX + w * 0.18} ${centerY + loop * 2}, ${startX + w * 0.28} ${centerY + loop * 0.5} C ${startX + w * 0.35} ${centerY - loop * 2}, ${startX + w * 0.4} ${centerY + loop * 2.2}, ${startX + w * 0.5} ${centerY} C ${startX + w * 0.58} ${centerY - loop * 2.2}, ${startX + w * 0.62} ${centerY + loop * 2}, ${startX + w * 0.7} ${centerY - loop * 0.5} C ${startX + w * 0.78} ${centerY - loop * 2}, ${startX + w * 0.82} ${centerY + loop * 2.2}, ${endX} ${centerY}`;
  }
  // Most tangled
  const c = 14;
  return `M ${startX} ${centerY} C ${startX + w * 0.05} ${centerY - c * 2}, ${startX + w * 0.02} ${centerY + c * 1.5}, ${startX + w * 0.1} ${centerY - c} C ${startX + w * 0.12} ${centerY - c * 2.2}, ${startX + w * 0.08} ${centerY + c * 2}, ${startX + w * 0.18} ${centerY + c * 0.8} C ${startX + w * 0.22} ${centerY - c * 2}, ${startX + w * 0.2} ${centerY + c * 2.2}, ${startX + w * 0.3} ${centerY - c * 0.5} C ${startX + w * 0.35} ${centerY - c * 2.2}, ${startX + w * 0.38} ${centerY + c * 2}, ${startX + w * 0.45} ${centerY + c} C ${startX + w * 0.5} ${centerY - c * 2}, ${startX + w * 0.52} ${centerY + c * 2.2}, ${startX + w * 0.58} ${centerY} C ${startX + w * 0.62} ${centerY - c * 2.2}, ${startX + w * 0.65} ${centerY + c * 2}, ${startX + w * 0.72} ${centerY - c * 0.8} C ${startX + w * 0.78} ${centerY - c * 2}, ${startX + w * 0.82} ${centerY + c * 2.2}, ${endX} ${centerY}`;
};

// Helper to get centered lever positions for summary display
const getCenteredLeverX = (leftPos: number, rightPos: number, isLeft: boolean): number => {
  const svgWidth = 140;
  const svgCenterX = svgWidth / 2;
  const originalWidthPercent = (rightPos - leftPos) / 100;
  const displayWidth = originalWidthPercent * 110;
  return isLeft ? svgCenterX - (displayWidth / 2) : svgCenterX + (displayWidth / 2);
};

interface WaterTextureProps {
  type: string;
  size?: number;
}

const WaterTexture: React.FC<WaterTextureProps> = ({ type, size = 90 }) => {
  const center = size / 2;
  
  switch (type) {
    case "frozen":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <line x1={center} y1="18" x2={center} y2={size - 18} stroke="#2d2438" strokeWidth="1.5" opacity="0.5"/>
          <line x1="18" y1={center} x2={size - 18} y2={center} stroke="#2d2438" strokeWidth="1.5" opacity="0.5"/>
          <line x1="25" y1="25" x2={size - 25} y2={size - 25} stroke="#2d2438" strokeWidth="1" opacity="0.35"/>
          <line x1={size - 25} y1="25" x2="25" y2={size - 25} stroke="#2d2438" strokeWidth="1" opacity="0.35"/>
          <circle cx={center} cy={center} r="6" fill="none" stroke="#2d2438" strokeWidth="1.5" opacity="0.4"/>
        </svg>
      );
    case "boiling":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center - 10} cy={center + 16} r="8" fill="none" stroke="#2d2438" strokeWidth="1.5"/>
          <circle cx={center + 12} cy={center + 6} r="6" fill="none" stroke="#2d2438" strokeWidth="1.5"/>
          <circle cx={center - 2} cy={center - 6} r="10" fill="none" stroke="#2d2438" strokeWidth="1.5"/>
          <circle cx={center + 8} cy={center - 16} r="5" fill="none" stroke="#2d2438" strokeWidth="1.5"/>
          <circle cx={center - 14} cy={center - 12} r="4" fill="none" stroke="#2d2438" strokeWidth="1.5" opacity="0.7"/>
        </svg>
      );
    case "churning":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <path 
            d={`M ${center} ${center} C ${center + 6} ${center - 8}, ${center + 16} ${center - 4}, ${center + 14} ${center + 6} C ${center + 12} ${center + 16}, ${center - 4} ${center + 20}, ${center - 12} ${center + 12} C ${center - 22} ${center + 4}, ${center - 20} ${center - 14}, ${center - 6} ${center - 20} C ${center + 10} ${center - 26}, ${center + 26} ${center - 12}, ${center + 22} ${center + 8}`}
            fill="none" stroke="#2d2438" strokeWidth="2" strokeLinecap="round"
          />
        </svg>
      );
    case "rushing":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <path d={`M 14 ${center - 16} Q 32 ${center - 26}, 50 ${center - 16} T 76 ${center - 16}`} fill="none" stroke="#2d2438" strokeWidth="1.8" strokeLinecap="round"/>
          <path d={`M 12 ${center} Q 34 ${center - 12}, 54 ${center} T 78 ${center}`} fill="none" stroke="#2d2438" strokeWidth="2.2" strokeLinecap="round"/>
          <path d={`M 14 ${center + 16} Q 36 ${center + 4}, 52 ${center + 16} T 76 ${center + 16}`} fill="none" stroke="#2d2438" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );
    case "flowing":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <path d={`M 12 ${center - 10} C 35 ${center - 18}, 55 ${center - 2}, 78 ${center - 10}`} fill="none" stroke="#2d2438" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <path d={`M 10 ${center} C 32 ${center - 10}, 58 ${center + 10}, 80 ${center}`} fill="none" stroke="#2d2438" strokeWidth="2" strokeLinecap="round"/>
          <path d={`M 12 ${center + 10} C 35 ${center + 2}, 55 ${center + 18}, 78 ${center + 10}`} fill="none" stroke="#2d2438" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      );
    case "still":
      return (
        <svg viewBox={`0 0 ${size} ${size}`}>
          <line x1="22" y1={center} x2="68" y2={center} stroke="#2d2438" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx={center} cy={center} r="3" fill="#2d2438" opacity="0.25"/>
        </svg>
      );
    default:
      return null;
  }
};

const getBodyWaterTexture = (type: string, width: number, yOffset: number, index: number): string => {
  switch (type) {
    case "frozen":
      return `M ${width * 0.15} ${yOffset} L ${width * 0.25} ${yOffset} M ${width * 0.32} ${yOffset} L ${width * 0.42} ${yOffset} M ${width * 0.49} ${yOffset} L ${width * 0.59} ${yOffset} M ${width * 0.66} ${yOffset} L ${width * 0.76} ${yOffset} M ${width * 0.83} ${yOffset} L ${width * 0.9} ${yOffset}`;
    case "boiling":
      const bubbleY = yOffset + (index % 2 === 0 ? -3 : 3);
      return `M ${width * 0.2} ${bubbleY} Q ${width * 0.25} ${bubbleY - 5}, ${width * 0.3} ${bubbleY + 2} Q ${width * 0.38} ${bubbleY - 6}, ${width * 0.45} ${bubbleY + 3} Q ${width * 0.52} ${bubbleY - 4}, ${width * 0.6} ${bubbleY + 1} Q ${width * 0.68} ${bubbleY - 5}, ${width * 0.75} ${bubbleY + 2} Q ${width * 0.82} ${bubbleY - 3}, ${width * 0.88} ${bubbleY}`;
    case "churning":
      const swirl = index % 2 === 0 ? 1 : -1;
      return `M ${width * 0.15} ${yOffset} Q ${width * 0.25} ${yOffset + swirl * 8}, ${width * 0.35} ${yOffset - swirl * 4} Q ${width * 0.45} ${yOffset + swirl * 10}, ${width * 0.55} ${yOffset} Q ${width * 0.65} ${yOffset - swirl * 8}, ${width * 0.75} ${yOffset + swirl * 5} Q ${width * 0.85} ${yOffset - swirl * 6}, ${width * 0.9} ${yOffset}`;
    case "rushing":
      return `M ${width * 0.1} ${yOffset} C ${width * 0.18} ${yOffset - 6}, ${width * 0.26} ${yOffset + 6}, ${width * 0.34} ${yOffset - 4} C ${width * 0.42} ${yOffset + 5}, ${width * 0.5} ${yOffset - 5}, ${width * 0.58} ${yOffset + 4} C ${width * 0.66} ${yOffset - 6}, ${width * 0.74} ${yOffset + 5}, ${width * 0.82} ${yOffset - 3} L ${width * 0.9} ${yOffset}`;
    case "flowing":
      return `M ${width * 0.1} ${yOffset} C ${width * 0.22} ${yOffset - 4}, ${width * 0.34} ${yOffset + 4}, ${width * 0.46} ${yOffset} C ${width * 0.58} ${yOffset - 4}, ${width * 0.7} ${yOffset + 4}, ${width * 0.82} ${yOffset} C ${width * 0.88} ${yOffset - 2}, ${width * 0.92} ${yOffset + 1}, ${width * 0.95} ${yOffset}`;
    case "still":
      return `M ${width * 0.2} ${yOffset} L ${width * 0.8} ${yOffset}`;
    default:
      return `M ${width * 0.15} ${yOffset} L ${width * 0.85} ${yOffset}`;
  }
};

export interface BodyScanResult {
  location: string;
  locationLabel: string;
  water: string | null;
  waterName: string;
  sensations: string[];
  colors: Array<{ id: number; x: number; y: number; color: string }>;
  timestamp: string;
  overwhelmLevel: string | null;
  overwhelmValue: number | null;
}

// Re-export for convenience
export type { OverwhelmIntensity };

interface BodyScanProps {
  onComplete: (result: BodyScanResult) => void;
  onBack?: () => void;
  overwhelmIntensity?: OverwhelmIntensity | null;
  onEditSection?: (section: 'meter' | 'body' | 'water' | 'sensation' | 'color') => void;
  initialStep?: Step;
}

type Step = 'body' | 'water' | 'sensation' | 'color' | 'summary';

const BodyScan: React.FC<BodyScanProps> = ({ onComplete, onBack, overwhelmIntensity, onEditSection, initialStep = 'body' }) => {
  const [step, setStep] = useState<Step>(initialStep);
  const [isEditing, setIsEditing] = useState(initialStep === 'summary'); // Track if editing from summary
  const [editingMeter, setEditingMeter] = useState(false); // Show meter inline for editing
  const [localOverwhelmIntensity, setLocalOverwhelmIntensity] = useState(overwhelmIntensity);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number; location: string } | null>(null);
  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [customWordInput, setCustomWordInput] = useState("");
  const [showMoreWords, setShowMoreWords] = useState(false);
  const [colorNodes, setColorNodes] = useState([
    { id: 1, x: 50, y: 50, color: "#c9b8d9", scale: 1 },
  ]);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [resizingNode, setResizingNode] = useState<number | null>(null);
  const [resizeStartDistance, setResizeStartDistance] = useState<number>(0);
  const [resizeStartScale, setResizeStartScale] = useState<number>(1);
  const meshRef = useRef<HTMLDivElement>(null);

  const currentWater = waterStates.find(w => w.id === selectedWater);
  const suggestedWords = currentWater?.suggestedWords || [];
  
  // Words selected from the expanded list that aren't in suggested words
  const additionalSelectedWords = selectedSensations.filter(
    word => !suggestedWords.includes(word) && !allSensationWords.includes(word)
  );
  const expandedSelectedWords = selectedSensations.filter(
    word => !suggestedWords.includes(word) && allSensationWords.includes(word)
  );

  // Navigate to next step, or back to summary if editing
  const goToNextStep = (nextStep: Step) => {
    if (isEditing) {
      setStep('summary');
      setIsEditing(false);
    } else {
      setStep(nextStep);
    }
  };

  // Handle clicking a section from summary to edit
  const handleEditFromSummary = (targetStep: Step) => {
    setIsEditing(true);
    setStep(targetStep);
  };

  const getHoveredRegion = (x: number, y: number, width: number, height: number) => {
    const percentX = x / width;
    const percentY = y / height;
    
    for (const region of bodyRegions) {
      if (
        percentY >= region.yRange[0] && percentY <= region.yRange[1] &&
        percentX >= region.xRange[0] && percentX <= region.xRange[1]
      ) {
        return region;
      }
    }
    return null;
  };

  const handleBodyMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowPos({ x, y });
    
    const region = getHoveredRegion(x, y, rect.width, rect.height);
    setHoveredRegion(region?.label || null);
  };

  const handleBodyMouseLeave = () => {
    setHoveredRegion(null);
  };

  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const region = getHoveredRegion(x, y, rect.width, rect.height);
    const location = region?.id || "heart";

    setSelectedPoint({ x, y, location });
    setTimeout(() => setStep('water'), 500);
  };

  const handleAltOption = (option: string) => {
    // Center the glow orb when "everywhere" or "unsure" is selected
    setSelectedPoint({ x: 50, y: 50, location: option });
    setTimeout(() => setStep('water'), 400);
  };

  const handleWaterSelect = (id: string) => {
    setSelectedWater(id);
    setSelectedSensations([]);
    setShowMoreWords(false);
  };

  const toggleSensation = (word: string) => {
    setSelectedSensations(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const addCustomWord = () => {
    const word = customWordInput.trim().toLowerCase();
    if (word && !selectedSensations.includes(word)) {
      setSelectedSensations(prev => [...prev, word]);
      setCustomWordInput("");
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomWord();
    }
  };

  // Handle dragging the center of node (move)
  const handleNodeMouseDown = (nodeId: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingNode(nodeId);
  };

  // Handle dragging the resize ring (resize)
  const handleResizeMouseDown = (nodeId: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!meshRef.current) return;
    
    const node = colorNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = meshRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate node center in pixels
    const nodeCenterX = rect.left + (node.x / 100) * rect.width;
    const nodeCenterY = rect.top + (node.y / 100) * rect.height;
    
    // Calculate initial distance from center
    const distance = Math.sqrt(
      Math.pow(clientX - nodeCenterX, 2) + 
      Math.pow(clientY - nodeCenterY, 2)
    );
    
    setResizingNode(nodeId);
    setResizeStartDistance(distance);
    setResizeStartScale(node.scale);
  };

  const handleMeshMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!meshRef.current) return;
    
    const rect = meshRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Handle node movement
    if (draggingNode) {
      const x = Math.max(15, Math.min(85, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(15, Math.min(85, ((clientY - rect.top) / rect.height) * 100));
      
      setColorNodes(nodes => nodes.map(n => 
        n.id === draggingNode ? { ...n, x, y } : n
      ));
    }
    
    // Handle node resizing
    if (resizingNode) {
      const node = colorNodes.find(n => n.id === resizingNode);
      if (!node) return;
      
      // Calculate node center in pixels
      const nodeCenterX = rect.left + (node.x / 100) * rect.width;
      const nodeCenterY = rect.top + (node.y / 100) * rect.height;
      
      // Calculate current distance from center
      const currentDistance = Math.sqrt(
        Math.pow(clientX - nodeCenterX, 2) + 
        Math.pow(clientY - nodeCenterY, 2)
      );
      
      // Scale based on distance change (drag out = bigger, drag in = smaller)
      const distanceRatio = currentDistance / resizeStartDistance;
      const newScale = Math.max(0.5, Math.min(2.5, resizeStartScale * distanceRatio));
      
      setColorNodes(nodes => nodes.map(n => 
        n.id === resizingNode ? { ...n, scale: newScale } : n
      ));
    }
  };

  const handleMeshMouseUp = () => {
    setDraggingNode(null);
    setResizingNode(null);
  };

  const handleNodeColorChange = (nodeId: number, color: string) => {
    setColorNodes(nodes => nodes.map(n => 
      n.id === nodeId ? { ...n, color } : n
    ));
  };

  const removeColorNode = (nodeId: number) => {
    if (colorNodes.length > 1) {
      setColorNodes(nodes => nodes.filter(n => n.id !== nodeId));
    }
  };

  const addColorNode = () => {
    if (colorNodes.length < 4) {
      const newId = Math.max(...colorNodes.map(n => n.id)) + 1;
      const colors = ["#a8c4d9", "#d9c4b8", "#b8d9c4", "#d9b8c4"];
      setColorNodes([...colorNodes, { 
        id: newId, 
        x: 30 + Math.random() * 40, 
        y: 30 + Math.random() * 40, 
        color: colors[colorNodes.length - 1] || "#c9c9c9",
        scale: 1
      }]);
    }
  };

  const goBack = () => {
    if (step === 'body' && onBack) {
      onBack();
    } else if (step === 'water') setStep('body');
    else if (step === 'sensation') setStep('water');
    else if (step === 'color') setStep('sensation');
    else if (step === 'summary') setStep('color');
  };

  const generateMeshGradient = () => {
    if (colorNodes.length === 1) {
      return colorNodes[0].color;
    }
    // Scale affects gradient spread: larger scale = more dominant color
    const gradients = colorNodes.map(node => {
      const spread = 50 + (node.scale - 1) * 30; // 50%, 65%, or 80% spread
      return `radial-gradient(circle at ${node.x}% ${node.y}%, ${node.color} 0%, transparent ${spread}%)`;
    }).join(', ');
    return `${gradients}, #e8e4e0`;
  };

  const getSummaryPointPosition = () => {
    if (!selectedPoint) return { left: '50%', top: '35%' };
    const location = selectedPoint.location;
    const positions: Record<string, { left: string; top: string }> = {
      head: { left: '50%', top: '10%' },
      neck: { left: '50%', top: '20%' },
      heart: { left: '50%', top: '32%' },
      center: { left: '50%', top: '45%' },
      belly: { left: '50%', top: '58%' },
      lower: { left: '50%', top: '78%' },
    };
    return positions[location] || { left: '50%', top: '35%' };
  };

  // All selected sensations (custom words are now added directly to selectedSensations)
  const allSelectedSensations = selectedSensations;

  const handleComplete = () => {
    const intensity = localOverwhelmIntensity || overwhelmIntensity;
    onComplete({
      location: selectedPoint?.location || 'heart',
      locationLabel: selectedPoint ? bodyLocations[selectedPoint.location] : 'body',
      water: selectedWater,
      waterName: currentWater?.name || 'moving',
      sensations: allSelectedSensations,
      colors: colorNodes,
      timestamp: new Date().toISOString(),
      overwhelmLevel: intensity?.level || null,
      overwhelmValue: intensity?.normalizedValue || null,
    });
  };

  // Handle inline meter editing
  const handleMeterEdit = () => {
    setEditingMeter(true);
  };

  const handleMeterEditComplete = (intensity: OverwhelmIntensity) => {
    setLocalOverwhelmIntensity(intensity);
    setEditingMeter(false);
  };

  const handleMeterEditBack = () => {
    setEditingMeter(false);
  };

  // Get current intensity (local edits take precedence)
  const currentIntensity = localOverwhelmIntensity || overwhelmIntensity;

  return (
    <div 
      className="body-scan-container"
      onMouseMove={handleMeshMouseMove}
      onMouseUp={handleMeshMouseUp}
      onMouseLeave={handleMeshMouseUp}
      onTouchMove={handleMeshMouseMove}
      onTouchEnd={handleMeshMouseUp}
    >
      {/* Inline meter editing */}
      {editingMeter && (
        <OverwhelmOMeter
          onComplete={handleMeterEditComplete}
          onBack={handleMeterEditBack}
          initialValues={currentIntensity ? { leftPos: currentIntensity.leftPos, rightPos: currentIntensity.rightPos } : null}
        />
      )}

      {/* Regular body scan flow */}
      {!editingMeter && (
        <>
          {(step !== 'body' || onBack) && (
            <button className="body-scan-back-btn" onClick={goBack}>← back</button>
          )}

      {/* Step 1: Body Selection */}
      {step === 'body' && (
        <>
          <p className="body-scan-prompt">Where do you feel it most?</p>
          
          <div 
            className="body-scan-body-container"
            onMouseMove={handleBodyMouseMove}
            onMouseLeave={handleBodyMouseLeave}
            onClick={handleBodyClick}
          >
            <svg className="body-scan-silhouette" viewBox="0 0 100 200">
              <defs>
                <linearGradient id="bodyScanGradient" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#d4cfe0" />
                  <stop offset="50%" stopColor="#c9c4d6" />
                  <stop offset="100%" stopColor="#beb8cc" />
                </linearGradient>
              </defs>
              <path className="body-scan-shape" d={BODY_PATH} fill="url(#bodyScanGradient)" />
            </svg>
            
            <div 
              className="body-scan-glow-orb" 
              style={{ left: glowPos.x, top: glowPos.y }}
            />
            
            {hoveredRegion && (
              <div 
                className="body-scan-hover-label"
                style={{ left: glowPos.x, top: glowPos.y }}
              >
                {hoveredRegion}
              </div>
            )}
            
            {selectedPoint && (
              <div 
                className="body-scan-selected-point"
                style={{ left: selectedPoint.x, top: selectedPoint.y }}
              />
            )}
          </div>

          <div className="body-scan-alt-options">
            <button className="body-scan-alt-option" onClick={() => handleAltOption('everywhere')}>
              it's everywhere
            </button>
            <button className="body-scan-alt-option" onClick={() => handleAltOption('unsure')}>
              I'm not sure
            </button>
          </div>
        </>
      )}

      {/* Step 2: Water Texture */}
      {step === 'water' && (
        <>
          <p className="body-scan-prompt">What best represents your internal waters?</p>
          
          <div className="body-scan-water-grid" role="group" aria-label="Water texture options">
            {waterStates.map((water) => (
              <div 
                key={water.id}
                className={`body-scan-water-option ${selectedWater === water.id ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={selectedWater === water.id}
                onClick={() => handleWaterSelect(water.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleWaterSelect(water.id);
                  }
                }}
              >
                <div className="body-scan-water-circle">
                  <WaterTexture type={water.id} />
                </div>
                <span className="body-scan-water-label">{water.name}</span>
              </div>
            ))}
          </div>

          <div className="body-scan-button-stack">
            {selectedWater && (
              <button className="body-scan-continue-btn" onClick={() => goToNextStep('sensation')}>
                continue
              </button>
            )}
            <button className="body-scan-skip-btn" onClick={() => goToNextStep('sensation')}>
              skip
            </button>
          </div>
        </>
      )}

      {/* Step 3: Sensation Words */}
      {step === 'sensation' && (
        <div className="body-scan-sensation-container">
          <p className="body-scan-prompt">How would you describe the sensation?</p>
          <p className="body-scan-sub-prompt">tap any that feel right</p>
          
          {!showMoreWords ? (
            <>
              {/* Main suggested words */}
              <div className="body-scan-word-cloud">
                {suggestedWords.map((word) => (
                  <button
                    key={word}
                    className={`body-scan-word-chip ${selectedSensations.includes(word) ? 'selected' : ''}`}
                    onClick={() => toggleSensation(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              
              {/* Words selected from expanded list or custom - show when collapsed */}
              {(expandedSelectedWords.length > 0 || additionalSelectedWords.length > 0) && (
                <div className="body-scan-selected-extras">
                  <span className="body-scan-selected-extras-label">also selected:</span>
                  <div className="body-scan-word-cloud">
                    {[...expandedSelectedWords, ...additionalSelectedWords].map((word) => (
                      <button
                        key={word}
                        className="body-scan-word-chip selected"
                        onClick={() => toggleSensation(word)}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                className="body-scan-more-words-btn" 
                onClick={() => setShowMoreWords(true)}
              >
                + more words
              </button>
            </>
          ) : (
            <>
              <div className="body-scan-word-scroll-container">
                <button 
                  className="body-scan-scroll-btn body-scan-scroll-btn-left"
                  onClick={() => {
                    const track = document.querySelector('.body-scan-word-scroll-track');
                    if (track) track.scrollLeft -= 150;
                  }}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <div className="body-scan-word-scroll-fade-left" />
                <div className="body-scan-word-scroll-fade-right" />
                <div className="body-scan-word-scroll-track">
                  {allSensationWords.map((word) => (
                    <button
                      key={word}
                      className={`body-scan-word-chip ${selectedSensations.includes(word) ? 'selected' : ''}`}
                      onClick={() => toggleSensation(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <button 
                  className="body-scan-scroll-btn body-scan-scroll-btn-right"
                  onClick={() => {
                    const track = document.querySelector('.body-scan-word-scroll-track');
                    if (track) track.scrollLeft += 150;
                  }}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
              <span className="body-scan-scroll-hint">use arrows or swipe to see more</span>
              <button 
                className="body-scan-more-words-btn" 
                onClick={() => setShowMoreWords(false)}
              >
                − show fewer
              </button>
            </>
          )}

          {/* Custom word input with enter hint */}
          <div className="body-scan-custom-input-container">
            <label className="body-scan-custom-input-label">or add your own</label>
            <div className="body-scan-custom-input-wrapper">
              <input
                type="text"
                className="body-scan-custom-input"
                placeholder="type a word..."
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                enterKeyHint="done"
              />
              {customWordInput.trim() && (
                <span className="body-scan-custom-enter-hint" aria-hidden="true">
                  <kbd>enter</kbd>
                </span>
              )}
            </div>
          </div>

          <div className="body-scan-button-stack">
            <button className="body-scan-continue-btn" onClick={() => goToNextStep('color')}>
              continue
            </button>
            <button className="body-scan-skip-btn" onClick={() => goToNextStep('color')}>
              skip
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Color Picker */}
      {step === 'color' && (
        <div className="body-scan-color-container">
          <p className="body-scan-prompt">Give it color?</p>
          <p className="body-scan-sub-prompt">drag center to blend, drag edge to resize</p>
          
          <div 
            className="body-scan-mesh-canvas"
            ref={meshRef}
            style={{ background: generateMeshGradient() }}
          >
            {colorNodes.map((node) => (
              <div
                key={node.id}
                className={`body-scan-mesh-node-container`}
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                {/* Resize ring - drag to resize */}
                <div 
                  className={`body-scan-mesh-node-resize-ring ${resizingNode === node.id ? 'resizing' : ''}`}
                  style={{
                    width: `${38 * node.scale + 16}px`,
                    height: `${38 * node.scale + 16}px`,
                  }}
                  onMouseDown={handleResizeMouseDown(node.id)}
                  onTouchStart={handleResizeMouseDown(node.id)}
                />
                {/* Main node - drag to move */}
                <div
                  className={`body-scan-mesh-node ${node.scale > 1 ? 'scaled' : ''} ${draggingNode === node.id ? 'dragging' : ''}`}
                  style={{ 
                    backgroundColor: node.color,
                    width: `${38 * node.scale}px`,
                    height: `${38 * node.scale}px`,
                  }}
                  onMouseDown={handleNodeMouseDown(node.id)}
                  onTouchStart={handleNodeMouseDown(node.id)}
                >
                  {colorNodes.length > 1 && (
                    <div 
                      className="body-scan-mesh-node-remove"
                      onClick={(e) => { e.stopPropagation(); removeColorNode(node.id); }}
                    >
                      ×
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="body-scan-color-controls">
            {colorNodes.map((node) => (
              <div key={node.id} className="body-scan-color-node-item">
                <div className="body-scan-color-input-wrapper">
                  <input
                    type="color"
                    className="body-scan-color-input"
                    value={node.color}
                    onChange={(e) => handleNodeColorChange(node.id, e.target.value)}
                  />
                  <span className="body-scan-color-edit-hint">✎</span>
                </div>
                {colorNodes.length > 1 && (
                  <button 
                    className="body-scan-remove-color-btn"
                    onClick={() => removeColorNode(node.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {colorNodes.length < 4 && (
              <button className="body-scan-add-color-btn" onClick={addColorNode}>
                +
              </button>
            )}
          </div>
          <span className="body-scan-color-hint">tap swatches to change color</span>

          <div className="body-scan-button-stack">
            <button className="body-scan-continue-btn" onClick={() => goToNextStep('summary')}>
              continue
            </button>
            <button className="body-scan-skip-btn" onClick={() => goToNextStep('summary')}>
              skip colors
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Summary */}
      {step === 'summary' && (
        <div className="body-scan-summary">
          {/* Timestamp */}
          <p className="body-scan-summary-timestamp">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
          <p className="body-scan-summary-edit-instruction">tap any section to edit</p>

          {/* 1. Overwhelm intensity - clickable */}
          {currentIntensity && (
            <div 
              className="body-scan-summary-meter-section body-scan-summary-clickable"
              role="button"
              tabIndex={0}
              aria-label={`Edit overwhelm level: ${currentIntensity.level}`}
              onClick={handleMeterEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMeterEdit();
                }
              }}
            >
              <svg 
                className="body-scan-summary-tangle" 
                viewBox="0 0 140 50" 
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                {/* Tangle path FIRST (behind levers) - centered with original width */}
                <path 
                  d={generateSummaryTangleWithPositions(currentIntensity.leftPos, currentIntensity.rightPos)} 
                  fill="none" 
                  stroke="#2d2438" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                {/* Left lever - centered position */}
                <rect 
                  x={getCenteredLeverX(currentIntensity.leftPos, currentIntensity.rightPos, true) - 4} 
                  y="10" 
                  width="8" 
                  height="30" 
                  rx="4" 
                  fill="#e8e4e0" 
                  stroke="#c0bab5" 
                  strokeWidth="1"
                />
                {/* Right lever - centered position */}
                <rect 
                  x={getCenteredLeverX(currentIntensity.leftPos, currentIntensity.rightPos, false) - 4} 
                  y="10" 
                  width="8" 
                  height="30" 
                  rx="4" 
                  fill="#e8e4e0" 
                  stroke="#c0bab5" 
                  strokeWidth="1"
                />
              </svg>
              <p className="body-scan-summary-intensity">
                {currentIntensity.level}
              </p>
            </div>
          )}

          {/* 2. Body silhouette - clickable */}
          <div 
            className={`body-scan-summary-body-container body-scan-summary-clickable ${selectedPoint?.location === 'everywhere' ? 'everywhere-selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Edit body location: ${selectedPoint ? bodyLocations[selectedPoint.location] : 'body'}`}
            onClick={() => handleEditFromSummary('body')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEditFromSummary('body');
              }
            }}
          >
            <svg className="body-scan-summary-svg" viewBox="0 0 100 200" aria-hidden="true">
              <defs>
                <clipPath id="summaryBodyClip">
                  <path d={BODY_PATH} />
                </clipPath>
                <linearGradient id="summaryFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  {colorNodes.map((node, i) => (
                    <stop key={node.id} offset={`${(i / Math.max(1, colorNodes.length - 1)) * 100}%`} stopColor={node.color} />
                  ))}
                </linearGradient>
              </defs>
              <path 
                fill={colorNodes.length === 1 ? colorNodes[0].color : "url(#summaryFill)"}
                opacity="0.75"
                d={BODY_PATH}
              />
              <g clipPath="url(#summaryBodyClip)">
                {[20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185].map((y, i) => (
                  <path 
                    key={y}
                    d={getBodyWaterTexture(selectedWater || 'flowing', 100, y, i)} 
                    fill="none" 
                    stroke="rgba(45,36,56,0.25)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                ))}
              </g>
              {/* Show "everywhere" indicator - multiple small points */}
              {selectedPoint?.location === 'everywhere' && (
                <g className="everywhere-indicator">
                  <circle cx="50" cy="35" r="4" fill="#2d2438" opacity="0.5" />
                  <circle cx="50" cy="70" r="4" fill="#2d2438" opacity="0.5" />
                  <circle cx="35" cy="100" r="4" fill="#2d2438" opacity="0.5" />
                  <circle cx="65" cy="100" r="4" fill="#2d2438" opacity="0.5" />
                  <circle cx="50" cy="140" r="4" fill="#2d2438" opacity="0.5" />
                </g>
              )}
              {/* Show "unsure" indicator - question mark */}
              {selectedPoint?.location === 'unsure' && (
                <text x="50" y="110" textAnchor="middle" fontSize="32" fill="#2d2438" opacity="0.4">?</text>
              )}
            </svg>
            
            {selectedPoint && selectedPoint.location !== 'everywhere' && selectedPoint.location !== 'unsure' && (
              <div 
                className="body-scan-summary-point"
                style={getSummaryPointPosition()}
              />
            )}
          </div>
          
          {/* 3. Water + location - clickable */}
          <p 
            className="body-scan-summary-text body-scan-summary-clickable"
            role="button"
            tabIndex={0}
            aria-label={`Edit water texture: ${currentWater?.name || 'moving'} in ${selectedPoint ? bodyLocations[selectedPoint.location] : 'body'}`}
            onClick={() => handleEditFromSummary('water')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEditFromSummary('water');
              }
            }}
          >
            <span className="body-scan-summary-water">{currentWater?.name || 'moving'}</span> in your{' '}
            <span className="body-scan-summary-location">
              {selectedPoint ? bodyLocations[selectedPoint.location] : 'body'}
            </span>
          </p>
          
          {/* 4. Sensations - clickable */}
          {allSelectedSensations.length > 0 && (
            <div 
              className="body-scan-summary-sensations body-scan-summary-clickable"
              role="button"
              tabIndex={0}
              aria-label={`Edit sensations: ${allSelectedSensations.join(', ')}`}
              onClick={() => handleEditFromSummary('sensation')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEditFromSummary('sensation');
                }
              }}
            >
              {allSelectedSensations.map(word => (
                <span key={word} className="body-scan-summary-sensation">{word}</span>
              ))}
            </div>
          )}

          {/* 5. Color swatches - clickable */}
          {colorNodes.length > 0 && (
            <div 
              className="body-scan-summary-colors body-scan-summary-clickable"
              role="button"
              tabIndex={0}
              aria-label={`Edit colors: ${colorNodes.length} color${colorNodes.length > 1 ? 's' : ''} selected`}
              onClick={() => handleEditFromSummary('color')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEditFromSummary('color');
                }
              }}
            >
              {colorNodes.map(node => (
                <div 
                  key={node.id} 
                  className="body-scan-summary-color-swatch"
                  style={{ 
                    backgroundColor: node.color,
                    transform: `scale(${0.8 + (node.scale - 1) * 0.3})`, // 0.8, 0.95, 1.1
                  }}
                />
              ))}
            </div>
          )}

          <button className="body-scan-continue-btn" onClick={handleComplete}>
            continue
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default BodyScan;
