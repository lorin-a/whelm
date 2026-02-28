/**
 * BodyScanIntro - Trauma-informed introduction to body mapping
 * 
 * Dark purple theme with light text for visual contrast.
 * Includes popup definition for "window of tolerance"
 */

import React, { useState, useEffect, useRef } from "react";
import "./BodyScanIntro.css";

interface BodyScanIntroProps {
  /** User chooses to continue to body scan */
  onContinue: () => void;
  /** User chooses to skip to breathing exercise */
  onSkipToBreathing: () => void;
  /** User goes back to previous step */
  onBack?: () => void;
}

export default function BodyScanIntro({
  onContinue,
  onSkipToBreathing,
  onBack,
}: BodyScanIntroProps) {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    if (!showPopup) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showPopup]);

  return (
    <div className="body-scan-intro-container" role="dialog" aria-label="Introduction to body mapping">
      {/* Back button */}
      {onBack && (
        <button className="body-scan-intro-back" onClick={onBack}>
          ← back
        </button>
      )}
      
      <div className="body-scan-intro-content">
        {/* Title with visual hierarchy */}
        <div className="body-scan-intro-header">
          <h2 className="body-scan-intro-title">Mapping Overwhelm</h2>
          <p className="body-scan-intro-subtitle">in the body</p>
        </div>
        
        <div className="body-scan-intro-text">
          <p>
            Overwhelm can feel like it starts in the mind with overcrowded thoughts and unprocessed emotions. 
            The body lets you know when you're outside of your{" "}
            <button 
              className="body-scan-intro-term"
              onClick={() => setShowPopup(true)}
              aria-haspopup="dialog"
            >
              window of tolerance
            </button>.
          </p>
          <p>
            In this step, you will create a quick snapshot of where you feel tension with the goal of simply noticing it and naming it, not fixing it.
          </p>
        </div>

        <p className="body-scan-intro-safety">
          If connecting to your body doesn't feel safe or accessible right now, that's okay. 
          You can skip ahead to a breathing exercise.
        </p>

        <div className="body-scan-intro-buttons">
          <button 
            className="body-scan-intro-btn"
            onClick={onContinue}
          >
            continue
          </button>
          <button 
            className="body-scan-intro-btn secondary"
            onClick={onSkipToBreathing}
          >
            skip to breathwork
          </button>
        </div>
      </div>

      {/* Window of Tolerance Popup */}
      {showPopup && (
        <div className="body-scan-popup-overlay">
          <div 
            className="body-scan-popup" 
            ref={popupRef}
            role="dialog"
            aria-label="Window of Tolerance definition"
          >
            <button 
              className="body-scan-popup-close"
              onClick={() => setShowPopup(false)}
              aria-label="Close definition"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            
            <h3 className="body-scan-popup-title">Window of Tolerance</h3>
            
            {/* Scrollable content with fade */}
            <div className="body-scan-popup-scroll">
              <p className="body-scan-popup-text">
                The window of tolerance describes the range in which our nervous system can handle stress while staying engaged and present. When we're inside this window, we can think clearly, connect with others, and respond thoughtfully. When we move outside it — through hyperarousal (anxious, overwhelmed) or hypoarousal (shut down, numb) — we lose access to these capacities.
              </p>
              
              <p className="body-scan-popup-text">
                Neurodivergent people often have a narrower window of tolerance, making it easier to get overwhelmed. The good news: with awareness and practice, we can expand it over time.
              </p>
              
              <a 
                href="https://neurodivergentinsights.com/window-of-tolerance/"
                target="_blank"
                rel="noopener noreferrer"
                className="body-scan-popup-link"
              >
                Learn more at neurodivergentinsights.com →
              </a>
              
              <p className="body-scan-popup-credit">
                Source: Dr. Megan Anna Neff, Neurodivergent Insights
              </p>
              
              {/* Image at bottom with rounded corners 
                  NOTE: Place window-of-tolerance.jpg in your public folder */}
              <div className="body-scan-popup-image-container">
                <img 
                  src="/window-of-tolerance.jpg" 
                  alt="Window of Tolerance diagram showing optimal arousal zone between hyperarousal and hypoarousal"
                  className="body-scan-popup-image"
                  onError={(e) => {
                    // Hide image container if image fails to load
                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
