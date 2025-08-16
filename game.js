import { CARD_EFFECTS, createMarketDeck, createPlayerDeck, createCruxflareDeck, generateTooltip } from './cards.js';
import { 
  createParticles, renderMarket, renderHand, renderMap, updateHUD, 
  updateMistOverlay, logMsg, logCruxflareMsg, cardPlayFeedback, encounterFeedback,
  toggleSectionHeaders, clearGameAreas, showGameOverScreen, 
  showElement, hideElement, clearElement, clearPlayedCards, resetHandSystem,
  showCruxflareOverlay  // ADD THIS LINE
} from './ui.js';

// ---- music phase helpers (game.js) ----
function pickMusicPhase() {
  const cruxLeft = (window.cruxflareDeck?.length ?? 0);
  const isDangerMode = document.body.classList.contains('danger-mode');

  if (cruxLeft <= 3) return 'danger';
  if (isDangerMode) return 'warning';
  return 'start';
}

function updateMusicPhase() {
  const phase = pickMusicPhase();
  window.MusicManager?.setTrackByPhase(phase);
}



// ========== ENHANCED DRAW HAND SYSTEM FOR IN-PLACE CARDS ==========
function drawHand() {
  while (playerHand.length < 5 && playerDeck.length > 0) {
    const randomIndex = Math.floor(Math.random() * playerDeck.length);
    const drawnCard = playerDeck.splice(randomIndex, 1)[0];
    playerHand.push(drawnCard);
  }
  
  if (playerDeck.length === 0 && discardPile.length > 0) {
    playerDeck = [...discardPile];
    discardPile = [];
    // Shuffle deck
    for (let i = playerDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
    }
    logMsg("Your deck is reshuffled.");
  }
}

// Game state variables
let marketDeck, playerDeck, discardPile, playerHand, marketRow, mapNodes, playerPos, 
    fragmentPositions, fragmentsCollected, totalFragments, cruxflareDeck, coins, 
    encounterPositions, shadowBlocked, lastPlayedCard, fragmentBoostActive,
    nextCardCostBonus, buyingBlocked, dreamTremorActive,
    finalDarknessCountdown, gamePhase, skipNextDraw;

// Initialize game data
function setupGameData() {
  marketDeck = createMarketDeck();
  playerDeck = createPlayerDeck();
  skipNextDraw = false;
  
  // Randomize starting deck
  for (let i = playerDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
  }
  
  discardPile = [];
  playerHand = [];
  marketRow = [];
  
  mapNodes = 18;
  playerPos = 0;
  fragmentPositions = [2, 5, 7, 10, 12, 15, 17];
  fragmentsCollected = 0;
  totalFragments = fragmentPositions.length;
  encounterPositions = [3, 6, 8, 11, 13, 16];
  
  shadowBlocked = false;
  lastPlayedCard = null;
  fragmentBoostActive = null;
  nextCardCostBonus = 0;
  buyingBlocked = false;
  dreamTremorActive = false;
  finalDarknessCountdown = null;
  cruxflareDeck = createCruxflareDeck();
  coins = 3;
}

// Initialize the game
function initGame() {
  setupGameData();
  createParticles();
  document.body.classList.remove('danger-mode');
  hideElement('restart-btn');
  
  // Reset the hand system for a fresh start
  resetHandSystem();
  
  // Set up initial market
  for (let i = 0; i < 5; i++) { 
    drawMarketCard();
    
 showActionPhase();
  logMsg('Welcome to the game!'); 

     import('./intro.js').then(module => {
    const IntroTutorial = module.default;
    const tutorial = new IntroTutorial();
  });
    
  }
  
  // Initial draws and renders
  drawHand();
  updateAllUI();
  
  gamePhase = 'action';
  showActionPhase();
  
  // Start tutorial for new players

      logMsg('Welcome to the game!');
    
}

