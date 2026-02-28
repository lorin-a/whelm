/**
 * Whelm - Complete Flow
 * 
 * Updated to include breathing orb transition between body scan and hub.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  colors,
  timing,
  easings,
  sizing,
  introStages as S,
  hubStages,
  FlowPhase,
  HubStage,
} from "./tokens";
import OverwhelmOMeter, { OverwhelmIntensity } from "./OverwhelmOMeter";
import BodyScan, { BodyScanResult } from "./BodyScan";
import BodyScanIntro from "./BodyScanIntro";
import BreathingOrb from "./BreathingOrb";
import AboutOverlay from "./AboutOverlay";
import "./BodyScan.css";
import "./BodyScanIntro.css";
import "./BreathingOrb.css";
import "./AboutOverlay.css";

function useAnimationSequence(autoStart = true) {
  const [stage, setStage] = useState(S.RESET);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const play = useCallback(() => {
    clearTimeouts();
    setStage(S.RESET);
    setIsComplete(false);
    let cumulative = 0;
    timing.introSequence.forEach((delay, i) => {
      cumulative += delay;
      timeoutsRef.current.push(window.setTimeout(() => setStage(i), cumulative));
    });
    timeoutsRef.current.push(
      window.setTimeout(() => setIsComplete(true), cumulative + timing.replayDelay)
    );
  }, [clearTimeouts]);

  useEffect(() => {
    if (autoStart) play();
    return clearTimeouts;
  }, [autoStart, play, clearTimeouts]);

  return { stage, isComplete, play, isResetting: stage === S.RESET };
}

function useResponsiveCircle() {
  const [size, setSize] = useState(sizing.circle.medium);
  useEffect(() => {
    const update = () => {
      const smaller = Math.min(window.innerWidth, window.innerHeight);
      if (smaller < 480) setSize(Math.min(smaller * 0.45, sizing.circle.small));
      else if (smaller < 768) setSize(Math.min(smaller * 0.38, sizing.circle.medium));
      else setSize(Math.min(smaller * 0.3, sizing.circle.large));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function ReplayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function TapHereArrow({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)` }}>
      <path d="M 50 55 Q 30 40, 15 20" fill="none" stroke={colors.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
      <path d="M 15 20 L 12 28 M 15 20 L 23 22" fill="none" stroke={colors.text} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <text x="52" y="70" fill={colors.text} style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontStyle: "italic", opacity: 0.6 }}>tap here</text>
    </g>
  );
}

function getPosition(angle: number, distance: number) {
  const radians = (angle * Math.PI) / 180;
  return { x: Math.cos(radians) * distance, y: Math.sin(radians) * distance };
}

export default function App() {
  const { stage, play, isResetting } = useAnimationSequence();
  const circleSize = useResponsiveCircle();

  const [flowPhase, setFlowPhase] = useState<FlowPhase>("intro");
  const [visibleNodules, setVisibleNodules] = useState<string[]>([]);
  const [centerText, setCenterText] = useState<"whelm" | "begin" | "none">("whelm");
  const [beginMuted, setBeginMuted] = useState(false);
  const [beginPulsing, setBeginPulsing] = useState(false);
  const [circleForceVisible, setCircleForceVisible] = useState(false);
  const [onboardingNodule, setOnboardingNodule] = useState<string | null>(null);
  const [showTapHint, setShowTapHint] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(-90);
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweeperOpacity, setSweeperOpacity] = useState(1);
  const [sweepComplete, setSweepComplete] = useState(false);
  const [checkInEmerged, setCheckInEmerged] = useState(false);
  const [retractingNodules, setRetractingNodules] = useState<string[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [bodyScanResult, setBodyScanResult] = useState<BodyScanResult | null>(null);
  const [overwhelmIntensity, setOverwhelmIntensity] = useState<OverwhelmIntensity | null>(null);
  const [editingMeterFromSummary, setEditingMeterFromSummary] = useState(false);
  
  // Breathing orb state
  const [breathingOrbMode, setBreathingOrbMode] = useState<"fullscreen" | "minimized" | "expanding">("fullscreen");
  const [isFirstBreathingEncounter, setIsFirstBreathingEncounter] = useState(true);
  const [showBreathingOrb, setShowBreathingOrb] = useState(false);
  const [isBreathingFromHub, setIsBreathingFromHub] = useState(false);
  const [isBreathingClosing, setIsBreathingClosing] = useState(false);

  const noTransition = isResetting ? "none" : undefined;
  const circleVisible = stage >= S.CIRCLE_GROWS || circleForceVisible || flowPhase !== "intro";

  useEffect(() => {
    if (stage >= S.FADE_TO_ENTER && flowPhase === "intro") {
      setFlowPhase("explaining");
      setTimeout(() => {
        setCenterText("begin");
        setFlowPhase("ready");
        setTimeout(() => setBeginPulsing(true), 800);
      }, 800);
    }
  }, [stage, flowPhase]);

  const handleReplay = useCallback(() => {
    setFlowPhase("intro");
    setVisibleNodules([]);
    setRetractingNodules([]);
    setCenterText("whelm");
    setBeginMuted(false);
    setBeginPulsing(false);
    setCircleForceVisible(false);
    setOnboardingNodule(null);
    setShowTapHint(false);
    setSweepAngle(-90);
    setSweeperOpacity(1);
    setIsSweeping(false);
    setSweepComplete(false);
    setCheckInEmerged(false);
    setOverwhelmIntensity(null);
    setBodyScanResult(null);
    setShowBreathingOrb(false);
    setBreathingOrbMode("fullscreen");
    play();
  }, [play]);

  const handleBeginClick = useCallback(() => {
    if (flowPhase !== "ready") return;
    setBeginMuted(true);
    setBeginPulsing(false);
    // Start expansion animation
    setFlowPhase("expanding-to-meter");
    // After animation completes, show meter
    setTimeout(() => {
      setFlowPhase("meter");
    }, 800); // Match the expansion animation duration
  }, [flowPhase]);

  const handleMeterComplete = useCallback((intensity: OverwhelmIntensity) => {
    setOverwhelmIntensity(intensity);
    setFlowPhase("bodyscan-intro");
    setEditingMeterFromSummary(false);
  }, []);

  const handleMeterBack = useCallback(() => {
    // First fade out the meter
    setFlowPhase("meter-fading-out");
    // Then start contraction animation
    setTimeout(() => {
      setFlowPhase("contracting-to-intro");
      // After contraction completes, return to ready state
      setTimeout(() => {
        setFlowPhase("ready");
        setBeginMuted(false);
        setBeginPulsing(true);
      }, 800); // Match the contraction animation duration
    }, 400); // Match the fade-out duration
  }, []);

  // Body scan intro: user continues to body scan
  const handleBodyScanIntroContinue = useCallback(() => {
    setFlowPhase("bodyscan");
  }, []);

  // Body scan intro: user goes back to meter
  const handleBodyScanIntroBack = useCallback(() => {
    setFlowPhase("meter");
  }, []);

  // Body scan intro: user skips directly to breathing
  const handleSkipToBreathing = useCallback(() => {
    setFlowPhase("breathing");
    setBreathingOrbMode("fullscreen");
    setShowBreathingOrb(true);
    setIsBreathingFromHub(false); // Not from hub
  }, []);

  // Updated: Body scan now transitions to breathing instead of hub
  const handleBodyScanComplete = useCallback((result: BodyScanResult) => {
    setBodyScanResult(result);
    setFlowPhase("breathing");
    setBreathingOrbMode("fullscreen");
    setShowBreathingOrb(true);
    setIsBreathingFromHub(false); // Not from hub
  }, []);

  const handleBodyScanBack = useCallback(() => {
    setFlowPhase("bodyscan-intro");
  }, []);

  const handleEditSection = useCallback((section: 'meter' | 'body' | 'water' | 'sensation' | 'color') => {
    if (section === 'meter') {
      setEditingMeterFromSummary(true);
      setFlowPhase("meter");
    }
    // Other sections are handled internally by BodyScan via setStep
  }, []);

  // Handler for when breathing exercise completes or is skipped (first encounter)
  const handleBreathingComplete = useCallback(() => {
    setIsBreathingClosing(true);
    setIsFirstBreathingEncounter(false);
    
    // After fade out, reveal hub
    setTimeout(() => {
      setIsBreathingClosing(false);
      setFlowPhase("hub-active");
      setBreathingOrbMode("minimized");
      setOnboardingNodule("checkIn");
      setIsSweeping(true);
      
      setTimeout(() => {
        setSweepAngle(270);
        setTimeout(() => {
          setSweeperOpacity(0);
          setIsSweeping(false);
          setSweepComplete(true);
          setVisibleNodules(["checkIn", "returnToReal", "makeSense", "integrate"]);
          setTimeout(() => setCheckInEmerged(true), timing.sweep.settleDelay);
          setTimeout(() => setShowTapHint(true), timing.sweep.settleDelay + 600);
        }, timing.sweep.sweepDuration + timing.sweep.stickPause);
      }, timing.sweep.checkInPause);
    }, 400); // Fade duration
  }, []);

  // Handler for expanding the minimized breathing orb
  const handleBreathingExpand = useCallback(() => {
    setFlowPhase("breathing"); // Triggers dark theme for about button
    setBreathingOrbMode("expanding");
    setShowBreathingOrb(true);
    setIsBreathingFromHub(true); // Mark as opened from hub
  }, []);

  // Handler for closing the expanded breathing orb (when reopened from hub)
  const handleBreathingOrbClose = useCallback(() => {
    setIsBreathingClosing(true);
    
    // After fade out, return to hub
    setTimeout(() => {
      setIsBreathingClosing(false);
      setFlowPhase("hub-active");
      setBreathingOrbMode("minimized");
      setIsBreathingFromHub(false);
    }, 400); // Fade duration
  }, []);

  const handleNoduleTap = useCallback((id: string) => {
    if (id === onboardingNodule) {
      setShowTapHint(false);
      const currentIndex = hubStages.findIndex(s => s.id === id);
      const nextNodule = hubStages[currentIndex + 1];
      if (nextNodule) {
        setOnboardingNodule(nextNodule.id);
        setTimeout(() => setShowTapHint(true), 600);
      } else {
        setOnboardingNodule(null);
      }
    }
  }, [onboardingNodule]);

  const handleHubReset = useCallback(() => {
    setRetractingNodules(["checkIn", "returnToReal", "makeSense", "integrate"]);
    setOnboardingNodule(null);
    setShowTapHint(false);
    setSweepComplete(false);
    setCheckInEmerged(false);
    
    setTimeout(() => {
      setVisibleNodules([]);
      setRetractingNodules([]);
      setSweepAngle(-90);
      setSweeperOpacity(1);
      
      setTimeout(() => {
        setOnboardingNodule("checkIn");
        setIsSweeping(true);
        setTimeout(() => {
          setSweepAngle(270);
          setTimeout(() => {
            setSweeperOpacity(0);
            setIsSweeping(false);
            setSweepComplete(true);
            setVisibleNodules(["checkIn", "returnToReal", "makeSense", "integrate"]);
            setTimeout(() => setCheckInEmerged(true), timing.sweep.settleDelay);
            setTimeout(() => setShowTapHint(true), timing.sweep.settleDelay + 600);
          }, timing.sweep.sweepDuration + timing.sweep.stickPause);
        }, timing.sweep.checkInPause);
      }, 400);
    }, timing.retract.duration);
  }, []);

  const handleBackToIntro = useCallback(() => {
    setRetractingNodules(hubStages.map(s => s.id));
    setOnboardingNodule(null);
    setShowTapHint(false);
    setShowBreathingOrb(false);
    
    setTimeout(() => {
      setVisibleNodules([]);
      setRetractingNodules([]);
      setSweepAngle(-90);
      setSweeperOpacity(1);
      setIsSweeping(false);
      setSweepComplete(false);
      setCheckInEmerged(false);
      setOverwhelmIntensity(null);
      setBodyScanResult(null);
      setCircleForceVisible(true);
      setCenterText("begin");
      setFlowPhase("ready");
      setBreathingOrbMode("fullscreen");
      setTimeout(() => setBeginPulsing(true), 600);
    }, timing.retract.duration);
  }, []);

  const handleSkip = useCallback(() => {
    setCircleForceVisible(true);
    setCenterText("begin");
    setFlowPhase("ready");
    setTimeout(() => setBeginPulsing(true), 600);
  }, []);

  const showIntroText = (flowPhase === "intro" || flowPhase === "explaining" || flowPhase === "ready") && !circleForceVisible;
  const showHubElements = flowPhase === "hub-active" || (isBreathingClosing && isBreathingFromHub);
  const showReplay = flowPhase === "ready";
  const showSkip = (flowPhase === "intro" && stage >= S.W_APPEARS) || flowPhase === "explaining";
  const showMeter = flowPhase === "meter" || flowPhase === "expanding-to-meter" || flowPhase === "meter-fading-out";
  const showBodyScanIntro = flowPhase === "bodyscan-intro";
  const showBodyScan = flowPhase === "bodyscan";
  const showBreathing = flowPhase === "breathing" || (flowPhase === "hub-active" && breathingOrbMode === "expanding");

  const { noduleSize, noduleDistance } = sizing;
  const noduleRadius = noduleSize / 2;
  const totalSpan = (noduleDistance + noduleRadius) * 2;
  const svgSize = totalSpan + 20;
  const svgCenter = svgSize / 2;

  // Determine if we should show the hinge animation
  const showBeginInCircle = flowPhase === "ready" || flowPhase === "hub-active";

  // Circle expansion states
  const isExpanding = flowPhase === "expanding-to-meter";
  const isContracting = flowPhase === "contracting-to-intro";
  const isMeterFadingOut = flowPhase === "meter-fading-out";
  
  // Calculate expanded circle size (diagonal of viewport to ensure full coverage)
  const expandedSize = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 1.1;
  
  // Hide circle during body scan intro, body scan, and breathing (but NOT during meter/expansion)
  const hideCircle = showBodyScanIntro || showBodyScan || flowPhase === "breathing" || flowPhase === "breathing-settling";

  // Determine circle size based on phase
  const getCircleSize = () => {
    if (hideCircle) return 0;
    if (isExpanding || flowPhase === "meter" || isMeterFadingOut) return expandedSize;
    if (isContracting) return circleSize; // Will animate back to normal
    return circleSize;
  };

  // Determine theme based on current phase (dark backgrounds need light text/buttons)
  // Intro is dark, then transitions to light hub, then dark for body scan intro and breathing
  // contracting-to-intro goes back to dark
  // When closing breathing from hub, switch to light theme so hub shows correctly
  const isDarkTheme = (flowPhase === "intro" || flowPhase === "explaining" || flowPhase === "ready" || flowPhase === "contracting-to-intro" || flowPhase === "bodyscan-intro" || flowPhase === "breathing") && !(isBreathingClosing && isBreathingFromHub);

  return (
    <div className={`whelm-container ${isDarkTheme ? "dark-theme" : ""}`}>
      {/* Central Circle - expands to become meter background */}
      <div
        onClick={flowPhase === "ready" ? handleBeginClick : undefined}
        className={`whelm-circle ${beginPulsing ? "circle-pulse" : ""}`}
        style={{
          width: circleVisible && !hideCircle ? getCircleSize() : 0,
          height: circleVisible && !hideCircle ? getCircleSize() : 0,
          opacity: circleVisible && !hideCircle ? 1 : 0,
          cursor: flowPhase === "ready" ? "pointer" : "default",
          pointerEvents: flowPhase === "ready" ? "auto" : "none",
          // Use large pixel value for circle (9999px), 0 for square
          borderRadius: isExpanding || flowPhase === "meter" || isMeterFadingOut ? 0 : 9999,
          transition: isExpanding || isContracting || isMeterFadingOut
            ? `all 0.8s ease-in-out`
            : circleForceVisible
              ? `width 0.6s ease-in-out, height 0.6s ease-in-out, opacity 0.4s ease-in-out, border-radius 0.6s ease-in-out`
              : noTransition || `width 2.2s ease-in-out, height 2.2s ease-in-out, opacity 0.8s ease-in-out, border-radius 0.8s ease-in-out`,
        }}
      >
        <div className="circle-text-container">
          <span
            className="circle-text circle-text-begin"
            style={{
              transform: showBeginInCircle ? "rotateY(0deg)" : "rotateY(90deg)",
              opacity: showBeginInCircle && !isExpanding && !isContracting ? 1 : 0,
              color: beginMuted ? colors.textMuted : colors.text,
            }}
          >
            begin
          </span>
        </div>
      </div>

      {/* Overwhelm-o-meter - shows during meter phases */}
      {showMeter && (
        <OverwhelmOMeter 
          onComplete={handleMeterComplete} 
          onBack={handleMeterBack}
          initialValues={overwhelmIntensity ? { leftPos: overwhelmIntensity.leftPos, rightPos: overwhelmIntensity.rightPos } : null}
          isFadingOut={flowPhase === "meter-fading-out"}
        />
      )}

      {/* Body Scan Intro - Trauma-informed framing */}
      {showBodyScanIntro && (
        <BodyScanIntro
          onContinue={handleBodyScanIntroContinue}
          onSkipToBreathing={handleSkipToBreathing}
          onBack={handleBodyScanIntroBack}
        />
      )}

      {/* Body Scan */}
      {showBodyScan && (
        <BodyScan 
          onComplete={handleBodyScanComplete}
          onBack={handleBodyScanBack}
          overwhelmIntensity={overwhelmIntensity}
          onEditSection={handleEditSection}
        />
      )}

      {/* Breathing Orb - Full Screen */}
      {(showBreathing || isBreathingClosing) && (
        <BreathingOrb
          mode={breathingOrbMode === "expanding" ? "expanding" : "fullscreen"}
          onComplete={isBreathingFromHub ? handleBreathingOrbClose : handleBreathingComplete}
          onSkip={isBreathingFromHub ? handleBreathingOrbClose : handleBreathingComplete}
          isFirstEncounter={isFirstBreathingEncounter}
          onExpand={handleBreathingExpand}
          isFromHub={isBreathingFromHub}
          isClosing={isBreathingClosing}
        />
      )}

      {/* Breathing Orb - Minimized (persistent button) */}
      {flowPhase === "hub-active" && breathingOrbMode === "minimized" && !showAbout && (
        <BreathingOrb
          mode="minimized"
          onComplete={handleBreathingOrbClose}
          isFirstEncounter={false}
          onExpand={handleBreathingExpand}
        />
      )}

      {/* Hub SVG */}
      {showHubElements && (
        <svg className="hub-svg" viewBox={`0 0 ${svgSize} ${svgSize}`} style={{ width: svgSize, height: svgSize }}>
          {hubStages.map((hubStage: HubStage) => {
            const isVisible = visibleNodules.includes(hubStage.id);
            const isRetracting = retractingNodules.includes(hubStage.id);
            const isCheckIn = hubStage.id === "checkIn";
            const { x, y } = getPosition(hubStage.angle, noduleDistance);
            const label: string[] = Array.isArray(hubStage.label) ? hubStage.label : [hubStage.label];
            let noduleX = x, noduleY = y;
            if (isRetracting) { noduleX = 0; noduleY = 0; }
            else if (isCheckIn && !checkInEmerged) { noduleX = 0; noduleY = 0; }
            const lineVisible = isRetracting ? false : isCheckIn ? checkInEmerged : isVisible;
            const isActiveNodule = onboardingNodule === hubStage.id;
            const isMuted = flowPhase === "hub-active" && !isActiveNodule;
            const fillColor = isMuted ? colors.nodulesMuted[hubStage.id] : colors.nodules[hubStage.id];
            const textColor = isMuted ? colors.textInactive : colors.text;
            return (
              <g key={hubStage.id}>
                <line x1={svgCenter} y1={svgCenter} x2={svgCenter + x} y2={svgCenter + y} stroke={colors.line} strokeWidth="1.5" strokeLinecap="round" style={{ strokeDasharray: noduleDistance, strokeDashoffset: lineVisible ? 0 : noduleDistance, transition: `stroke-dashoffset 0.6s ${easings.organic}` }} />
                <g onClick={() => handleNoduleTap(hubStage.id)} className={isActiveNodule && showTapHint ? "nodule-pulse" : ""} style={{ transform: `translate(${svgCenter + noduleX}px, ${svgCenter + noduleY}px)`, opacity: isRetracting ? 0 : isVisible ? 1 : 0, transition: `transform 0.6s ${easings.organic}, opacity 0.5s ${easings.organic}`, cursor: isActiveNodule ? "pointer" : "default" }}>
                  <circle cx={0} cy={0} r={noduleRadius} fill={fillColor} style={{ cursor: isActiveNodule ? "pointer" : "default", transition: `fill 0.5s ${easings.organic}` }} />
                  <text x={0} y={label.length > 1 ? -7 : 0} textAnchor="middle" dominantBaseline="middle" fill={textColor} className="nodule-label" style={{ opacity: isRetracting ? 0 : isCheckIn ? (checkInEmerged ? 1 : 0) : isVisible ? 1 : 0, transition: `opacity 0.25s ${easings.organic}` }}>
                    {label.map((line: string, i: number) => (<tspan key={i} x={0} dy={i === 0 ? 0 : "1.2em"}>{line}</tspan>))}
                  </text>
                </g>
              </g>
            );
          })}
          {isSweeping && (
            <g style={{ transform: `rotate(${sweepAngle + 90}deg)`, transformOrigin: `${svgCenter}px ${svgCenter}px`, transition: `transform ${timing.sweep.sweepDuration}ms ${easings.organic}, opacity 0.4s ${easings.organic}`, opacity: sweeperOpacity }}>
              <line x1={svgCenter} y1={svgCenter} x2={svgCenter} y2={svgCenter - noduleDistance} stroke={colors.line} strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
              <circle cx={svgCenter} cy={svgCenter - noduleDistance} r={noduleRadius} fill={colors.nodulesMuted.checkIn} opacity={0.8} />
            </g>
          )}
          {showTapHint && onboardingNodule === "checkIn" && <TapHereArrow x={svgCenter + 35} y={svgCenter - noduleDistance - 15} />}
        </svg>
      )}

      {/* Intro Text Animation */}
      {showIntroText && (
        <div className="whelm-text">
          <div className="welcome-to-wrapper" style={{ maxWidth: stage >= S.WHELM_CENTERS ? "0px" : "600px", opacity: stage >= S.W_APPEARS && stage < S.WHELM_CENTERS ? 1 : 0, transform: stage >= S.WHELM_CENTERS ? "translateX(-40px)" : "translateX(0)", transition: noTransition || `max-width 1.2s ${easings.organic}, opacity 1s ${easings.organic}, transform 1.2s ${easings.organic}` }}>
            <span style={{ opacity: stage >= S.W_APPEARS ? 1 : 0, transform: stage >= S.W_APPEARS ? "translateX(0)" : "translateX(-12px)", transition: noTransition || `opacity 0.7s ${easings.organic}, transform 0.9s ${easings.organic}` }}>w</span>
            <span className="text-reveal" style={{ maxWidth: stage >= S.WELCOME ? "250px" : "0px", opacity: stage >= S.WELCOME ? 1 : 0, transition: noTransition || `max-width 1.6s ${easings.organic}, opacity 1.2s ${easings.organic}` }}>elcome</span>
            <span className="text-reveal" style={{ maxWidth: stage >= S.WELCOME_TO ? "80px" : "0px", opacity: stage >= S.WELCOME_TO ? 1 : 0, transition: noTransition || `max-width 0.9s ${easings.organic}, opacity 0.7s ${easings.organic}` }}>&nbsp;to&nbsp;</span>
          </div>
          <span className="over-wrapper" style={{ maxWidth: stage >= S.OVERWHELM && stage < S.OVER_DROPS ? "120px" : "0px", opacity: stage >= S.OVER_DROPS ? 0 : stage >= S.OVERWHELM ? 1 : 0, transform: stage >= S.OVER_DROPS ? "translateY(120px) rotate(3deg)" : "translateY(0)", transition: noTransition || `max-width 1.4s ${easings.organic}, opacity ${stage >= S.OVER_DROPS ? "0.5s" : "1s"} ${easings.organic}, transform 0.8s ${easings.organic}` }}>
            over
            <svg className="strikethrough-svg" width="100%" height="16" viewBox="0 0 56 16" preserveAspectRatio="none">
              <path d="M 0 8 C 3 3, 7 3, 10 8 C 13 13, 17 13, 20 8 C 23 3, 27 3, 30 8 C 33 13, 37 13, 40 8 C 43 3, 47 3, 50 8 C 53 13, 56 13, 58 8" fill="none" stroke="#B8A9C9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 100, strokeDashoffset: stage >= S.STRIKETHROUGH ? 0 : 100, transition: noTransition || `stroke-dashoffset 1.2s linear` }} />
            </svg>
          </span>
          <div className="swap-container" style={{ perspective: "300px" }}>
            <span 
              className="whelm-word" 
              style={{ 
                opacity: stage >= S.OVERWHELM ? 1 : 0,
                transform: showBeginInCircle ? "rotateY(-90deg)" : "rotateY(0deg)",
                color: stage >= S.CIRCLE_GROWS ? "#2d2438" : "#f8f7fc",
                transition: noTransition || `opacity 1.5s ${easings.organic}, transform 1s cubic-bezier(0.45, 0, 0.55, 1), color 1.2s ${easings.organic}` 
              }}
            >
              whelm
              <span style={{ display: "inline", opacity: stage >= S.OVER_DROPS ? 1 : 0, transition: noTransition || `opacity 0.4s ${easings.organic}` }}>.</span>
            </span>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      {showSkip && <button onClick={handleSkip} className="skip-button">skip</button>}
      {showReplay && <button onClick={handleReplay} className="replay-button" style={{ opacity: 0.5, cursor: "pointer", pointerEvents: "auto" }}><ReplayIcon /> replay</button>}
      {flowPhase === "hub-active" && (
        <>
          <button onClick={handleBackToIntro} className="back-button">← back to intro</button>
          <button onClick={handleHubReset} className="hub-reset-button"><ReplayIcon /> reset</button>
        </>
      )}

      {/* About Button - changes color based on theme */}
      <button 
        className="about-button" 
        onClick={() => setShowAbout(true)}
        aria-label="About whelm"
      >
        ?
      </button>

      {/* About Overlay */}
      <AboutOverlay visible={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}
