import { generateTooltip, parseCruxflareEvent } from './cards.js';


// Simple hand state tracking
let handContainer = null;

// Create floating particles effect
export function createParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = ''; // Clear existing particles
  const colors = ['golden', 'purple', 'silver'];
  
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div');
    particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
    
    const size = Math.random() * 6 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 30 + 's';
    particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
    particle.style.setProperty('--drift', (Math.random() - 0.5) * 150 + 'px');
    
    container.appendChild(particle);
  }
}

// Render market cards with flip animations
// In ui.js, find the renderMarket function and update it like this:

export function renderMarket(marketRow, coins, onBuyCard) {
  let m = document.getElementById('market');
  m.innerHTML = '';
  marketRow.forEach((cardObj, i) => {
    let el = document.createElement('div');
    el.className = 'card-flip tooltip';
    el.setAttribute('data-tooltip', cardObj.tooltip);
    el.setAttribute('data-card-name', cardObj.name); // ADD THIS LINE
    el.innerHTML = `
      <div class="card-flip-inner">
        <div class="card-front">
          <div>${cardObj.name}</div>
          <div class='cost'>Cost: ${cardObj.cost}</div>
        </div>
        <div class="card-back">
        </div>
      </div>
    `;
    el.onclick = () => {
      if (coins >= cardObj.cost && !el.classList.contains('market-bought')) {
        el.classList.add('market-bought');
        setTimeout(() => onBuyCard(i), 500);
      } else {
        onBuyCard(i);
      }
    };
    m.appendChild(el);
  });
}

// ========== SIMPLE HAND SYSTEM ==========
// Main hand rendering function - SIMPLE AND RELIABLE
export function renderHand(playerHand, onPlayCard) {
  if (!handContainer) {
    handContainer = document.getElementById('player-hand');
  }
  
  console.log('🎴 Rendering hand with', playerHand.length, 'cards');
  
  // Always rebuild hand completely - simple and reliable
  handContainer.innerHTML = '';
  
  // Create card elements
  playerHand.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = 'card-flip tooltip';
    el.setAttribute('data-tooltip', generateTooltip(card));
    el.setAttribute('data-card-index', index);
    el.setAttribute('data-card-name', card);
    
    el.innerHTML = `
      <div class="card-flip-inner">
        <div class="card-front">
          <div>${card}</div>
        </div>
        <div class="card-back">
        </div>
      </div>
    `;
    
    // Add click handler for playing cards
    el.addEventListener('click', () => {
      if (!el.classList.contains('card-played')) {
        // Mark as played visually immediately
        el.classList.add('card-played');
        el.querySelector('.card-flip-inner').classList.add('played');
        el.style.pointerEvents = 'none';
        el.style.cursor = 'default';
        
        // Call game logic
        setTimeout(() => onPlayCard(card, index), 100);
      }
    });
    
    handContainer.appendChild(el);
  });
  
  console.log('🎴 Hand rendered successfully');
}

// Clear played cards (call this when drawing a new hand)
export function clearPlayedCards() {
  console.log('🎴 Clearing played cards');
  // This will be handled by the complete re-render in renderHand
}

// Reset hand system (for game restart)
export function resetHandSystem() {
  handContainer = null;
  console.log('🎴 Hand system reset');
}

// ========== REST OF UI FUNCTIONS UNCHANGED ==========

// Render the game map
export function renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions) {
  let map = document.getElementById('map');
  map.innerHTML = '';
  for (let i = 0; i < mapNodes; i++) {
    let node = document.createElement('div');
    node.className = 'node';
    node.title = `Node ${i}`;
    
    if (fragmentPositions.includes(i)) {
      let f = document.createElement('div');
      f.className = 'fragment';
      node.appendChild(f);
      node.title += ' - Contains Fragment';
    }
    if (encounterPositions.includes(i)) {
      let e = document.createElement('div');
      e.className = 'encounter';
      node.appendChild(e);
      node.title += ' - Encounter Zone';
    }
    if (i === playerPos) {
      let p = document.createElement('div');
      p.className = 'player';
      node.appendChild(p);
      node.title += ' - Your Location';
    }
    map.appendChild(node);
  }
}

