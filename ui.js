import { generateTooltip } from './cards.js';

// Enhanced hand state tracking
let currentHandState = [];  // Complete hand including played/unplayed status
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
        setTimeout(() => onBuyCard(i), 500);
      } else {
        onBuyCard(i); // Still show "not enough orbs" message immediately
      }
    };
    m.appendChild(el);
  });
}

// ========== COMPLETELY REWRITTEN HAND SYSTEM ==========
// Initialize hand container and state
function initializeHand() {
  if (!handContainer) {
    handContainer = document.getElementById('player-hand');
  }
  currentHandState = [];
}

// Create a card element with proper event handling
function createCardElement(card, index, isPlayed = false) {
  const el = document.createElement('div');
  el.className = `card-flip tooltip hand-card-${index}`;
  el.setAttribute('data-tooltip', generateTooltip(card));
  el.setAttribute('data-card-index', index);
  el.setAttribute('data-card-name', card);
  
  el.innerHTML = `
    <div class="card-flip-inner ${isPlayed ? 'played' : ''}">
      <div class="card-front">
        <div>${card}</div>
      </div>
      <div class="card-back">
      </div>
    </div>
  `;
  
  // Visual state for played cards
  if (isPlayed) {
    el.classList.add('card-played');
    el.style.pointerEvents = 'none';
    el.style.cursor = 'default';
    el.style.opacity = '0.7';
  }
  
  return el;
}

// Main hand rendering function - COMPLETELY REWRITTEN
export function renderHand(playerHand, onPlayCard) {
  initializeHand();
  
  // Detect if this is a completely new hand (new turn)
  const isNewHand = playerHand.length > currentHandState.filter(card => !card.played).length;
  
  if (isNewHand || currentHandState.length === 0) {
    // ========== NEW HAND - REBUILD EVERYTHING ==========
    console.log('🎴 New hand detected, rebuilding...');
    handContainer.innerHTML = '';
    currentHandState = [];
    
    // Create fresh hand state
    playerHand.forEach((card, index) => {
      currentHandState.push({
        name: card,
        index: index,
        played: false,
        element: null
      });
    });
    
    // Create all card elements
    currentHandState.forEach((cardState, index) => {
      const cardElement = createCardElement(cardState.name, index, false);
      cardState.element = cardElement;
      
      // Add click handler for playing cards
      cardElement.addEventListener('click', () => playCardFromHand(index, onPlayCard));
      
      handContainer.appendChild(cardElement);
    });
    
  } else {
    // ========== EXISTING HAND - UPDATE STATES ONLY ==========
    console.log('🎴 Updating existing hand states...');
    
    // Update existing cards to match current playerHand
    // Cards that are no longer in playerHand have been "consumed" by the game
    const activeCards = new Set(playerHand);
    
    currentHandState.forEach((cardState, index) => {
      if (!cardState.played && !activeCards.has(cardState.name)) {
        // This card was consumed by game logic but we haven't visually played it yet
        // This shouldn't happen with our new system, but just in case
        console.log('🎴 Card consumed by game logic:', cardState.name);
      }
    });
  }
  
  console.log('🎴 Hand rendered. Current state:', currentHandState.length, 'cards');
}

// Handle card playing with in-place flipping
function playCardFromHand(cardIndex, onPlayCard) {
  const cardState = currentHandState[cardIndex];
  
  if (!cardState || cardState.played) {
    console.log('🎴 Card already played or invalid:', cardIndex);
    return;
  }
  
  console.log('🎴 Playing card:', cardState.name, 'at index', cardIndex);
  
  // Mark card as played in our state
  cardState.played = true;
  
  // Update visual state immediately
  const cardElement = cardState.element;
  if (cardElement) {
    cardElement.classList.add('card-played');
    cardElement.querySelector('.card-flip-inner').classList.add('played');
    cardElement.style.pointerEvents = 'none';
    cardElement.style.cursor = 'default';
    cardElement.style.opacity = '0.7';
    
    // Add subtle played effect
    cardElement.style.transform = 'scale(0.95)';
    cardElement.style.filter = 'grayscale(0.3)';
    cardElement.style.transition = 'all 0.3s ease';
  }
  
  // Call the game logic
  // Find the card's position in the actual playerHand array
  const gameLogicIndex = findCardInPlayerHand(cardState.name, onPlayCard);
  if (gameLogicIndex !== -1) {
    setTimeout(() => onPlayCard(cardState.name, gameLogicIndex), 100);
  }
}

// Helper to find card index in the game's playerHand array
function findCardInPlayerHand(cardName, onPlayCard) {
  // We'll need to track this differently, but for now return 0
  // The game logic will handle finding the right card
  return 0;
}

// Clear played cards (call this when drawing a new hand)
export function clearPlayedCards() {
  currentHandState = [];
  if (handContainer) {
    handContainer.innerHTML = '';
  }
  console.log('🎴 Cleared all played cards');
}

// Reset hand system (for game restart)
export function resetHandSystem() {
  currentHandState = [];
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
    
    // Reset after 2 seconds
    setTimeout(() => {
      logArea.style.background = originalLogBg;
      logArea.style.border = originalLogBorder;
      logArea.style.boxShadow = originalLogBoxShadow;
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