// Phase management functions
function showActionPhase() {
  gamePhase = 'action';
  
  document.getElementById('market').classList.remove('phase-hidden', 'phase-visible', 'cards-enlarged');
  document.getElementById('market-header').classList.remove('phase-hidden', 'phase-visible');
  document.getElementById('player-hand').classList.remove('phase-hidden', 'phase-visible', 'cards-enlarged');
  document.getElementById('hand-header').classList.remove('phase-hidden', 'phase-visible');
  
  document.getElementById('market').classList.add('phase-hidden');
  document.getElementById('market-header').classList.add('phase-hidden');
  document.getElementById('player-hand').classList.add('phase-visible', 'cards-enlarged');
  document.getElementById('hand-header').classList.add('phase-visible');
  
  const button = document.getElementById('end-turn-btn');
  button.textContent = 'End Turn';
  button.onclick = () => endTurn();
}

function showMarketPhase() {
  gamePhase = 'market';
  
  document.getElementById('market').classList.remove('phase-hidden', 'phase-visible', 'cards-enlarged');
  document.getElementById('market-header').classList.remove('phase-hidden', 'phase-visible');
  document.getElementById('player-hand').classList.remove('phase-hidden', 'phase-visible', 'cards-enlarged');
  document.getElementById('hand-header').classList.remove('phase-hidden', 'phase-visible');
  
  document.getElementById('player-hand').classList.add('phase-hidden');
  document.getElementById('hand-header').classList.add('phase-hidden');
  document.getElementById('market').classList.add('phase-visible', 'cards-enlarged');
  document.getElementById('market-header').classList.add('phase-visible');
  
  const button = document.getElementById('end-turn-btn');
  button.textContent = 'Draw New Hand';
  button.onclick = () => drawNewHand();
}

// Draw a card from market deck to market row
function drawMarketCard() {
  if (marketDeck.length > 0) {
    marketRow.push(marketDeck.shift());
  }
}

// ========== FIXED DRAW NEW HAND SYSTEM ==========
function drawNewHand() {
  console.log('🎴 Drawing new hand - starting fresh');
  
  // Check if we should skip drawing due to Time Fracture
  if (skipNextDraw) {
    skipNextDraw = false; // Reset the flag
    logMsg('Time fracture effect: No new cards drawn this turn!');
    showActionPhase();
    updateAllUI();
    return;
  }
  
  // Normal draw logic
  drawHand();
  showActionPhase();
  updateAllUI();
  logMsg('New hand drawn. Play your cards!');
}

// Handle buying a card from market
function buyCard(marketIndex) {
  const cardObj = marketRow[marketIndex];
  
  if (buyingBlocked) {
    logMsg(`Cannot buy cards this turn due to Shadow Whisper!`);
    return;
  }
  
  const actualCost = cardObj.cost + nextCardCostBonus;
  
  if (coins >= actualCost) {
    coins -= actualCost;
    
    if (nextCardCostBonus > 0) {
      logMsg(`Bought ${cardObj.name} for ${actualCost} orbs (${cardObj.cost} + ${nextCardCostBonus} from mist)`);
      nextCardCostBonus = 0;
    } else {
      logMsg(`Bought ${cardObj.name}`);
    }
    
    discardPile.push(cardObj.name);
    marketRow.splice(marketIndex, 1);
    drawMarketCard();
    updateAllUI();
  } else {
    if (nextCardCostBonus > 0) {
      logMsg(`Not enough orbs to buy ${cardObj.name} (costs ${actualCost} due to thick mist)`);
    } else {
      logMsg(`Not enough orbs to buy ${cardObj.name}`);
    }
  }
}