// Update HUD display
export function updateHUD(coins, fragmentsCollected, cruxflareDeck, finalDarknessCountdown = null) {
  document.getElementById('coins').textContent = coins;
  document.getElementById('frags').textContent = fragmentsCollected;
  
  // ========== ENHANCED HUD WITH FINAL DARKNESS COUNTDOWN ==========
  const cruxDisplay = document.getElementById('crux-remaining');
  if (finalDarknessCountdown !== null) {
    cruxDisplay.textContent = finalDarknessCountdown;  // Just the number
    cruxDisplay.style.color = 'rgba(255, 100, 100, 0.9)';
    cruxDisplay.style.fontWeight = 'bold';
  } else {
    cruxDisplay.textContent = cruxflareDeck.length;
    cruxDisplay.style.color = '';
    cruxDisplay.style.fontWeight = '';
  }
  // ==========================================================
}

// Update mist overlay based on danger level with THREE-STAGE PROGRESSION
export function updateMistOverlay(cruxflareDeck) {
  const cardsLeft = cruxflareDeck.length;
  
  // Remove existing classes
  document.body.classList.remove('warning-mode', 'danger-mode');
  
  if (cardsLeft <= 3) {
    // Final panic - red
    document.body.classList.add('danger-mode');
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(255, 100, 100, 0.8)';
    hud.style.animation = 'pulse-danger 1.5s infinite';
  } else if (cardsLeft <= 9) {
    // Warning stage - purple
    document.body.classList.add('warning-mode');
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(138, 43, 226, 0.8)';
    hud.style.animation = 'pulse-warning 2s infinite';
  } else {
    // Reset HUD to normal when not in warning/danger
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(138, 43, 226, 0.3)';
    hud.style.animation = 'none';
  }
}

// Log message to player
export function logMsg(msg) {
  const logElement = document.getElementById('log');
  logElement.textContent = msg;
  // Reset any special Cruxflare styling
  logElement.classList.remove('cruxflare-log');
}

// ========== NEW: ENHANCED CRUXFLARE LOG MESSAGING ==========
export function logCruxflareMsg(event) {
  const logElement = document.getElementById('log');
  logElement.textContent = `⚡ CRUXFLARE ⚡ ${event}`;
  
  // Add special Cruxflare styling
  logElement.classList.add('cruxflare-log');
  
  // Remove the special styling after 4 seconds
  setTimeout(() => {
    logElement.classList.remove('cruxflare-log');
  }, 4000);
}
// ==========================================================

// Visual feedback for card play (now handled by flip animations)
export function cardPlayFeedback(cardElement) {
  // This function is now primarily handled by the flip animations
  // But we can add extra sparkle effects here if desired
  if (cardElement) {
    cardElement.style.boxShadow = '0 0 20px rgba(222, 184, 135, 0.8)';
    setTimeout(() => {
      cardElement.style.boxShadow = '';
    }, 300);
  }
}

