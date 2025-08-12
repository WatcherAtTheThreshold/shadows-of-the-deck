# 🌌 Shadows of the Deck – Core Gameplay Overview

This document outlines the fundamental systems, components, and flow of the game as they currently exist.  
It's intended as a **big-picture map** so you can more easily see where changes, additions, or refinements might happen.

**Current Version:** 18-Node Expansion (v1.1)

---

## 🎴 Deck & Hand System

**Purpose:**  
The deck system is the player's main source of actions and strategy.  

**Core Mechanics:**
1. **Starting Deck:** Player begins with 10 basic cards (7× Focus +1, 3× Move +1)
2. **Hand Size:** Maximum 5 cards at any time
3. **Draw Phase:** At start of turn, draw random cards from deck up to hand limit
4. **Card Play:** Player selects cards from hand to:
   - Gain resources (orbs)
   - Move across the map
   - Trigger special effects
5. **Discard System:** Played cards go to discard pile
6. **Deck Cycling:** When draw deck is empty, shuffle discard pile to form new deck

**Market Interaction:**
- **Market Row:** 5 cards available for purchase using orbs
- **Market Deck:** 28 total cards with various costs (2-8 orbs)
- **Purchased cards** go to discard pile, becoming available on future turns
- **Dynamic Market:** Cards can be removed by Cruxflare events
- **Market Refill:** Immediately replaced when cards are bought

---

## 🌩️ Cruxflare Deck Mechanic

**Purpose:**  
Acts as a countdown timer and escalating threat system.

**Core System:**
1. **Cruxflare Deck Setup:** 19 event cards shuffled at game start
2. **End of Turn Trigger:** Reveal top Cruxflare card after each turn
3. **Event Categories:**
   - **Resource Denial:** Lose coins, cards, or purchasing ability
   - **Deck Manipulation:** Add dead cards, remove cards permanently
   - **Map Changes:** Shrink map, move player backward
   - **Hand Disruption:** Discard cards, shuffle hand into deck
   - **Market Disruption:** Remove cheapest cards, increase costs
   - **Game Enders:** Final countdown effects

**Escalation System:**
- **Visual Feedback:** UI changes color as deck depletes
- **Music Progression:** Atmospheric tracks intensify with danger
- **Threshold Effects:**
  - ≤7 cards: Warning mode (purple mist)
  - ≤2 cards: Danger mode (red mist, pulsing HUD)

**Player Defenses:**
- **Shadow Blocker:** Negates any one Cruxflare effect
- **Spirit Guide:** Provides protection from next Cruxflare
- **Dream Sight:** Previews upcoming Cruxflare event

---

## 🗺️ Node-Based "Dream Map"

**Purpose:**  
Represents the dream world for fragment collection and navigation.

**Map Structure (18-Node Expansion):**
- **Total Nodes:** 18 (positions 0-17)
- **Starting Position:** Node 0
- **Linear Progression:** Move forward through numbered nodes
- **Dynamic Rendering:** Map updates each turn to show current state

**Node Types & Distribution:**
- **🟢 Safe Nodes:** Empty spaces with no immediate effects
- **🟡 Fragment Nodes:** 7 total at positions [2, 5, 7, 10, 12, 15, 17]
- **🟣 Encounter Nodes:** 6 total at positions [3, 6, 8, 11, 13, 16]
- **📍 Player Position:** Cyan marker showing current location

**Map Dynamics:**
- **Node Removal:** Cruxflare can shrink map (minimum 3 nodes)
- **Fragment Preservation:** Lost fragments relocate to safe positions
- **Encounter Cleanup:** Encounters beyond map boundaries are removed
- **Backward Movement:** Some Cruxflare effects can push player back

**Encounter System:**
- **Treasure (60% chance):** Gain 2-4 orbs
- **Shadow Drain (40% chance):** Lose 1-2 orbs  
- **Visual Feedback:** Enhanced animations and log effects

---

## 🔄 Turn Structure

Each player turn follows this structured loop:

### **1. Start Phase**
- Draw cards up to hand size (5 maximum)
- Reset turn-based restrictions (buying blocks, etc.)
- Evaluate persistent effects (fragment boosts, cost modifiers)

