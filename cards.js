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
  'Fragment 2pts': { type: 'special', effect: 'fragment_boost', value: 2 },
  'Ethereal Leap': { type: 'special', effect: 'jump_to_fragment' },
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
      return `Gain ${effect.value} orb${effect.value === 1 ? '' : 's'} when played`;
    case 'move': 
      return `Move ${effect.value} spaces on the map`;
    case 'move_safe': 
      return `Move ${effect.value} spaces, skip encounters`;
    case 'special':
      switch (effect.effect) {
        case 'lucky_find': 
          return "Gain 1-3 random orbs";
        case 'shadow_block': 
          return "Block the next Cruxflare effect";
        case 'dream_sight': 
          return "Look at top Cruxflare card";
        case 'fragment_boost': 
          return `Next fragment collected counts as ${effect.value}`;
        case 'jump_to_fragment':
          return "Teleport to the next uncollected fragment";
        case 'replay_last': 
          return "Replay your last played card";
        case 'move_and_coin': 
          return `Move ${effect.move} spaces, gain ${effect.coins} orb`;
        case 'coin_and_draw': 
          return `Gain ${effect.coins} orbs, draw 1 card`;
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
    { name: "Fragment 2pts", cost: 5 },
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

// Cruxflare events deck - Final Darkness relegated to end game
export function createCruxflareDeck() {
  // All events EXCEPT Final Darkness
  const regularEvents = [
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
    // New expansion events
    "Mist Thickens: Next card costs +1 orb.",
    "Dream Tremor: Lose 1 card from deck permanently.",
    "Shadow Whisper: Cannot buy cards this turn.",
    "Void Echo: Move back 1 space if possible.",
    "Reality Warp: Shuffle hand into deck."
  ];
  
  // Shuffle the regular events (18 cards)
  const shuffledRegular = shuffleArray(regularEvents);
  
  // Add Final Darkness to one of the last 3 positions randomly
  const finalDarknessPosition = Math.floor(Math.random() * 3); // 0, 1, or 2
  const finalDeck = [...shuffledRegular];
  finalDeck.splice(16 + finalDarknessPosition, 0, "Final Darkness: Game ends in 2 turns.");
  
  return finalDeck;
}

// ========== CRUXFLARE EVENT MAPPING ==========

// Map Cruxflare event names to icons from iconCardList.md
const CRUXFLARE_ICONS = {
  'Shadow Surge': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Corruption Pulse': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Dream Collapse': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Sudden Eclipse': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Void Whisper': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Time Fracture': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Memory Drain': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Reality Shift': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Final Darkness': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Mist Thickens': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Dream Tremor': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Shadow Whisper': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Void Echo': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">',
  'Reality Warp': '<img src="images/icons/crux-icon-48.png" width="48" height="48" alt="Crux">'
};

// Extract event name and description from Cruxflare event string
export function parseCruxflareEvent(eventString) {
  // Event format: "Shadow Surge: Add a dead card to discard."
  const parts = eventString.split(':');
  
  if (parts.length >= 2) {
    const eventName = parts[0].trim();
    const eventDescription = parts[1].trim();
    const icon = CRUXFLARE_ICONS[eventName] || '⚡'; // Default lightning bolt
    
    return {
      name: eventName,
      description: eventDescription,
      icon: icon
    };
  }
  
  // Fallback for unexpected formats
  return {
    name: 'Unknown Event',
    description: eventString,
    icon: '⚡'
  };
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