// Enhanced visual and text feedback for encounters
export function encounterFeedback(playerPos) {
  console.log('🔥 encounterFeedback called for position:', playerPos);
  const nodes = document.querySelectorAll('.node');
  const logArea = document.getElementById('log');
  
  if (playerPos < nodes.length && logArea) {
    const currentNode = nodes[playerPos];
    console.log('🔥 Starting encounter feedback for node', playerPos);
    
    // Get the current log message to determine what happened
    const currentLogText = logArea.textContent;
    let encounterType = 'unknown';
    
    if (currentLogText.includes('Found treasure')) {
      encounterType = 'treasure';
    } else if (currentLogText.includes('Shadow drains')) {
      encounterType = 'drain';
    }
    
    // Add descriptive feedback to the log
    setTimeout(() => {
      if (encounterType === 'treasure') {
        logArea.textContent = currentLogText + ' ✨ The purple mist swirls with fortune!';
      } else if (encounterType === 'drain') {
        logArea.textContent = currentLogText + ' 👻 Dark tendrils reach from the void...';
      } else {
        logArea.textContent = currentLogText + ' 🌀 You sense a disturbance in the dream...';
      }
    }, 100);
    
    // Visual animation for the log area (we know this works!)
    const originalLogBg = logArea.style.background;
    const originalLogBorder = logArea.style.border;
    const originalLogBoxShadow = logArea.style.boxShadow;
    
    if (encounterType === 'treasure') {
      // Golden treasure effect
      logArea.style.background = 'rgba(255, 215, 0, 0.3)';
      logArea.style.border = '3px solid rgba(255, 215, 0, 0.8)';
      logArea.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
    } else {
      // Purple danger effect  
      logArea.style.background = 'rgba(138, 43, 226, 0.3)';
      logArea.style.border = '3px solid rgba(138, 43, 226, 0.8)';
      logArea.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.6)';
    }
    logArea.style.transition = 'all 0.3s ease';
    
   // Reset after 2 seconds to KNOWN default values
setTimeout(() => {
  logArea.style.background = 'rgba(0, 0, 0, 0.6)'; // Default from CSS
  logArea.style.border = '2px solid rgba(222, 184, 135, 0.4)'; // Default from CSS  
  logArea.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'; // Default from CSS
}, 2000);
    
    // Fixed node animation - address the overflow issue
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      // Temporarily allow overflow
      const originalMapOverflow = mapContainer.style.overflow;
      mapContainer.style.overflow = 'visible';
      mapContainer.style.zIndex = '10';
      
      // Fix node positioning and scaling
      const originalStyles = {
        position: currentNode.style.position,
        zIndex: currentNode.style.zIndex,
        transform: currentNode.style.transform,
        background: currentNode.style.background,
        border: currentNode.style.border
      };
      
      // Force positioning that will be visible
      currentNode.style.position = 'relative';
      currentNode.style.zIndex = '1000';
      currentNode.style.transformOrigin = 'center center';
      
      // Simple, visible animation
      let step = 0;
      const steps = [
        { transform: 'scale(1)', background: 'rgba(138, 43, 226, 0.8)', border: '3px solid rgba(138, 43, 226, 1)' },
        { transform: 'scale(1.5)', background: 'rgba(160, 60, 255, 0.9)', border: '4px solid rgba(160, 60, 255, 1)' },
        { transform: 'scale(1)', background: '', border: '' }
      ];
      
      function animateNodeStep() {
        if (step < steps.length) {
          const styles = steps[step];
          currentNode.style.transform = styles.transform;
          currentNode.style.background = styles.background;
          currentNode.style.border = styles.border;
          currentNode.style.transition = 'all 0.4s ease-out';
          
          console.log('🔥 Node animation step', step, styles.transform);
          step++;
          setTimeout(animateNodeStep, 400);
        } else {
          // Reset everything
          Object.keys(originalStyles).forEach(prop => {
            currentNode.style[prop] = originalStyles[prop];
          });
          mapContainer.style.overflow = originalMapOverflow;
          console.log('🔥 Node animation complete');
        }
      }
      
      animateNodeStep();
    }
    
  } else {
    console.log('🔥 ERROR: Invalid position or missing log area');
  }
}

// Show/hide section headers for game over
export function toggleSectionHeaders(show) {
  const headers = ['market-header', 'hand-header', 'map-header'];
  headers.forEach(id => {
    if (show) {
      document.getElementById(id).classList.remove('hidden');
    } else {
      document.getElementById(id).classList.add('hidden');
    }
  });
}

// Clear game areas
export function clearGameAreas() {
  document.getElementById('market').innerHTML = '';
  document.getElementById('player-hand').innerHTML = '';
  document.getElementById('map').innerHTML = '';
  // Reset our hand tracking
  resetHandSystem();
}

// ========== CRUXFLARE OVERLAY SYSTEM ==========

// Show Cruxflare event as a card overlay
export function showCruxflareOverlay(eventString) {
  // Parse the event to get name, description, and icon
  const eventData = parseCruxflareEvent(eventString);
  
  // Create the overlay HTML
  const overlayHTML = `
    <div class="cruxflare-overlay-backdrop" id="cruxflare-backdrop"></div>
    <div class="cruxflare-overlay" id="cruxflare-overlay">
      <div class="cruxflare-card">
        <div class="cruxflare-header">Cruxflare Event</div>
        <div class="cruxflare-title">${eventData.name}</div>
        <div class="cruxflare-icon">${eventData.icon}</div>
        <div class="cruxflare-effect">${eventData.description}</div>
        <div class="cruxflare-dismiss-hint">Click to dismiss</div>
      </div>
    </div>
  `;
  
  // Add to the page
  document.body.insertAdjacentHTML('beforeend', overlayHTML);
  
  // Get the elements
  const backdrop = document.getElementById('cruxflare-backdrop');
  const overlay = document.getElementById('cruxflare-overlay');
  
  // Add click handlers for dismissing
  const dismissOverlay = () => {
    hideCruxflareOverlay();
  };
  
  // Click on backdrop dismisses
  backdrop.addEventListener('click', dismissOverlay);
  
  // Click on card also dismisses
  overlay.addEventListener('click', dismissOverlay);
  
  // Show with animation
  requestAnimationFrame(() => {
    backdrop.classList.add('show');
    overlay.classList.add('show');
  });
  
  // Auto-dismiss after 3 seconds (but can be dismissed early)
  setTimeout(() => {
    hideCruxflareOverlay();
  }, 3000);
}

