import { generateTooltip } from './cards.js';

// Track played cards for visual consistency
let playedCardsThisTurn = [];
let lastHandSize = 0;

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
export function renderMarket(marketRow, coins, onBuyCard) {
  let m = document.getElementById('market');
  m.innerHTML = '';
  marketRow.forEach((cardObj, i) => {
    let el = document.createElement('div');
    el.className = 'card-flip tooltip';
    el.setAttribute('data-tooltip', cardObj.tooltip);
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
        // Wait for flip animation to complete before processing purchase
        setTimeout(() => onBuyCard(i), 500); // Process after flip completes
      } else {
        onBuyCard(i); // Still show "not enough orbs" message immediately
      }
    };
    m.appendChild(el);
  });
}

// Render player hand with flip animations and placeholder backs
export function renderHand(playerHand, onPlayCard) {
  let h = document.getElementById('player-hand');
  
  // Clear played cards if we have a new hand (detected by hand size increase)
  if (playerHand.length > lastHandSize) {
    playedCardsThisTurn = [];
  }
  lastHandSize = playerHand.length;
  
  h.innerHTML = '';
  
  // Render active cards
  playerHand.forEach((card, i) => {
    let el = document.createElement('div');
    el.className = 'card-flip tooltip';
    el.setAttribute('data-tooltip', generateTooltip(card));
    el.innerHTML = `
      <div class="card-flip-inner">
        <div class="card-front">
          <div>${card}</div>
        </div>
        <div class="card-back">
        </div>
      </div>
    `;
    el.onclick = () => {
      if (!el.classList.contains('hand-played')) {
        el.classList.add('hand-played'); // Flip to back
        el.style.pointerEvents = 'none'; // Disable further clicks
        el.style.cursor = 'default'; // Change cursor to show it's disabled
        
        // Add to played cards for persistent display
        playedCardsThisTurn.push(card);
        
        // Process the game logic after flip animation
        setTimeout(() => onPlayCard(card, i), 500);
      }
    };
    h.appendChild(el);
  });
  
  // Render played card placeholders (always showing backs)
  playedCardsThisTurn.forEach((card) => {
    let el = document.createElement('div');
    el.className = 'card-flip';
    el.innerHTML = `
      <div class="card-flip-inner" style="transform: rotateY(180deg);">
        <div class="card-front">
          <div>${card}</div>
        </div>
        <div class="card-back">
        </div>
      </div>
    `;
    el.style.pointerEvents = 'none'; // Always disabled
    el.style.cursor = 'default';
    h.appendChild(el);
  });
}

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
export function updateHUD(coins, fragmentsCollected, cruxflareDeck) {
  document.getElementById('coins').textContent = coins;
  document.getElementById('frags').textContent = fragmentsCollected;
  document.getElementById('crux-remaining').textContent = cruxflareDeck.length;
}

// Update mist overlay based on danger level with THREE-STAGE PROGRESSION
export function updateMistOverlay(cruxflareDeck) {
  const cardsLeft = cruxflareDeck.length;
  
  // Remove existing classes
  document.body.classList.remove('warning-mode', 'danger-mode');
  
  if (cardsLeft <= 2) {
    // Final panic - red
    document.body.classList.add('danger-mode');
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(255, 100, 100, 0.8)';
    hud.style.animation = 'pulse-danger 1.5s infinite';
  } else if (cardsLeft <= 7) {
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
  document.getElementById('log').textContent = msg;
}

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

// ENHANCED visual feedback for encounters - TEST VERSION
export function encounterFeedback(playerPos) {
  console.log('🔥 encounterFeedback called for position:', playerPos);
  const nodes = document.querySelectorAll('.node');
  console.log('🔥 Found', nodes.length, 'nodes total');
  
  // DOUBLE TEST: Animate both the node AND the log area
  if (playerPos < nodes.length) {
    const currentNode = nodes[playerPos];
    const logArea = document.getElementById('log');
    
    console.log('🔥 Starting DOUBLE animation test for node', playerPos);
    
    // TEST 1: Animate the log area (this should definitely be visible)
    if (logArea) {
      console.log('🔥 Animating log area for visibility test');
      
      // Save original log styles
      const originalLogBg = logArea.style.background;
      const originalLogTransform = logArea.style.transform;
      const originalLogBorder = logArea.style.border;
      
      // Animate log area
      logArea.style.background = 'rgba(255, 0, 255, 0.8)';
      logArea.style.transform = 'scale(1.1)';
      logArea.style.border = '4px solid rgba(255, 0, 255, 1)';
      logArea.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        logArea.style.background = 'rgba(255, 255, 0, 1)';
        logArea.style.transform = 'scale(1.2)';
        logArea.style.border = '6px solid rgba(255, 255, 0, 1)';
      }, 300);
      
      setTimeout(() => {
        logArea.style.background = originalLogBg;
        logArea.style.transform = originalLogTransform;
        logArea.style.border = originalLogBorder;
      }, 600);
    }
    
    // TEST 2: Animate the node with extreme visibility
    const originalStyles = {
      background: currentNode.style.background,
      transform: currentNode.style.transform,
      boxShadow: currentNode.style.boxShadow,
      border: currentNode.style.border,
      position: currentNode.style.position,
      zIndex: currentNode.style.zIndex,
      overflow: currentNode.style.overflow
    };
    
    // Force the node to be visible and not clipped
    currentNode.style.position = 'relative';
    currentNode.style.zIndex = '9999';
    currentNode.style.overflow = 'visible';
    
    let step = 0;
    const animationSteps = [
      { transform: 'scale(1)', background: 'rgba(255, 0, 0, 1)', border: '2px solid red' },
      { transform: 'scale(3)', background: 'rgba(0, 255, 0, 1)', border: '8px solid lime' },
      { transform: 'scale(4)', background: 'rgba(0, 0, 255, 1)', border: '12px solid blue' },
      { transform: 'scale(2)', background: 'rgba(255, 255, 0, 1)', border: '6px solid yellow' },
      { transform: 'scale(1)', background: '', border: '' }
    ];
    
    function animateStep() {
      if (step < animationSteps.length) {
        const styles = animationSteps[step];
        
        // Force styles with maximum priority
        currentNode.style.setProperty('transform', styles.transform, 'important');
        currentNode.style.setProperty('background', styles.background, 'important');
        currentNode.style.setProperty('border', styles.border, 'important');
        currentNode.style.setProperty('transition', 'all 0.5s ease', 'important');
        
        // Also try changing the parent container overflow
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          mapContainer.style.overflow = 'visible';
        }
        
        console.log(`🔥 EXTREME Animation step ${step}: transform=${styles.transform}, bg=${styles.background}`);
        step++;
        setTimeout(animateStep, 500);
      } else {
        // Reset
        Object.keys(originalStyles).forEach(prop => {
          currentNode.style[prop] = originalStyles[prop];
        });
        console.log('🔥 Animation complete');
      }
    }
    
    animateStep();
    
  } else {
    console.log('🔥 ERROR: playerPos', playerPos, 'is out of range for', nodes.length, 'nodes');
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
}

// Show game over screen as an overlay
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

// Clear played cards (call this at start of new turn if needed)
export function clearPlayedCards() {
  playedCardsThisTurn = [];
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
