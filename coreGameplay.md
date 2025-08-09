# 🌌 Shadows of the Deck – Core Gameplay Overview

This document outlines the fundamental systems, components, and flow of the game as they currently exist.  
It’s intended as a **big-picture map** so you can more easily see where changes, additions, or refinements might happen.

---

## 🎴 Deck & Hand System

**Purpose:**  
The deck system is the player’s main source of actions and strategy.  

**Flow:**
1. **Starting Deck:** Player begins with a fixed set of basic cards (e.g., `Focus +1`, `Move +1`).
2. **Draw Phase:** At the start of the turn, draw cards up to the maximum hand size (usually 5).
3. **Card Play:** Player selects cards from hand to:
   - Gain resources (orbs).
   - Move across the map.
   - Trigger special effects.
4. **Discard:** Played cards go to the discard pile.
5. **Shuffle:** When the draw deck is empty, shuffle the discard pile to form a new deck.

**Market Interaction:**
- A **market row** of cards is available for purchase using orbs.
- Purchased cards go to the discard pile, becoming available on future turns.
- The market is dynamic—cards can be removed by Cruxflare events.

---

## 🌩️ Cruxflare Deck Mechanic

**Purpose:**  
Acts as a countdown timer and escalating threat system.

**Flow:**
1. **Cruxflare Deck Setup:** A separate deck of event cards is shuffled at the start.
2. **End of Turn Trigger:** At the end of each turn, reveal the top Cruxflare card.
3. **Event Resolution:** Each card contains a negative or game-changing effect (e.g., remove market cards, shrink map, end the game in X turns).
4. **Danger Escalation:**  
   - As the deck gets smaller, the music and UI change to reflect increased danger.
   - Certain thresholds (e.g., ≤2 cards) trigger a “danger phase.”

**Player Tools:**
- Some player cards (e.g., `Shadow Blocker`, `Spirit Guide`) can negate or delay Cruxflare effects.

---

## 🗺️ Node-Based “Dream Map”

**Purpose:**  
Represents the dream world the player navigates to collect fragments and avoid hazards.

**Structure:**
- A fixed number of **nodes** connected in sequence.
- Player position is tracked as a numeric node index.
- Map is dynamically rendered each turn.

**Node Types:**
- **⚪ Focus Points:** Safe spaces that offer no immediate effect.
- **🟡 Fragments:** Collectibles required to win the game.
- **🟣 Encounters:** Chance-based events—either beneficial (coins) or harmful (orb loss).

**Map Dynamics:**
- Nodes can be **removed** (shrink map) by Cruxflare events.
- Fragments may be **relocated** to safe positions when nodes disappear.

---

## 🔄 Turn Structure

Each player turn follows a consistent loop:

1. **Start Phase**
   - Draw up to hand size.
   - Evaluate any persistent effects (e.g., fragment boost).

2. **Action Phase**
   - Play one or more cards from hand.
   - Cards may:
     - Gain orbs.
     - Move the player across the map.
     - Trigger special actions.
   - Resolve movement:
     - Collect fragments if landed on.
     - Resolve encounters if landed on.

3. **Purchase Phase**
   - Spend orbs to buy cards from the market.
   - Market immediately refills from the market deck.

4. **End Phase**
   - Reveal top Cruxflare card.
   - Resolve its effect.
   - Check win/loss conditions.

---

## 🏆 Win & Loss Conditions

**Win:**
- Collect all available fragments on the map.

**Loss:**
- The Cruxflare deck is exhausted and the “Final Darkness” triggers.
- Optional: Additional fail states could be added (e.g., running out of orbs entirely).

---

## 🎯 Current Design Notes

- **Core tension:** Balancing resource gain (orbs) with movement and defensive plays.
- **Pacing:** Market growth vs. Cruxflare escalation drives urgency.
- **Replayability:** Deck shuffle randomness and dynamic market create variation each run.
- **Potential Expansion Areas:**
  - More fragment/encounter types.
  - Alternate win conditions.
  - Player abilities or persistent upgrades.
  - Map variation (branching paths, alternate layouts).