// Show game over screen as an overlay
// ========== ENHANCED WIN/LOSE POPUP SYSTEM ==========
// Replace the showGameOverScreen function in ui.js with this:

export function showGameOverScreen(isWin, fragmentsCollected, totalFragments) {
  let flavorText;
  let particleClass = isWin ? 'win-particles' : 'lose-particles';
  
  if (isWin) {
    const flavorTexts = [
      "The dream fragments coalesce into crystalline truth. You have mastered the shifting realm.",
      "Through shadow and mist, you have gathered the scattered pieces of the dreaming mind.",
      "The Cruxflare fades as your collection of fragments forms a complete vision of the dreamscape.",
      "Starlight breaks through the darkness. The dream realm bows to your mastery.",
      "Victory shimmers like aurora through the cosmic void. The fragments sing in harmony."
    ];
    flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
  } else {
    const flavorTexts = [
      "The dream collapses, fragments scattered to the void. The shadows claim what remains.",
      "Cruxflare consumes the last vestiges of the dream. The fragments slip through ethereal fingers.",
      "The mist thickens, obscuring the path. Some fragments were never meant to be found.",
      "Darkness pulls everything inward. The dream realm reclaims its scattered essence.",
      "The void hungers, drawing all light into its endless depths. Another dreamer falls to shadow."
    ];
    flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
  }
  
  const gameOverContainer = document.getElementById('game-over-container');
  
  // Create the particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = `particle-container ${particleClass}`;
  
  // Generate particles
  for (let i = 0; i < (isWin ? 60 : 40); i++) {
    const particle = document.createElement('div');
    particle.className = `game-over-particle ${isWin ? 'win-particle' : 'lose-particle'}`;
    
    // Random starting positions and directions
    if (isWin) {
      // Win particles: start from center, expand outward
      particle.style.setProperty('--angle', Math.random() * 360 + 'deg');
      particle.style.setProperty('--distance', (Math.random() * 800 + 400) + 'px');
      particle.style.setProperty('--delay', Math.random() * 0.5 + 's');
    } else {
      // Lose particles: start from edges, contract inward
      const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
      let startX, startY;
      
      switch(edge) {
        case 0: startX = Math.random() * 100 + '%'; startY = '0%'; break;    // top
        case 1: startX = '100%'; startY = Math.random() * 100 + '%'; break; // right
        case 2: startX = Math.random() * 100 + '%'; startY = '100%'; break; // bottom
        case 3: startX = '0%'; startY = Math.random() * 100 + '%'; break;   // left
      }
      
      particle.style.setProperty('--start-x', startX);
      particle.style.setProperty('--start-y', startY);
      particle.style.setProperty('--delay', Math.random() * 0.8 + 's');
    }
    
    particleContainer.appendChild(particle);
  }
  
  gameOverContainer.innerHTML = `
    <div class="game-over-backdrop"></div>
    <div class="game-over-screen ${isWin ? 'victory-screen' : 'defeat-screen'}">
      <div class="game-over-title">${isWin ? '✧ Victory ✧' : '◯ Dream Lost ◯'}</div>
      <div class="game-over-score">Fragments Collected: ${fragmentsCollected} / ${totalFragments}</div>
      <div class="game-over-flavor">${flavorText}</div>
    </div>
  `;
  
  // Add particles to the container
  gameOverContainer.appendChild(particleContainer);
}

// Show/hide UI elements
export function showElement(elementId) {
  document.getElementById(elementId).style.display = 'inline-block';
}

export function hideElement(elementId) {
  document.getElementById(elementId).style.display = 'none';
}

export function clearElement(elementId) {
  document.getElementById(elementId).innerHTML = '';
}
