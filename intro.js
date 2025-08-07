// Interactive tutorial system for Shadows in the Deck
class IntroTutorial {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.steps = [
      {
        text: "Gain focus orbs and move by playing cards from your hand",
        highlight: "#player-hand",
        overlay: "Your Hand", 
        duration: 2000
      },
      {
        text: "Buy powerful cards from the market using your orbs",
        highlight: "#market",
        overlay: "Market",
        duration: 2000
      },
      {
        text: "Collect all 5 fragments",
        highlight: "#frags",
        glow: true,
        duration: 1500
      },
      {
        text: "Explore the dream map to find them",
        highlight: "#map",
        overlay: "Dream Map", 
        duration: 2000
      },
      {
        text: "Before the Cruxflare deck runs out!",
        highlight: "#crux-remaining",
        glow: true,
        pulse: true,
        duration: 2000
      }
    ];
  }

  start() {
    if (localStorage.getItem('shadows-tutorial-complete')) {
      return false; // Skip if already completed
    }
    
    this.isActive = true;
    this.currentStep = 0;
    this.createTutorialOverlay();
    this.showStep(0);
    return true; // Tutorial started
  }

  createTutorialOverlay() {
    // Create main tutorial overlay
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-content">
        <div class="tutorial-text" id="tutorial-text"></div>
        <div class="tutorial-overlay-text" id="tutorial-overlay-text"></div>
        <button class="tutorial-skip" id="tutorial-skip">Skip Tutorial</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Add event listeners
    document.getElementById('tutorial-skip').onclick = () => this.skip();
    
    // Auto-advance through steps
    this.stepTimer = null;
  }

  showStep(stepIndex) {
    if (stepIndex >= this.steps.length) {
      this.complete();
      return;
    }

    const step = this.steps[stepIndex];
    const tutorialText = document.getElementById('tutorial-text');
    const overlayText = document.getElementById('tutorial-overlay-text');
    
    // Clear previous highlights
    this.clearHighlights();
    
    // Set tutorial text
    tutorialText.textContent = step.text;
    tutorialText.classList.add('fade-in');
    
    // Add highlight effects
    if (step.highlight) {
      const element = document.querySelector(step.highlight);
      if (element) {
        element.classList.add('tutorial-highlight');
        
        if (step.glow) element.classList.add('tutorial-glow');
        if (step.pulse) element.classList.add('tutorial-pulse');
      }
    }
    
    // Add overlay text if specified
    if (step.overlay && step.highlight) {
      const element = document.querySelector(step.highlight);
      if (element) {
        overlayText.textContent = step.overlay;
        overlayText.classList.add('tutorial-overlay-visible');
        this.positionOverlayText(element, overlayText);
      }
    }
    
    // Auto advance to next step
    this.stepTimer = setTimeout(() => {
      this.currentStep++;
      this.showStep(this.currentStep);
    }, step.duration);
  }

  positionOverlayText(targetElement, overlayElement) {
    const rect = targetElement.getBoundingClientRect();
    overlayElement.style.position = 'fixed';
    overlayElement.style.left = rect.left + (rect.width / 2) - (overlayElement.offsetWidth / 2) + 'px';
    overlayElement.style.top = (rect.top - 40) + 'px';
    overlayElement.style.zIndex = '10001';
  }

  clearHighlights() {
    // Remove all tutorial classes
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight', 'tutorial-glow', 'tutorial-pulse');
    });
    
    // Clear overlay text
    const overlayText = document.getElementById('tutorial-overlay-text');
    if (overlayText) {
      overlayText.classList.remove('tutorial-overlay-visible');
      overlayText.textContent = '';
    }
  }

  skip() {
    this.complete();
  }

  complete() {
    this.isActive = false;
    clearTimeout(this.stepTimer);
    this.clearHighlights();
    
    // Remove tutorial overlay
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 500);
    }
    
    // Mark tutorial as complete
    localStorage.setItem('shadows-tutorial-complete', 'true');
    
    // Show normal welcome message
    document.getElementById('log').textContent = 'Welcome to the game!';
  }

  // Method to reset tutorial (for testing or player choice)
  reset() {
    localStorage.removeItem('shadows-tutorial-complete');
  }
}

// CSS styles for tutorial (add to your style.css)
const tutorialStyles = `
#tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.tutorial-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 20px;
}

.tutorial-text {
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.tutorial-text.fade-in {
  opacity: 1;
}

.tutorial-overlay-text {
  position: fixed;
  background: rgba(222, 184, 135, 0.9);
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tutorial-overlay-text.tutorial-overlay-visible {
  opacity: 1;
}

.tutorial-skip {
  background: rgba(138, 43, 226, 0.3);
  border: 1px solid rgba(138, 43, 226, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tutorial-skip:hover {
  background: rgba(138, 43, 226, 0.5);
}

.tutorial-highlight {
  position: relative;
  z-index: 9999;
  border: 3px solid rgba(222, 184, 135, 0.8) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tutorial-glow {
  box-shadow: 0 0 20px rgba(222, 184, 135, 0.6) !important;
}

.tutorial-pulse {
  animation: tutorial-pulse 1s infinite;
}

@keyframes tutorial-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.fade-out {
  opacity: 0;
  transition: opacity 0.5s ease;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = tutorialStyles;
document.head.appendChild(styleSheet);

// Export the tutorial class
export default IntroTutorial;

/* 
INTEGRATION INSTRUCTIONS:

1. Add to game.js imports:
import IntroTutorial from './intro.js';

2. Replace the logMsg('Welcome to the game!') in initGame() with:
const tutorial = new IntroTutorial();
setTimeout(() => {
  if (!tutorial.start()) {
    logMsg('Welcome to the game!');
  }
}, 800);

3. Add these CSS updates to style.css for bigger cards:
.card-flip {
  width: 120px;  
  height: 170px; 
}

.card-front, .card-back {
  font-size: 0.9em; 
}
*/
