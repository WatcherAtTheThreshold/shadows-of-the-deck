// Card Effects Database
export const CARD_EFFECTS = {
  'Focus +1': { type: 'coins', value: 1 },
  'Focus +2': { type: 'coins', value: 2 },
  'Focus +3': { type: 'coins', value: 3 },
  'Focus +4': { type: 'coins', value: 4 },
  'Focus +5': { type: 'coins', value: 5 },
  'Move +1': { type: 'move', value: 1 },
  'Move +2': { type: 'move', value: 2 },
  'Move +3': { type: 'move', value: 3 },
  'Swift Step': { type: 'move_safe', value: 1 },
  'Void Step': { type: 'move_safe', value: 2 },
  'Shadow Walk': { type: 'move_safe', value: 3 },
  'Lucky Find': { type: 'special', effect: 'lucky_find' },
  'Shadow Blocker': { type: 'special', effect: 'shadow_block' },
  'Dream Sight': { type: 'special', effect: 'dream_sight' },
  'Fragment 3pts': { type: 'special', effect: 'fragment_boost', value: 3 },
  'Coin Burst': { type: 'coins', value: 3 },
  'Astral Drift': { type: 'move', value: 4 },
  'Dream Echo': { type: 'special', effect: 'replay_last' },
  'Mist Walker': { type: 'special', effect: 'move_and_coin', move: 2, coins: 1 },
  'Phantom Step': { type: 'move', value: 2 },
  'Essence Tap': { type: 'special', effect: 'coin_and_draw', coins: 2 },
  'Spirit Guide': { type: 'special', effect: 'move_and_protect', move: 3 }
};

// Generate tooltips for cards
export function generateTooltip(cardName) {
  const effect = CARD_EFFECTS[cardName];
  if (!effect) return "Basic card";
  
  switch (effect.type) {
    case 'coins': 
      return `Gain ${effect.value} coins when played`;
    case 'move': 
      return `Move ${effect.value} spaces on the map`;
    case 'move_safe': 
      return `Move ${effect.value} spaces, skip encounters`;
    case 'special':
      switch (effect.effect) {
        case 'lucky_find': 
          return "Gain 1-3 random coins";
        case 'shadow_block': 
          return "Block the next Cruxflare effect";
        case 'dream_sight': 
          return "Look at top Cruxflare card";
        case 'fragment_boost': 
          return `Next fragment collected counts as ${effect.value}`;
        case 'replay_last': 
          return "Replay your last played card";
        case 'move_and_coin': 
          return `Move ${effect.move} spaces, gain ${effect.coins} coin`;
        case 'coin_and_draw': 
          return `Gain ${effect.coins} coins, draw 1 card`;
        case 'move_and_protect': 
          return `Move ${effect.move} spaces, avoid next Cruxflare`;
        default: 
          return "Special effect";
      }
    default: 
      return "Basic card";
  }
}

// Create and shuffle the market deck
export function createMarketDeck() {
  const marketCards = [
    { name: "Focus +2", cost: 3 },
    { name: "Move +2", cost: 4 },
    { name: "Fragment 3pts", cost: 5 },
    { name: "Shadow Blocker", cost: 4 },
    { name: "Focus +3", cost: 5 },
    { name: "Move +3", cost: 6 },
    { name: "Swift Step", cost: 3 },
    { name: "Dream Sight", cost: 4 },
    { name: "Focus +4", cost: 7 },
    { name: "Ethereal Leap", cost: 5 },
    
    // Additional cards to fill out the deck
    { name: "Focus +2", cost: 3 },
    { name: "Move +2", cost: 4 },
    { name: "Void Step", cost: 4 },
    { name: "Focus +3", cost: 5 },
    { name: "Shadow Walk", cost: 6 },
    { name: "Coin Burst", cost: 3 },
    { name: "Focus +5", cost: 8 },
    { name: "Astral Drift", cost: 7 },
    { name: "Lucky Find", cost: 2 },
    { name: "Focus +2", cost: 3 },
    { name: "Move +1", cost: 2 },
    { name: "Dream Echo", cost: 6 },
    { name: "Mist Walker", cost: 5 },
    { name: "Focus +3", cost: 5 },
    { name: "Phantom Step", cost: 4 },
    { name: "Essence Tap", cost: 4 },
    { name: "Move +2", cost: 4 },
    { name: "Spirit Guide", cost: 6 }
  ];
  
  // Add tooltips to market cards
  const cardsWithTooltips = marketCards.map(card => ({
    ...card,
    tooltip: generateTooltip(card.name)
  }));
  
  // Shuffle the deck
  return shuffleArray(cardsWithTooltips);
}

// Get starting player deck
export function createPlayerDeck() {
  return [
    "Focus +1", "Focus +1", "Focus +1", "Focus +1", "Focus +1", 
    "Focus +1", "Focus +1", "Move +1", "Move +1", "Move +1"
  ];
}

// Cruxflare events deck
export function createCruxflareDeck() {
  return [
    "Shadow Surge: Add a dead card to discard.",
    "Corruption Pulse: Remove cheapest market card.",
    "Dream Collapse: Lose a node on the map.",
    "Sudden Eclipse: Discard a random card from hand.",
    "Void Whisper: Lose 2 coins.",
    "Time Fracture: Skip next card draw.",
    "Shadow Surge: Add a dead card to discard.",
    "Corruption Pulse: Remove cheapest market card.", 
    "Dream Collapse: Lose a node on the map.",
    "Sudden Eclipse: Discard a random card from hand.",
    "Memory Drain: Shuffle a card from hand into deck.",
    "Reality Shift: Rearrange fragment positions.",
    "Shadow Surge: Add a dead card to discard.",
    "Final Darkness: Game ends in 2 turns."
  ];
}

// Utility function to shuffle arrays
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}