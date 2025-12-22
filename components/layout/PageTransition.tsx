'use client';

import { useEffect } from 'react';

// Remove language transition overlay on page load
function removeTransitionOverlay() {
  if (typeof document === 'undefined') return;
  
  const overlay = document.getElementById('language-transition-overlay');
  if (overlay) {
    // Small delay to ensure content is rendered
    setTimeout(() => {
      overlay.style.transition = 'opacity 250ms ease-in';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        overlay.remove();
      }, 250);
    }, 100);
  }
}

export function PageTransition() {
  useEffect(() => {
    // Remove any existing transition overlay when page loads
    removeTransitionOverlay();
  }, []);

  return null;
}

export default PageTransition;