// Add a single new card to the existing hand display WITH ENTRANCE ANIMATION
function addNewCardToHand(cardName) {
  const handContainer = document.getElementById('player-hand');
  const currentCardCount = handContainer.children.length;
  
  const el = document.createElement('div');
  el.className = 'card-flip tooltip new-card'; // Added 'new-card' class for animation
  el.setAttribute('data-tooltip', generateTooltip(cardName));
  el.setAttribute('data-card-index', currentCardCount);
  el.setAttribute('data-card-name', cardName);
  
  el.innerHTML = `
    <div class="card-flip-inner">
      <div class="card-front">
        <div>${cardName}</div>
      </div>
      <div class="card-back">
      </div>
    </div>
  `;
  
  // Add click handler for the new card
  el.addEventListener('click', () => {
    if (!el.classList.contains('card-played')) {
      // Mark as played visually immediately
      el.classList.add('card-played');
      el.querySelector('.card-flip-inner').classList.add('played');
      el.style.pointerEvents = 'none';
      el.style.cursor = 'default';
      
      // Call game logic
      setTimeout(() => playCard(cardName, currentCardCount), 100);
    }
  });
  
  handContainer.appendChild(el);
  
  // Remove the new-card class after animation completes
  setTimeout(() => {
    el.classList.remove('new-card');
  }, 600);
  
  console.log('🎴✨ Added new card with entrance animation:', cardName);
}

// ========== SIMPLIFIED PLAY CARD SYSTEM WITH CARD DRAWING ==========
function playCard(cardName, originalIndex) {
  console.log('🎴 Playing card:', cardName);
  
  // Find the card in the current playerHand
  const handIndex = playerHand.indexOf(cardName);
  if (handIndex === -1) {
    console.log('🎴 Card not found in playerHand:', cardName);
    return;
  }
  
  // Track hand size before playing the card
  const handSizeBefore = playerHand.length;
  
  const effect = CARD_EFFECTS[cardName];
  let message = `Played ${cardName}`;
  
  if (effect) {
    switch (effect.type) {
      case 'coins':
        coins += effect.value;
        message += ` - Gained ${effect.value} orb${effect.value === 1 ? '' : 's'}`;
        break;
        
      case 'move':
        movePlayer(effect.value);
        message += ` - Moved ${effect.value} spaces`;
        break;
        
      case 'move_safe':
        movePlayer(effect.value, true);
        message += ` - Moved ${effect.value} spaces safely`;
        break;
        
      case 'special':
        message += ` - ${handleSpecialEffect(effect)}`;
        break;
    }
  }
  
  if (cardName !== 'Dream Echo') {
    lastPlayedCard = cardName;
  }
  logMsg(message);
  
  // Move card to discard and remove from hand
  discardPile.push(cardName);
  playerHand.splice(handIndex, 1);
  
  // Check if hand size increased (card was drawn)
  const handSizeAfter = playerHand.length;
  const cardWasDrawn = handSizeAfter > handSizeBefore - 1; // -1 because we removed the played card
  
  // Update UI elements
  updateHUD(coins, fragmentsCollected, cruxflareDeck, finalDarknessCountdown);
  updateMistOverlay(cruxflareDeck);
  renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
  
  // If a card was drawn, just add the new card element instead of rebuilding everything
  if (cardWasDrawn) {
    console.log('🎴 Card was drawn, adding new card element');
    addNewCardToHand(playerHand[playerHand.length - 1]); // Add the last card (newly drawn)
  }
  // Note: If no card was drawn, visual state is handled by in-place system
}

