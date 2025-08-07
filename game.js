import { CARD_EFFECTS, generateTooltip, createMarketDeck, createPlayerDeck, createCruxflareDeck } from './cards.js';

// Game state variables
let marketDeck, playerDeck, discardPile, playerHand, marketRow, mapNodes, playerPos, 
    fragmentPositions, fragmentsCollected, totalFragments, cruxflareDeck, coins, 
    encounterPositions, shadowBlocked, lastPlayedCard, fragmentBoostActive;

// Initialize game data
function setupGameData() {
  marketDeck = createMarketDeck();
  playerDeck = createPlayerDeck();
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
  updateHUD();
}

// Initialize the game
function initGame() {
  setupGameData();
  createParticles();
  document.body.classList.remove('danger-mode');
  document.getElementById('restart-btn').style.display = 'none';
  
  for (let i = 0; i < 5; i++) { 
    drawMarketCard(); 
  }
  renderMarket();
  drawHand();
  renderHand();
  renderMap();
  updateMistOverlay();
}

// Create floating particles
function createParticles() {
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

// Draw a card from market deck to market row
function drawMarketCard() {
  if (marketDeck.length > 0) {
    marketRow.push(marketDeck.shift());
  }
}

// Draw cards to player hand
function drawHand() {
  while (playerHand.length < 5 && playerDeck.length > 0) {
    playerHand.push(playerDeck.shift());
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

// Render market cards
function renderMarket() {
  let m = document.getElementById('market');
  m.innerHTML = '';
  marketRow.forEach((cardObj, i) => {
    let el = document.createElement('div');
    el.className = 'card tooltip';
    el.setAttribute('data-tooltip', cardObj.tooltip);
    el.innerHTML = `<div>${cardObj.name}</div><div class='cost'>Cost: ${cardObj.cost}</div>`;
    el.onclick = () => {
      if (coins >= cardObj.cost) {
        coins -= cardObj.cost;
        logMsg(`Bought ${cardObj.name}`);
        discardPile.push(cardObj.name);
        marketRow.splice(i, 1);
        drawMarketCard();
        renderMarket();
        updateHUD();
      } else {
        logMsg(`Not enough coins to buy ${cardObj.name}`);
      }
    };
    m.appendChild(el);
  });
}

// Render player hand
function renderHand() {
  let h = document.getElementById('player-hand');
  h.innerHTML = '';
  playerHand.forEach((card, i) => {
    let el = document.createElement('div');
    el.className = 'card tooltip';
    el.setAttribute('data-tooltip', generateTooltip(card));
    el.textContent = card;
    el.onclick = () => {
      playCard(card, i);
    };
    h.appendChild(el);
  });
}

// Play a card from hand
function playCard(card, index) {
  const effect = CARD_EFFECTS[card];
  let message = `Played ${card}`;
  
  if (effect) {
    switch (effect.type) {
      case 'coins':
        coins += effect.value;
        message += ` - Gained ${effect.value} coins`;
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
        switch (effect.effect) {
          case 'lucky_find':
            let gain = Math.ceil(Math.random() * 3);
            coins += gain;
            message += ` - Found ${gain} coins!`;
            break;
            
          case 'shadow_block':
            shadowBlocked = true;
            message += ` - Next Cruxflare blocked!`;
            break;
            
          case 'dream_sight':
            if (cruxflareDeck.length > 0) {
              message += ` - Next Cruxflare: ${cruxflareDeck[0]}`;
            }
            break;
            
          case 'fragment_boost':
            fragmentBoostActive = effect.value;
            message += ` - Next fragment worth ${effect.value} points!`;
            break;
            
          case 'replay_last':
            if (lastPlayedCard && CARD_EFFECTS[lastPlayedCard]) {
              message += ` - Replaying ${lastPlayedCard}`;
              setTimeout(() => {
                const lastEffect = CARD_EFFECTS[lastPlayedCard];
                if (lastEffect.type === 'coins') {
                  coins += lastEffect.value;
                  logMsg(`Dream Echo: Gained ${lastEffect.value} more coins`);
                  updateHUD();
                } else if (lastEffect.type === 'move') {
                  movePlayer(lastEffect.value);
                  logMsg(`Dream Echo: Moved ${lastEffect.value} more spaces`);
                }
              }, 500);
            } else {
              message += ` - No previous card to replay`;
            }
            break;
            
          case 'move_and_coin':
            movePlayer(effect.move);
            coins += effect.coins;
            message += ` - Moved ${effect.move}, gained ${effect.coins} coin`;
            break;
            
          case 'coin_and_draw':
            coins += effect.coins;
            if (playerDeck.length > 0) {
              playerHand.push(playerDeck.shift());
              message += ` - Gained ${effect.coins} coins, drew 1 card`;
            } else {
              message += ` - Gained ${effect.coins} coins, deck empty`;
            }
            break;
            
          case 'move_and_protect':
            movePlayer(effect.move);
            shadowBlocked = true;
            message += ` - Moved ${effect.move} spaces, protected from next Cruxflare`;
            break;
        }
        break;
    }
  }
  
  lastPlayedCard = card;
  logMsg(message);
  
  // Add visual feedback
  const cardEl = event.target;
  cardEl.style.transform = 'scale(1.1)';
  cardEl.style.boxShadow = '0 0 20px rgba(222, 184, 135, 0.8)';
  setTimeout(() => {
    cardEl.style.transform = '';
    cardEl.style.boxShadow = '';
  }, 300);
  
  discardPile.push(card);
  playerHand.splice(index, 1);
  renderHand();
  updateHUD();
}

// Render the map
function renderMap() {
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

// Move player on the map
function movePlayer(steps, skipEncounters = false) {
  playerPos = Math.min(playerPos + steps, mapNodes - 1);
  
  if (fragmentPositions.includes(playerPos)) {
    let fragmentValue = 1;
    
    if (fragmentBoostActive) {
      fragmentValue = fragmentBoostActive;
      fragmentBoostActive = null;
      logMsg(`Fragment boost activated! Gained ${fragmentValue} fragments!`);
    }
    
    fragmentsCollected += fragmentValue;
    fragmentPositions = fragmentPositions.filter(pos => pos !== playerPos);
    updateHUD();
    
    if (fragmentValue === 1) {
      logMsg(`Collected a fragment! Total: ${fragmentsCollected}`);
    }
    
    if (fragmentsCollected >= totalFragments) {
      logMsg(`You collected all fragments! You win!`);
      endGame();
      return;
    }
  }
  
  if (encounterPositions.includes(playerPos) && !skipEncounters) {
    triggerEncounter();
    
    // Visual feedback for encounter
    const nodes = document.querySelectorAll('.node');
    const currentNode = nodes[playerPos];
    if (currentNode) {
      currentNode.style.background = 'rgba(138, 43, 226, 0.8)';
      currentNode.style.transform = 'scale(1.2)';
      setTimeout(() => {
        currentNode.style.background = 'rgba(192, 192, 192, 0.3)';
        currentNode.style.transform = 'scale(1)';
      }, 800);
    }
  }
  
  renderMap();
}

// Trigger random encounter
function triggerEncounter() {
  let roll = Math.random();
  if (roll < 0.6) {
    let gain = Math.ceil(Math.random() * 3) + 1;
    coins += gain;
    logMsg(`Encounter: Found treasure! +${gain} coins.`);
  } else {
    let loss = Math.ceil(Math.random() * 2);
    coins = Math.max(0, coins - loss);
    logMsg(`Encounter: Shadow drains you. -${loss} coins.`);
  }
  updateHUD();
}

// Update HUD display
function updateHUD() {
  document.getElementById('coins').textContent = coins;
  document.getElementById('frags').textContent = fragmentsCollected;
  document.getElementById('crux-remaining').textContent = cruxflareDeck.length;
  updateMistOverlay();
}

// Update mist overlay based on danger level
function updateMistOverlay() {
  if (cruxflareDeck.length <= 7) {
    document.body.classList.add('danger-mode');
  }
  
  if (cruxflareDeck.length <= 2) {
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(255, 100, 100, 0.6)';
  } else if (cruxflareDeck.length <= 4) {
    const hud = document.getElementById('hud');
    hud.style.borderColor = 'rgba(222, 184, 135, 0.6)';
  }
}

// Log message to player
function logMsg(msg) {
  document.getElementById('log').textContent = msg;
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
  renderHand();
  updateHUD();
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
    if (marketRow.length > 0) {
      marketRow.sort((a, b) => a.cost - b.cost);
      const removed = marketRow.shift();
      logMsg(`${removed.name} vanishes from the market.`);
      drawMarketCard();
      renderMarket();
    }
  }
  if (event.includes('Lose a node') && mapNodes > 3) {
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
    renderMap();
  }
  if (event.includes('Discard a random') && playerHand.length > 0) {
    let rand = Math.floor(Math.random() * playerHand.length);
    let discarded = playerHand.splice(rand, 1)[0];
    discardPile.push(discarded);
    logMsg(`Lost ${discarded} from hand.`);
    renderHand();
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

// End the game
function endGame() {
  document.getElementById('market-header').classList.add('hidden');
  document.getElementById('hand-header').classList.add('hidden'); 
  document.getElementById('map-header').classList.add('hidden');
  
  document.getElementById('market').innerHTML = '';
  document.getElementById('player-hand').innerHTML = '';
  document.getElementById('map').innerHTML = '';
  document.getElementById('end-turn-btn').style.display = 'none';
  
  const isWin = fragmentsCollected >= totalFragments;
  const gameOverContainer = document.getElementById('game-over-container');
  
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
  
  gameOverContainer.innerHTML = `
    <div class="game-over-screen">
      <div class="game-over-title">${isWin ? '✧ Victory ✧' : '◯ Dream Lost ◯'}</div>
      <div class="game-over-score">Fragments Collected: ${fragmentsCollected} / ${totalFragments}</div>
      <div class="game-over-flavor">${flavorText}</div>
    </div>
  `;
  
  document.getElementById('restart-btn').style.display = 'inline-block';
}

// Restart the game
function restartGame() {
  document.getElementById('market-header').classList.remove('hidden');
  document.getElementById('hand-header').classList.remove('hidden');
  document.getElementById('map-header').classList.remove('hidden');
  
  document.getElementById('game-over-container').innerHTML = '';
  
  initGame();
  logMsg('Welcome to the game!');
  document.getElementById('end-turn-btn').style.display = 'inline-block';
}

// Make functions globally available
window.endTurn = endTurn;
window.restartGame = restartGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);