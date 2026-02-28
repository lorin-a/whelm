/**
 * AboutOverlay - About page with simple fade animation
 * 
 * Dark purple background with light text.
 * Simplified for reliability.
 */

import React, { useEffect, useState } from "react";
import "./AboutOverlay.css";

interface AboutOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function AboutOverlay({ visible, onClose }: AboutOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for fade out animation before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`about-overlay-container ${isVisible ? 'visible' : ''}`}
      role="dialog"
      aria-label="About whelm"
    >
      {/* Close button */}
      <div className="about-corner-container">
        <button
          className="about-corner-btn"
          onClick={onClose}
          aria-label="Close about"
        >
          <svg viewBox="0 0 44 44" width="44" height="44">
            <line x1="15" y1="15" x2="29" y2="29" stroke="#e6e6fa" strokeWidth="2" strokeLinecap="round" />
            <line x1="29" y1="15" x2="15" y2="29" stroke="#e6e6fa" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="about-overlay-content">
        <div className="about-overlay-header">
          <h2 className="about-overlay-title">About</h2>
          <p className="about-overlay-subtitle">whelm.</p>
        </div>

        <div className="about-overlay-body">
          <p>
            whelm was created by [name], a [description], not a clinical professional.
          </p>
          <p>
            This tool is for reflection and self-exploration. It is not a replacement for therapy, medical advice, or crisis support.
          </p>
          <p>
            If you're in distress, please reach out to someone you trust or a crisis line.
          </p>
        </div>

        <p className="about-overlay-footer">
          Built with care. Still emerging.
        </p>
      </div>
    </div>
  );
}