// Handle special card effects (unchanged)
function handleSpecialEffect(effect) {
  switch (effect.effect) {
    case 'lucky_find':
      let gain = Math.ceil(Math.random() * 3);
      coins += gain;
      return `Found ${gain} orb${gain === 1 ? '' : 's'}!`;
      
    case 'shadow_block':
      shadowBlocked = true;
      return `Next Cruxflare blocked!`;
      
    case 'dream_sight':
      if (cruxflareDeck.length > 0) {
        return `Next Cruxflare: ${cruxflareDeck[0]}`;
      }
      return `No Cruxflare cards remaining`;
      
   case 'fragment_boost':
      fragmentBoostActive = effect.value;
      return `Next fragment worth ${effect.value} points!`;
      
    case 'instant_fragments':
      fragmentsCollected += effect.value;
      if (fragmentsCollected >= totalFragments) {
        setTimeout(() => {
          logMsg(`You collected all fragments! You win!`);
          endGame();
        }, 500);
      }
      return `Gained ${effect.value} fragment${effect.value === 1 ? '' : 's'} instantly!`;
      
    case 'jump_to_fragment':
      if (fragmentPositions.length > 0) {
        const nextFragment = fragmentPositions.find(pos => pos > playerPos) || fragmentPositions[0];
        const oldPos = playerPos;
        playerPos = nextFragment;
        movePlayer(0, true);
        return `Leaped from node ${oldPos} to fragment at node ${nextFragment}!`;
      }
      return `No fragments remaining to leap to`;
      
    case 'replay_last':
      if (lastPlayedCard && CARD_EFFECTS[lastPlayedCard] && lastPlayedCard !== 'Dream Echo') {
        requestAnimationFrame(() => replayLastCard());
        return `Replaying ${lastPlayedCard}`;
      }
      return `No previous card to replay`;
      
    case 'move_and_coin':
      movePlayer(effect.move);
      coins += effect.coins;
      return `Moved ${effect.move}, gained ${effect.coins} orb`;
      
    case 'coin_and_draw':
      coins += effect.coins;
      if (playerDeck.length > 0) {
        playerHand.push(playerDeck.shift());
        return `Gained ${effect.coins} orbs, drew 1 card`;
      }
      return `Gained ${effect.coins} orbs, deck empty`;
      
    case 'move_and_protect':
      movePlayer(effect.move);
      shadowBlocked = true;
      return `Moved ${effect.move} spaces, protected from next Cruxflare`;
      
    default:
      return `Unknown effect`;
  }
}

// Replay the last played card's effect
function replayLastCard() {
  const lastEffect = CARD_EFFECTS[lastPlayedCard];
  if (lastEffect.type === 'coins') {
    coins += lastEffect.value;
    logMsg(`Dream Echo: Gained ${lastEffect.value} more orb${lastEffect.value === 1 ? '' : 's'}`);
  } else if (lastEffect.type === 'move') {
    movePlayer(lastEffect.value);
    logMsg(`Dream Echo: Moved ${lastEffect.value} more spaces`);
  } else if (lastEffect.type === 'move_safe') {
    movePlayer(lastEffect.value, true);
    logMsg(`Dream Echo: Moved ${lastEffect.value} more spaces safely`);
  } else if (lastEffect.type === 'special') {
    switch (lastEffect.effect) {
      case 'lucky_find':
        let gain = Math.ceil(Math.random() * 3);
        coins += gain;
        logMsg(`Dream Echo: Found ${gain} more orb${gain === 1 ? '' : 's'}!`);
        break;
      case 'move_and_coin':
        movePlayer(lastEffect.move);
        coins += lastEffect.coins;
        logMsg(`Dream Echo: Moved ${lastEffect.move} more, gained ${lastEffect.coins} more orb`);
        break;
      case 'coin_and_draw':
        coins += lastEffect.coins;
        if (playerDeck.length > 0) {
          const drawnCard = playerDeck.shift();
          playerHand.push(drawnCard);
          // Add the visual card element directly
          addNewCardToHand(drawnCard);
          logMsg(`Dream Echo: Gained ${lastEffect.coins} more orbs, drew 1 more card`);
        } else {
          logMsg(`Dream Echo: Gained ${lastEffect.coins} more orbs, deck empty`);
        }
        break;
      default:
        logMsg(`Dream Echo: Cannot replay ${lastPlayedCard} (special effect not repeatable)`);
    }
  }
}

// Move player on the map (unchanged)
function movePlayer(steps, skipEncounters = false) {
  playerPos = Math.min(playerPos + steps, mapNodes - 1);
  
  if (fragmentPositions.includes(playerPos)) {
    collectFragment();
  }
  
  if (encounterPositions.includes(playerPos) && !skipEncounters) {
    triggerEncounter();
  }
  
  renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
}

