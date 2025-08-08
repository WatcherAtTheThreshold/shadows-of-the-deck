
import IntroTutorial from './intro.js';
import { CARD_EFFECTS, createMarketDeck, createPlayerDeck, createCruxflareDeck } from './cards.js';
// ... rest of your imports
import { 
  createParticles, renderMarket, renderHand, renderMap, updateHUD, 
  updateMistOverlay, logMsg, cardPlayFeedback, encounterFeedback,
  toggleSectionHeaders, clearGameAreas, showGameOverScreen, 
  showElement, hideElement, clearElement 
} from './ui.js';

// ---- music phase helpers (game.js) ----
function pickMusicPhase() {
  // adjust to your real state
  const cruxLeft = (window.cruxflareDeck?.length ?? 0);
  const isDangerMode = document.body.classList.contains('danger-mode');

  if (cruxLeft <= 2) return 'danger';
  if (isDangerMode) return 'warning';
  return 'start';
}

function updateMusicPhase() {
  const phase = pickMusicPhase();
  // call into music.js
  window.MusicManager?.setTrackByPhase(phase);
}


// Game state variables
let marketDeck, playerDeck, discardPile, playerHand, marketRow, mapNodes, playerPos, 
    fragmentPositions, fragmentsCollected, totalFragments, cruxflareDeck, coins, 
    encounterPositions, shadowBlocked, lastPlayedCard, fragmentBoostActive;

// Initialize game data
function setupGameData() {
  marketDeck = createMarketDeck();
  playerDeck = createPlayerDeck();
  
  // Randomize starting deck
  for (let i = playerDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
  }
  
  discardPile = [];
  playerHand = [];
  marketRow = [];
  mapNodes = 12;
  playerPos = 0;
  fragmentPositions = [3, 5, 7, 9, 11];
  fragmentsCollected = 0;
  totalFragments = fragmentPositions.length;
  encounterPositions = [2, 4, 6, 8, 10];
  shadowBlocked = false;
  lastPlayedCard = null;
  fragmentBoostActive = null;
  cruxflareDeck = createCruxflareDeck();
  coins = 3;
}

// Initialize the game
function initGame() {
  setupGameData();
  createParticles();
  document.body.classList.remove('danger-mode');
  hideElement('restart-btn');
  
  // Set up initial market
  for (let i = 0; i < 5; i++) { 
    drawMarketCard(); 
  }
  
  // Initial draws and renders
  drawHand();
  updateAllUI();
  
  // Start music system
  // musicManager.startGame();
  
  // Start tutorial for new players
  const tutorial = new IntroTutorial();
  setTimeout(() => {
    if (!tutorial.start()) {
      logMsg('Welcome to the game!');
    }
  }, 800);
}

// Draw a card from market deck to market row
function drawMarketCard() {
  if (marketDeck.length > 0) {
    marketRow.push(marketDeck.shift());
  }
}

// Draw cards to player hand - NOW WITH RANDOM DRAWING
function drawHand() {
  while (playerHand.length < 5 && playerDeck.length > 0) {
    // Draw random card from deck instead of always taking from front
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

// Handle buying a card from market
function buyCard(marketIndex) {
  const cardObj = marketRow[marketIndex];
  if (coins >= cardObj.cost) {
    coins -= cardObj.cost;
    logMsg(`Bought ${cardObj.name}`);
    discardPile.push(cardObj.name);
    marketRow.splice(marketIndex, 1);
    drawMarketCard();
    updateAllUI();
  } else {
    logMsg(`Not enough orbs to buy ${cardObj.name}`);
  }
}

// Play a card from hand
function playCard(card, index) {
  const effect = CARD_EFFECTS[card];
  let message = `Played ${card}`;
  
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
  
  if (card !== 'Dream Echo') {
    lastPlayedCard = card;
  }
  logMsg(message);
  
  // Move card to discard
  discardPile.push(card);
  playerHand.splice(index, 1);
  
  updateAllUI();
}

// Handle special card effects
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
        // Find the nearest fragment position ahead of player, or wrap to first
        const nextFragment = fragmentPositions.find(pos => pos > playerPos) || fragmentPositions[0];
        // Use movePlayer with skipEncounters to teleport safely
        const oldPos = playerPos;
        playerPos = nextFragment;
        movePlayer(0, true); // This will trigger fragment collection if landing on one
        return `Leaped from node ${oldPos} to fragment at node ${nextFragment}!`;
      }
      return `No fragments remaining to leap to`;
      
 case 'replay_last':
  if (lastPlayedCard && CARD_EFFECTS[lastPlayedCard] && lastPlayedCard !== 'Dream Echo') {
    // Use requestAnimationFrame to ensure proper timing
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
    // Handle special effects carefully to avoid problematic double-effects
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
          playerHand.push(playerDeck.shift());
          logMsg(`Dream Echo: Gained ${lastEffect.coins} more orbs, drew 1 more card`);
        } else {
          logMsg(`Dream Echo: Gained ${lastEffect.coins} more orbs, deck empty`);
        }
        break;
      default:
        logMsg(`Dream Echo: Cannot replay ${lastPlayedCard} (special effect not repeatable)`);
    }
  }
  
  updateAllUI();
}

