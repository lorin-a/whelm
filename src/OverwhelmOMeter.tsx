import React, { useState, useRef } from "react";
import { colors, easings } from "./tokens";

export interface OverwhelmIntensity {
  level: string;
  normalizedValue: number;
  leftPos: number;
  rightPos: number;
}

interface OverwhelmOMeterProps {
  onComplete: (intensity: OverwhelmIntensity) => void;
  onBack: () => void;
  initialValues?: { leftPos: number; rightPos: number } | null;
  isFadingOut?: boolean;
}

export default function OverwhelmOMeter({ onComplete, onBack, initialValues, isFadingOut = false }: OverwhelmOMeterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPos, setLeftPos] = useState(initialValues?.leftPos ?? 30);
  const [rightPos, setRightPos] = useState(initialValues?.rightPos ?? 70);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const [hasInteracted, setHasInteracted] = useState(!!initialValues);
  const [hasCompletedFirstDrag, setHasCompletedFirstDrag] = useState(!!initialValues);

  const distance = rightPos - leftPos;
  const minDistance = 15;
  const maxDistance = 85;
  const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));

  const getStateLabel = () => {
    if (normalizedDistance < 0.15) return "extremely overwhelmed";
    if (normalizedDistance < 0.35) return "very overwhelmed";
    if (normalizedDistance < 0.55) return "overwhelmed";
    if (normalizedDistance < 0.75) return "somewhat overwhelmed";
    if (normalizedDistance < 0.92) return "slightly tangled";
    return "whelmed";
  };

  const handleMouseDown = (lever: 'left' | 'right') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(lever);
    setHasInteracted(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    
    if (dragging === 'left') {
      const newLeft = Math.max(5, Math.min(rightPos - minDistance, x));
      setLeftPos(newLeft);
    } else {
      const newRight = Math.min(95, Math.max(leftPos + minDistance, x));
      setRightPos(newRight);
    }
  };

  const handleMouseUp = () => {
    // Mark first drag complete when user releases after interacting
    if (dragging && hasInteracted) {
      setHasCompletedFirstDrag(true);
    }
    setDragging(null);
  };

  const handleKeyDown = (lever: 'left' | 'right') => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (lever === 'left') {
        setLeftPos(Math.max(5, leftPos - step));
      } else {
        setRightPos(Math.max(leftPos + minDistance, rightPos - step));
      }
      setHasInteracted(true);
      setHasCompletedFirstDrag(true); // Keyboard counts as completed interaction
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (lever === 'left') {
        setLeftPos(Math.min(rightPos - minDistance, leftPos + step));
      } else {
        setRightPos(Math.min(95, rightPos + step));
      }
      setHasInteracted(true);
      setHasCompletedFirstDrag(true); // Keyboard counts as completed interaction
    }
  };

  const handleComplete = () => {
    onComplete({
      level: getStateLabel(),
      normalizedValue: normalizedDistance,
      leftPos,
      rightPos,
    });
  };

  const generateTanglePath = () => {
    const svgWidth = 500;
    const svgHeight = 200;
    const centerY = svgHeight / 2;
    // Line connects directly to lever centers (no offset needed)
    const startX = (leftPos / 100) * svgWidth;
    const endX = (rightPos / 100) * svgWidth;
    const width = endX - startX;

    if (normalizedDistance > 0.9) {
      return `M ${startX} ${centerY} Q ${startX + width * 0.5} ${centerY - 5}, ${endX} ${centerY}`;
    }
    if (normalizedDistance > 0.7) {
      return `M ${startX} ${centerY} C ${startX + width * 0.2} ${centerY - 20}, ${startX + width * 0.35} ${centerY + 25}, ${startX + width * 0.5} ${centerY} C ${startX + width * 0.65} ${centerY - 25}, ${startX + width * 0.8} ${centerY + 20}, ${endX} ${centerY}`;
    }
    if (normalizedDistance > 0.5) {
      return `M ${startX} ${centerY} C ${startX + width * 0.15} ${centerY - 35}, ${startX + width * 0.25} ${centerY + 40}, ${startX + width * 0.35} ${centerY - 10} C ${startX + width * 0.45} ${centerY - 45}, ${startX + width * 0.55} ${centerY + 45}, ${startX + width * 0.65} ${centerY + 10} C ${startX + width * 0.75} ${centerY - 40}, ${startX + width * 0.85} ${centerY + 35}, ${endX} ${centerY}`;
    }
    if (normalizedDistance > 0.3) {
      return `M ${startX} ${centerY} C ${startX + width * 0.1} ${centerY - 45}, ${startX + width * 0.15} ${centerY + 50}, ${startX + width * 0.22} ${centerY - 20} C ${startX + width * 0.28} ${centerY - 55}, ${startX + width * 0.35} ${centerY + 55}, ${startX + width * 0.42} ${centerY} C ${startX + width * 0.48} ${centerY - 50}, ${startX + width * 0.55} ${centerY + 50}, ${startX + width * 0.62} ${centerY + 15} C ${startX + width * 0.7} ${centerY - 55}, ${startX + width * 0.8} ${centerY + 50}, ${endX} ${centerY}`;
    }
    if (normalizedDistance > 0.15) {
      const loopSize = 25 + (1 - normalizedDistance) * 20;
      return `M ${startX} ${centerY} C ${startX + width * 0.08} ${centerY - loopSize * 2}, ${startX + width * 0.05} ${centerY + loopSize * 2}, ${startX + width * 0.15} ${centerY - loopSize} C ${startX + width * 0.2} ${centerY - loopSize * 2.5}, ${startX + width * 0.18} ${centerY + loopSize * 2}, ${startX + width * 0.28} ${centerY + loopSize * 0.5} C ${startX + width * 0.35} ${centerY - loopSize * 2}, ${startX + width * 0.4} ${centerY + loopSize * 2.5}, ${startX + width * 0.5} ${centerY} C ${startX + width * 0.58} ${centerY - loopSize * 2.5}, ${startX + width * 0.62} ${centerY + loopSize * 2}, ${startX + width * 0.7} ${centerY - loopSize * 0.5} C ${startX + width * 0.78} ${centerY - loopSize * 2}, ${startX + width * 0.82} ${centerY + loopSize * 2.5}, ${endX} ${centerY}`;
    }
    const chaos = 35;
    return `M ${startX} ${centerY} C ${startX + width * 0.05} ${centerY - chaos * 2}, ${startX + width * 0.02} ${centerY + chaos * 1.5}, ${startX + width * 0.1} ${centerY - chaos} C ${startX + width * 0.12} ${centerY - chaos * 2.5}, ${startX + width * 0.08} ${centerY + chaos * 2}, ${startX + width * 0.18} ${centerY + chaos * 0.8} C ${startX + width * 0.22} ${centerY - chaos * 2}, ${startX + width * 0.2} ${centerY + chaos * 2.5}, ${startX + width * 0.3} ${centerY - chaos * 0.5} C ${startX + width * 0.35} ${centerY - chaos * 2.5}, ${startX + width * 0.38} ${centerY + chaos * 2}, ${startX + width * 0.45} ${centerY + chaos} C ${startX + width * 0.5} ${centerY - chaos * 2}, ${startX + width * 0.52} ${centerY + chaos * 2.5}, ${startX + width * 0.58} ${centerY} C ${startX + width * 0.62} ${centerY - chaos * 2.5}, ${startX + width * 0.65} ${centerY + chaos * 2}, ${startX + width * 0.72} ${centerY - chaos * 0.8} C ${startX + width * 0.78} ${centerY - chaos * 2}, ${startX + width * 0.82} ${centerY + chaos * 2.5}, ${startX + width * 0.88} ${centerY + chaos * 0.5} C ${startX + width * 0.92} ${centerY - chaos * 1.5}, ${startX + width * 0.95} ${centerY + chaos}, ${endX} ${centerY}`;
  };

  return (
    <div 
      className={`meter-container-outer ${isFadingOut ? 'fading-out' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Back button */}
      <button className="meter-back-btn" onClick={onBack}>
        ← back
      </button>

      <p className="meter-prompt">How intense is your overwhelm right now?</p>
      
      <div className="meter-container" ref={containerRef}>
        <svg className="meter-svg" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
          {/* Baseline drawn first (behind tangle) */}
          <line 
            className="meter-baseline" 
            x1={(leftPos / 100) * 500} 
            y1="100" 
            x2={(rightPos / 100) * 500} 
            y2="100" 
          />
          {/* Tangle path on top of baseline */}
          <path className="meter-tangle" d={generateTanglePath()} />
        </svg>
        
        {/* Left lever - centered on leftPos% */}
        <div 
          className="meter-lever meter-lever-left"
          style={{ left: `${leftPos}%` }}
          role="slider"
          aria-label="Left boundary - adjust to show how tangled you feel"
          aria-valuenow={Math.round(leftPos)}
          aria-valuemin={5}
          aria-valuemax={Math.round(rightPos - minDistance)}
          tabIndex={0}
          onMouseDown={handleMouseDown('left')}
          onTouchStart={handleMouseDown('left')}
          onKeyDown={handleKeyDown('left')}
        >
          <div className="meter-lever-handle" />
          <div className={`meter-hint meter-hint-left ${hasInteracted ? 'hidden' : ''}`}>
            drag <span className="meter-hint-arrow hint-arrow-left">←</span>
          </div>
        </div>
        
        <div 
          className="meter-lever meter-lever-right"
          style={{ left: `${rightPos}%` }}
          role="slider"
          aria-label="Right boundary - adjust to show how tangled you feel"
          aria-valuenow={Math.round(rightPos)}
          aria-valuemin={Math.round(leftPos + minDistance)}
          aria-valuemax={95}
          tabIndex={0}
          onMouseDown={handleMouseDown('right')}
          onTouchStart={handleMouseDown('right')}
          onKeyDown={handleKeyDown('right')}
        >
          <div className="meter-lever-handle" />
          <div className={`meter-hint meter-hint-right ${hasInteracted ? 'hidden' : ''}`}>
            <span className="meter-hint-arrow hint-arrow-right">→</span> drag
          </div>
        </div>
      </div>

      {/* State label - show while dragging and after */}
      <p 
        className={`meter-state-label ${hasInteracted ? 'visible' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {getStateLabel()}
      </p>

      {/* Supportive text - only show after first drag is complete */}
      <p className={`meter-supportive-text ${hasCompletedFirstDrag ? 'visible' : ''}`}>
        This offers a snapshot of where you're at right now. Let's continue mapping your current state before moving into supportive exercises.
      </p>

      {/* Continue button - only show after first drag is complete */}
      <button 
        className={`meter-continue-button ${hasCompletedFirstDrag ? 'visible' : ''}`}
        onClick={handleComplete}
      >
        continue
      </button>
    </div>
  );
}
