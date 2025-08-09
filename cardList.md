# Shadows in the Deck – Card Reference

This document lists all cards currently implemented in the game, grouped by type: **Player Hand (starting deck)**, **Market Deck**, and **Cruxflare Deck**.  
Effects are based on `cards.js` and resolved in `game.js`.

---

## 1. Player Hand (Starting Deck)

| Card Name  | Effect Type | Effect Description |
|------------|-------------|--------------------|
| Focus +1   | coins       | Gain 1 orb |
| Move +1    | move        | Move 1 space on the map |

**Starting Deck Composition:**
- 7 × Focus +1
- 3 × Move +1

---

## 2. Market Deck

| Card Name       | Effect Type   | Effect Description |
|-----------------|--------------|--------------------|
| Focus +2        | coins        | Gain 2 orbs |
| Move +2         | move         | Move 2 spaces |
| Fragment 2pts   | special      | Next fragment collected counts as 2 |
| Shadow Blocker  | special      | Block the next Cruxflare effect |
| Focus +3        | coins        | Gain 3 orbs |
| Move +3         | move         | Move 3 spaces |
| Swift Step      | move_safe    | Move 1 space, skip encounters |
| Dream Sight     | special      | Look at the top Cruxflare card |
| Focus +4        | coins        | Gain 4 orbs |
| Ethereal Leap   | special      | Teleport to the next uncollected fragment |
| Void Step       | move_safe    | Move 2 spaces, skip encounters |
| Shadow Walk     | move_safe    | Move 3 spaces, skip encounters |
| Coin Burst      | coins        | Gain 3 orbs |
| Focus +5        | coins        | Gain 5 orbs |
| Astral Drift    | move         | Move 4 spaces |
| Lucky Find      | special      | Gain 1–3 random orbs |
| Move +1         | move         | Move 1 space |
| Dream Echo      | special      | Replay your last played card |
| Mist Walker     | special      | Move 2 spaces and gain 1 orb |
| Phantom Step    | move         | Move 2 spaces |
| Essence Tap     | special      | Gain 2 orbs and draw 1 card |
| Spirit Guide    | special      | Move 3 spaces and avoid next Cruxflare |

---

## 3. Cruxflare Deck

| Event Name          | Description |
|---------------------|-------------|
| Shadow Surge        | Add a dead card to discard pile |
| Corruption Pulse    | Remove cheapest market card |
| Dream Collapse      | Lose a node on the map |
| Sudden Eclipse      | Discard a random card from hand |
| Void Whisper        | Lose 2 coins |
| Time Fracture       | Skip next card draw |
| Memory Drain        | Shuffle a card from hand into deck |
| Reality Shift       | Rearrange fragment positions |
| Final Darkness      | Game ends in 2 turns |

**Deck Composition:**  
- 3 × Shadow Surge  
- 2 × Corruption Pulse  
- 2 × Dream Collapse  
- 2 × Sudden Eclipse  
- 1 × Void Whisper  
- 1 × Time Fracture  
- 1 × Memory Drain  
- 1 × Reality Shift  
- 1 × Final Darkness  

---

## Notes
- **move_safe** effects let you move without triggering encounters.
- **special** effects have custom handling in `handleSpecialEffect()` inside `game.js`.
- `Dream Echo` cannot replay itself.
- The **starting deck** is fixed, but all other cards must be purchased from the market.