### **2. Action Phase**
- **Play Cards:** Use any number of cards from hand
  - Immediate effects resolve (orbs, movement, special abilities)
  - Cards move to discard pile
- **Resolve Movement:**
  - Collect fragments if landed on fragment node
  - Trigger encounters if landed on encounter node (unless safe movement)
  - Update map display

### **3. Market Phase**
- **Purchase Cards:** Spend orbs to buy from market row
  - Apply cost modifiers (Mist Thickens +1 orb)
  - Check purchase restrictions (Shadow Whisper blocks buying)
  - Purchased cards go to discard pile
- **Market Refill:** Replace bought cards immediately

### **4. End Phase**
- **Cruxflare Resolution:** Reveal and resolve top Cruxflare card
  - Check for Shadow Blocker protection
  - Apply negative effects
  - Update game state accordingly
- **Win/Loss Check:** Evaluate game ending conditions
- **UI Updates:** Refresh all displays and atmospheric effects

---

## 🏆 Victory & Defeat Conditions

**Victory Requirements:**
- Collect all 7 fragments scattered across the dream map
- Fragments are collected automatically when landing on their nodes
- **Fragment Boost** cards can make single fragments worth multiple points

**Defeat Conditions:**
- **Cruxflare Exhaustion:** The 19-card Cruxflare deck runs out
- **Final Darkness:** Specific Cruxflare event triggers game-ending countdown
- **Map Collapse:** Potential future fail state if map shrinks too much

**Scoring System:**
- Primary metric: Fragments collected vs. total available
- Win condition: 7/7 fragments
- Partial success: Any fragments collected before defeat

---

## 🎯 Current Design Philosophy

**Core Tensions:**
- **Resource Management:** Balancing orb gain with movement and defensive plays
- **Time Pressure:** Market growth vs. Cruxflare countdown creates urgency
- **Risk Assessment:** Safe movement vs. encounter rewards
- **Deck Building:** Starting deck efficiency vs. market card power

**Pacing Design:**
- **Early Game (Turns 1-6):** Learning phase, basic resource building
- **Mid Game (Turns 7-12):** Strategic depth, market investment decisions  
- **Late Game (Turns 13-19):** High tension, critical decision making
- **Endgame (Final turns):** Desperate optimization and calculated risks

**Replayability Factors:**
- **Randomized Elements:** Deck shuffling, encounter outcomes, Cruxflare order
- **Strategic Variety:** Multiple viable approaches to fragment collection
- **Market Variation:** Different card availability each game
- **Dynamic Challenges:** Map changes and Cruxflare effects create unique situations

---

## 🔧 Technical Architecture

**File Structure:**
- **game.js:** Core game logic and state management
- **cards.js:** Card definitions, effects, and deck creation
- **ui.js:** Rendering, animations, and user interface
- **music.js:** Atmospheric audio and dynamic music system
- **intro.js:** Tutorial system and new player onboarding

**State Management:**
- **Game State:** Tracks all game variables and conditions
- **Turn State:** Manages temporary effects and restrictions
- **UI State:** Handles visual feedback and animations

**Effect System:**
- **Card Effects:** Modular system for different card abilities
- **Cruxflare Effects:** Event-driven negative effects
- **Persistent Effects:** Multi-turn impacts and conditions

---

## 🚀 Expansion Areas & Future Development

**Potential Short-Term Enhancements:**
- **Balance Refinements:** Cost adjustments, effect tuning
- **Visual Polish:** Enhanced animations, particle effects
- **Audio Expansion:** More atmospheric tracks, sound effects
- **Tutorial Improvements:** Better onboarding experience

**Medium-Term Expansion Ideas:**
- **Fragment Types:** Different fragment values or special properties
- **Alternative Win Conditions:** Multiple paths to victory
- **Player Abilities:** Persistent upgrades or special powers
- **Event Variety:** More diverse Cruxflare effects

**Long-Term Vision:**
- **Map Variants:** Branching paths, multiple route options
- **Campaign Mode:** Progressive difficulty with unlockables
- **Multiplayer Elements:** Competitive or cooperative variants
- **Procedural Content:** Generated maps, cards, or events

---

*Last Updated: 18-Node Expansion Implementation*  
*Document Version: 1.1*