// Collect a fragment (unchanged)
function collectFragment() {
  let fragmentValue = 1;
  
  if (fragmentBoostActive) {
    fragmentValue = fragmentBoostActive;
    fragmentBoostActive = null;
    logMsg(`Fragment boost activated! Gained ${fragmentValue} fragments!`);
  }
  
  fragmentsCollected += fragmentValue;
  fragmentPositions = fragmentPositions.filter(pos => pos !== playerPos);
  
  if (fragmentValue === 1) {
    logMsg(`Collected a fragment! Total: ${fragmentsCollected}`);
  }
  
  if (fragmentsCollected >= totalFragments) {
    logMsg(`You collected all fragments! You win!`);
    endGame();
    return;
  }
}

// Trigger random encounter (unchanged)
function triggerEncounter() {
  let roll = Math.random();
  if (roll < 0.6) {
    let gain = Math.ceil(Math.random() * 3) + 1;
    coins += gain;
    logMsg(`Encounter: Found treasure! +${gain} orb${gain === 1 ? '' : 's'}.`);
  } else {
    let loss = Math.ceil(Math.random() * 2);
    coins = Math.max(0, coins - loss);
    logMsg(`Encounter: Shadow drains you. -${loss} orb${loss === 1 ? '' : 's'}.`);
  }
  
  encounterFeedback(playerPos);
}

// End turn and trigger Cruxflare (unchanged)
function endTurn() {
  buyingBlocked = false;
  
  if (finalDarknessCountdown !== null) {
    finalDarknessCountdown--;
    
    if (finalDarknessCountdown <= 0) {
      logMsg(`Final darkness consumes the dream! Final score: ${fragmentsCollected}/${totalFragments} fragments.`);
      endGame();
      return;
    } else {
      logMsg(`⚫ Final Darkness approaches... ${finalDarknessCountdown} turn${finalDarknessCountdown === 1 ? '' : 's'} remaining! ⚫`);
    }
  }
  
  if (cruxflareDeck.length > 0) {
    let event = cruxflareDeck.shift();
    logCruxflareMsg(event);
    resolveCruxflare(event);
    
    if (finalDarknessCountdown === null) {
      let musicPhase = 'start';
      if (cruxflareDeck.length <= 3) {
        musicPhase = 'danger';
      } else if (cruxflareDeck.length <= 9) {
        musicPhase = 'warning';
      }
      window.MusicManager?.setTrackByPhase(musicPhase);
    }
  } else {
    logMsg(`The dream collapses! You collected ${fragmentsCollected}/${totalFragments} fragments.`);
    endGame();
    return;
  }
  
  updateAllUI();
  
  setTimeout(() => {
    logMsg('Browse the market and buy cards with your orbs.');
    showMarketPhase();
  }, 1500);
}

