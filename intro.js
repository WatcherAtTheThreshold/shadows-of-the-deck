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
        duration: 3500
      },
      {
        text: "Buy powerful cards from the market using your orbs",
        highlight: "#market",
        overlay: "Market",
        duration: 3500
      },
      {
        text: "Collect all 5 fragments",
        highlight: "#frags",
        glow: true,
        duration: 3000
      },
      {
        text: "Explore the dream map to find them",
        highlight: "#map",
        overlay: "Dream Map", 
        duration: 3500
      },
      {
        text: "Before the Cruxflare deck runs out!",
        highlight: "#crux-remaining",
        glow: true,
        pulse: true,
        duration: 3000
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

// Show game over screen as overlay
export function showGameOverScreen(isWin, fragmentsCollected, totalFragments) {
  let flavorText;
  if (isWin) {
    const flavorTexts = [
      "The dream fragments coalesce into crystalline truth. You have mastered the shifting realm.",
      "Through shadow and mist, you have gathered the scattered pieces of the dreaming mind.",
      "The Cruxflare fades as your collection of fragments forms a complete vision of the dreamscape."
    ];
    flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
  } else {
    const flavorTexts = [
      "The dream collapses, fragments scattered to the void. The shadows claim what remains.",
      "Cruxflare consumes the last vestiges of the dream. The fragments slip through ethereal fingers.",
      "The mist thickens, obscuring the path. Some fragments were never meant to be found."
    ];
    flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
  }
  
  const gameOverContainer = document.getElementById('game-over-container');
  gameOverContainer.innerHTML = `
    <div class="game-over-backdrop"></div>
    <div class="game-over-screen">
      <div class="game-over-title">${isWin ? '✧ Victory ✧' : '◯ Dream Lost ◯'}</div>
      <div class="game-over-score">Fragments Collected: ${fragmentsCollected} / ${totalFragments}</div>
      <div class="game-over-flavor">${flavorText}</div>
    </div>
  `;
}