// Move player on the map
function movePlayer(steps, skipEncounters = false) {
  playerPos = Math.min(playerPos + steps, mapNodes - 1);
  
  // Check for fragment collection
  if (fragmentPositions.includes(playerPos)) {
    collectFragment();
  }
  
  // Check for encounters
  if (encounterPositions.includes(playerPos) && !skipEncounters) {
    triggerEncounter();
  }
  
  renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
}

// Collect a fragment
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

// Trigger random encounter
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

// End turn and trigger Cruxflare
function endTurn() {
  if (cruxflareDeck.length > 0) {
    let event = cruxflareDeck.shift();
    logMsg(`Cruxflare: ${event}`);
    resolveCruxflare(event);
  } else {
    logMsg(`The dream collapses! You collected ${fragmentsCollected}/${totalFragments} fragments.`);
    endGame();
  }
  drawHand();
  updateAllUI();
  updateMusicPhase();
}

// Resolve Cruxflare events
function resolveCruxflare(event) {
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
    setTimeout(() => {
      logMsg(`Final darkness consumes the dream! Final score: ${fragmentsCollected}/${totalFragments} fragments.`);
      endGame();
    }, 3000);
  }
}

// Remove cheapest card from market
function removeChepestMarketCard() {
  if (marketRow.length > 0) {
    marketRow.sort((a, b) => a.cost - b.cost);
    const removed = marketRow.shift();
    logMsg(`${removed.name} vanishes from the market.`);
    drawMarketCard();
  }
}

// Shrink the map by removing a node
function shrinkMap() {
  mapNodes -= 1;
  if (playerPos >= mapNodes) playerPos = mapNodes - 1;
  
  // Preserve fragments when nodes are destroyed
  const lostFragments = fragmentPositions.filter(pos => pos >= mapNodes);
  fragmentPositions = fragmentPositions.filter(pos => pos < mapNodes);
  
  // Move lost fragments to random safe positions
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

// Discard a random card from hand
function discardRandomCard() {
  let rand = Math.floor(Math.random() * playerHand.length);
  let discarded = playerHand.splice(rand, 1)[0];
  discardPile.push(discarded);
  logMsg(`Lost ${discarded} from hand.`);
}

// End the game
function endGame() {
  toggleSectionHeaders(false);
  // clearGameAreas(); // ← Remove this line to keep cards visible
  hideElement('end-turn-btn');
  
  const isWin = fragmentsCollected >= totalFragments;
  showGameOverScreen(isWin, fragmentsCollected, totalFragments);
  showElement('restart-btn');
}

// Restart the game
function restartGame() {
  toggleSectionHeaders(true);
  clearGameAreas(); // ← Move the clear here instead
  clearElement('game-over-container');
  showElement('end-turn-btn');
  updateMusicPhase();
  initGame();
}

// Update all UI elements
function updateAllUI() {
  updateHUD(coins, fragmentsCollected, cruxflareDeck);
  updateMistOverlay(cruxflareDeck);
  renderMarket(marketRow, coins, buyCard);
  renderHand(playerHand, playCard);
  renderMap(mapNodes, playerPos, fragmentPositions, encounterPositions);
  
  // Update music based on game state
if (cruxflareDeck.length <= 2) {
  setTrackByPhase('danger');
} else if (document.body.classList.contains('danger-mode')) {
  setTrackByPhase('warning');
} else {
  setTrackByPhase('start');
}
}
// Make functions globally available for HTML onclick
window.endTurn = endTurn;
window.restartGame = restartGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);