// Resolve Cruxflare events (unchanged - keeping existing logic)
function resolveCruxflare(event) {
    showCruxflareOverlay(event);
  if (shadowBlocked) {
    shadowBlocked = false;
    logMsg(`Shadow Blocker activated! Cruxflare effect blocked.`);
    return;
  }
  
  if (event.includes('dead card')) {
    discardPile.push("Shadow (dead)");
  }
  
  if (event.includes('Remove cheapest')) {
    removeChepestMarketCard();
  }
  
  if (event.includes('Lose a node') && mapNodes > 3) {
    shrinkMap();
  }
  
  if (event.includes('Discard a random') && playerHand.length > 0) {
    discardRandomCard();
  }
  
  if (event.includes('Lose 2 coins')) {
    coins = Math.max(0, coins - 2);
  }
  
  if (event.includes('Final Darkness')) {
    finalDarknessCountdown = 2;
    
    document.body.classList.add('danger-mode');
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(255, 100, 100, 0.8)';
    hud.style.animation = 'pulse-danger 1.5s infinite';
    
    window.MusicManager?.setTrackByPhase('danger');
    
    logMsg(`Final Darkness descends! The dream will collapse in ${finalDarknessCountdown} turns!`);
  }
  
  if (event.includes('Mist Thickens')) {
    nextCardCostBonus = 1;
    logMsg(`The mist thickens around the market. Next card purchase costs +1 orb.`);
  }
  
  if (event.includes('Dream Tremor') && playerDeck.length > 0) {
    const randomIndex = Math.floor(Math.random() * playerDeck.length);
    const lostCard = playerDeck.splice(randomIndex, 1)[0];
    logMsg(`Dream tremor causes ${lostCard} to fade from existence permanently.`);
  }
  
  if (event.includes('Shadow Whisper')) {
    buyingBlocked = true;
    logMsg(`Shadow whispers cloud your judgment. You cannot buy cards this turn.`);
  }
  
  if (event.includes('Void Echo') && playerPos > 0) {
    playerPos = Math.max(0, playerPos - 1);
    logMsg(`Void echoes pull you backward 1 space.`);
    renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
  }

  if (event.includes('Time Fracture')) {
  skipNextDraw = true;
  logMsg(`Time fracture disrupts the dream flow. Next hand draw skipped.`);
}
  
  if (event.includes('Reality Warp') && playerHand.length > 0) {
    playerDeck.push(...playerHand);
    playerHand = [];
    for (let i = playerDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
    }
    logMsg(`Reality warps! Your hand cards dissolve back into the deck.`);
  }
}

// Rest of the functions remain unchanged...
function removeChepestMarketCard() {
  if (marketRow.length > 0) {
    marketRow.sort((a, b) => a.cost - b.cost);
    const removed = marketRow.shift();
    logMsg(`${removed.name} vanishes from the market.`);
    drawMarketCard();
  }
}

function shrinkMap() {
  mapNodes -= 1;
  if (playerPos >= mapNodes) playerPos = mapNodes - 1;
  
  const lostFragments = fragmentPositions.filter(pos => pos >= mapNodes);
  fragmentPositions = fragmentPositions.filter(pos => pos < mapNodes);
  
  lostFragments.forEach(() => {
    const safePositions = [];
    for (let i = 1; i < mapNodes; i++) {
      if (!fragmentPositions.includes(i) && !encounterPositions.includes(i) && i !== playerPos) {
        safePositions.push(i);
      }
    }
    if (safePositions.length > 0) {
      const newPos = safePositions[Math.floor(Math.random() * safePositions.length)];
      fragmentPositions.push(newPos);
      logMsg(`A fragment shifts to node ${newPos} as reality warps.`);
    }
  });
  
  encounterPositions = encounterPositions.filter(pos => pos < mapNodes);
}

function discardRandomCard() {
  let rand = Math.floor(Math.random() * playerHand.length);
  let discarded = playerHand.splice(rand, 1)[0];
  discardPile.push(discarded);
  logMsg(`Lost ${discarded} from hand.`);
}

function endGame() {
  toggleSectionHeaders(false);
  hideElement('end-turn-btn');
  
  const isWin = fragmentsCollected >= totalFragments;
  showGameOverScreen(isWin, fragmentsCollected, totalFragments);
  showElement('restart-btn');
}

function restartGame() {
  toggleSectionHeaders(true);
  clearGameAreas();
  clearElement('game-over-container');
  showElement('end-turn-btn');
  window.MusicManager?.setTrackByPhase('start');
  initGame();
}

// ========== SIMPLIFIED UPDATE ALL UI ==========
function updateAllUI() {
  updateHUD(coins, fragmentsCollected, cruxflareDeck, finalDarknessCountdown);
  updateMistOverlay(cruxflareDeck);
  renderMarket(marketRow, coins, buyCard);
  renderHand(playerHand, playCard); // Simple render, no state preservation needed
  renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
}

// Make functions globally available
window.endTurn = endTurn;
window.restartGame = restartGame;
window.drawNewHand = drawNewHand;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);
