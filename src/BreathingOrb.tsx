/**
 * BreathingOrb - Nervous system support tool
 * 
 * Dark purple theme with light orb.
 * Uses 4:6 breath ratio (4 sec inhale, 6 sec exhale)
 * Fade transitions (iris removed for simplicity)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";

type BreathPhase = "inhale" | "exhale";
type OrbState = "intro" | "breathing" | "check-in";

interface BreathingOrbProps {
  mode: "fullscreen" | "minimized" | "expanding";
  onComplete: () => void;
  onSkip?: () => void;
  isFirstEncounter?: boolean;
  onExpand?: () => void;
  isFromHub?: boolean;
  isClosing?: boolean;
}

// Timing
const INHALE_DURATION = 4000;
const EXHALE_DURATION = 6000;
const BREATHS_PER_ROUND = 3;

// Visual - Large orb with dramatic breathing
const ORB_SIZE_MIN = 80;
const ORB_SIZE_MAX = 240;

export default function BreathingOrb({
  mode,
  onComplete,
  onSkip,
  isFirstEncounter = false,
  onExpand,
  isFromHub = false,
  isClosing = false,
}: BreathingOrbProps) {
  const [orbState, setOrbState] = useState<OrbState>("intro");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpening, setIsOpening] = useState(mode === "expanding" || mode === "fullscreen");
  
  // Animation refs
  const phaseRef = useRef<BreathPhase>("inhale");
  const currentBreathRef = useRef(1);
  const phaseStartRef = useRef(0);
  const isBreathingRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  
  // Completed breaths tracking
  const [completedBreaths, setCompletedBreaths] = useState<number[]>([]);
  
  // Display state
  const [orbSize, setOrbSize] = useState(ORB_SIZE_MIN);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("inhale");
  const [currentBreath, setCurrentBreath] = useState(1);
  const [breathProgress, setBreathProgress] = useState(0);

  // Fade in on mount
  useEffect(() => {
    if (mode === "fullscreen" || mode === "expanding") {
      setIsOpening(true);
      const timer = setTimeout(() => setIsOpening(false), 50);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Breathing animation loop
  const runBreathAnimation = useCallback(() => {
    if (!isBreathingRef.current) return;

    const now = Date.now();
    const phaseElapsed = now - phaseStartRef.current;
    const currentPhase = phaseRef.current;
    const phaseDuration = currentPhase === "inhale" ? INHALE_DURATION : EXHALE_DURATION;
    
    const phaseProgress = Math.min(1, phaseElapsed / phaseDuration);
    
    let totalProgress: number;
    if (currentPhase === "inhale") {
      totalProgress = phaseProgress * 0.4;
    } else {
      totalProgress = 0.4 + phaseProgress * 0.6;
    }
    setBreathProgress(totalProgress);

    // Eased breathing
    const easedProgress = currentPhase === "inhale" 
      ? 0.5 - Math.cos(phaseProgress * Math.PI) / 2
      : 0.5 + Math.cos(phaseProgress * Math.PI) / 2;
    
    const newOrbSize = ORB_SIZE_MIN + (ORB_SIZE_MAX - ORB_SIZE_MIN) * easedProgress;
    setOrbSize(newOrbSize);
    setBreathPhase(currentPhase);
    setCurrentBreath(currentBreathRef.current);

    if (phaseElapsed >= phaseDuration) {
      if (currentPhase === "inhale") {
        phaseRef.current = "exhale";
        phaseStartRef.current = now;
      } else {
        const completedBreathNum = currentBreathRef.current;
        setCompletedBreaths(prev => [...prev, completedBreathNum]);
        
        if (currentBreathRef.current >= BREATHS_PER_ROUND) {
          isBreathingRef.current = false;
          setOrbState("check-in");
          return;
        } else {
          currentBreathRef.current += 1;
          phaseRef.current = "inhale";
          phaseStartRef.current = now;
          setBreathProgress(0);
        }
      }
    }

    animationRef.current = requestAnimationFrame(runBreathAnimation);
  }, []);

  // Start breathing animation based on state
  useEffect(() => {
    if (orbState === "breathing") {
      isBreathingRef.current = true;
      phaseRef.current = "inhale";
      phaseStartRef.current = Date.now();
      setOrbSize(ORB_SIZE_MIN);
      animationRef.current = requestAnimationFrame(runBreathAnimation);
    } else {
      isBreathingRef.current = false;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [orbState, runBreathAnimation]);

  // Tooltip
  useEffect(() => {
    if (mode === "minimized" && isFirstEncounter) {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      const hideTimer = setTimeout(() => setShowTooltip(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [mode, isFirstEncounter]);

  // Reset on reopen
  useEffect(() => {
    if (mode === "fullscreen" || mode === "expanding") {
      setOrbState("intro");
      phaseRef.current = "inhale";
      currentBreathRef.current = 1;
      setOrbSize(ORB_SIZE_MIN + 40);
      setBreathPhase("inhale");
      setCurrentBreath(1);
      setBreathProgress(0);
      setCompletedBreaths([]);
    }
  }, [mode]);

  const handleBegin = useCallback(() => {
    phaseRef.current = "inhale";
    currentBreathRef.current = 1;
    setOrbSize(ORB_SIZE_MIN);
    setBreathPhase("inhale");
    setCurrentBreath(1);
    setBreathProgress(0);
    setCompletedBreaths([]);
    setOrbState("breathing");
  }, []);

  const handleAnotherRound = useCallback(() => {
    phaseRef.current = "inhale";
    currentBreathRef.current = 1;
    setOrbSize(ORB_SIZE_MIN);
    setBreathPhase("inhale");
    setCurrentBreath(1);
    setBreathProgress(0);
    setCompletedBreaths([]);
    setOrbState("breathing");
  }, []);

  const handleDone = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleCloseClick = useCallback(() => {
    if (isFirstEncounter && onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  }, [isFirstEncounter, onSkip, onComplete]);

  const handleMinimizedClick = useCallback(() => {
    onExpand?.();
  }, [onExpand]);

  // Minimized state - dark purple button with light inner elements
  if (mode === "minimized") {
    return (
      <div className="breathing-orb-mini-container">
        <button
          className="breathing-orb-mini"
          onClick={handleMinimizedClick}
          aria-label="Open breathing exercise"
        >
          <svg viewBox="0 0 44 44" width="44" height="44">
            <circle cx="22" cy="22" r="14" fill="none" stroke="#e6e6fa" strokeWidth="1.5" opacity="0.5" />
            <circle cx="22" cy="22" r="8" fill="#e6e6fa" opacity="0.9" />
          </svg>
        </button>
        
        {showTooltip && (
          <div className="breathing-orb-tooltip">
            <span>this breathing exercise is always here for you, at your own pace</span>
          </div>
        )}
      </div>
    );
  }

  const showIntro = orbState === "intro";
  const showBreathing = orbState === "breathing";
  const showCheckIn = orbState === "check-in";

  // Progress dot component
  const ProgressDot = ({ num }: { num: number }) => {
    const isComplete = completedBreaths.includes(num);
    const isCurrent = currentBreath === num && showBreathing && !isComplete;
    const progress = isCurrent ? breathProgress : (isComplete ? 1 : 0);
    
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);
    
    return (
      <div className={`breathing-progress-dot ${isComplete ? "complete" : ""} ${isCurrent ? "current" : ""}`}>
        <svg viewBox="0 0 44 44" width="44" height="44">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(230,230,250,0.3)" strokeWidth="3" />
          {(isCurrent || isComplete) && (
            <circle 
              cx="22" 
              cy="22" 
              r={radius}
              fill="none" 
              stroke={isComplete ? "#d8d4e8" : "#b8a9c9"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="progress-ring"
            />
          )}
          {isComplete && (
            <circle cx="22" cy="22" r="15" fill="rgba(230,230,250,0.2)" />
          )}
        </svg>
        <span className="dot-number">{num}</span>
      </div>
    );
  };

  return (
    <div 
      className={`breathing-orb-container ${isOpening ? "opening" : ""} ${isClosing ? "closing" : ""}`}
      role="dialog"
      aria-label="Breathing exercise"
    >
      {/* Corner X button - always visible except during close */}
      {!isClosing && (
        <div className="breathing-orb-corner-container">
          <button
            className="breathing-orb-corner-btn"
            onClick={handleCloseClick}
            aria-label={isFirstEncounter ? "Skip breathing exercise" : "Close breathing exercise"}
          >
            <svg viewBox="0 0 44 44" width="44" height="44">
              <line x1="15" y1="15" x2="29" y2="29" stroke="#e6e6fa" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="15" x2="15" y2="29" stroke="#e6e6fa" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {isFirstEncounter && <span className="breathing-orb-corner-label">skip</span>}
        </div>
      )}

      {/* Main content */}
      <div className="breathing-orb-content">
        
        {/* INTRO STATE */}
        {showIntro && (
          <>
            <div className="breathing-orb-header">
              <p className="breathing-orb-nice-work">
                {isFromHub ? "You're doing great." : "Nice work."}
              </p>
              <h2 className="breathing-orb-title">Invitation to pause.</h2>
              <p className="breathing-orb-description">
                {isFromHub 
                  ? "You can soothe your nervous system by taking 3 intentional breaths."
                  : "You mapped your sensations, now you can soothe them, starting with 3 intentional breaths."
                }
              </p>
            </div>

            <div className="breathing-orb-visual">
              <div className="breathing-orb preview" />
            </div>

            <div className="breathing-orb-footer">
              <p className="breathing-orb-ratio">
                <span className="arrow">↑</span> In for 4, <span className="arrow">↓</span> out for 6
              </p>
              <button className="breathing-orb-begin-btn" onClick={handleBegin}>
                begin
              </button>
            </div>
          </>
        )}

        {/* BREATHING STATE */}
        {showBreathing && (
          <>
            {/* Instruction ABOVE orb */}
            <p className="breathing-orb-instruction">
              {breathPhase === "inhale" ? "breathe in" : "breathe out"}
            </p>

            <div className="breathing-orb-visual breathing-visual-large">
              <div
                className={`breathing-orb ${breathPhase}`}
                style={{
                  width: orbSize,
                  height: orbSize,
                }}
              />
            </div>

            <div className="breathing-orb-progress">
              <ProgressDot num={1} />
              <ProgressDot num={2} />
              <ProgressDot num={3} />
            </div>
          </>
        )}

        {/* CHECK-IN STATE */}
        {showCheckIn && (
          <div className="breathing-orb-checkin">
            <p className="breathing-orb-checkin-text">How are you feeling?</p>
            <div className="breathing-orb-checkin-buttons">
              <button className="breathing-orb-round-btn" onClick={handleAnotherRound}>
                another round
              </button>
              <button className="breathing-orb-round-btn primary" onClick={handleDone}>
                I'm ready to continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
