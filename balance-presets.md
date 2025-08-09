# ⚖️ Shadows of the Deck – Balance Presets

Three tuning presets for different session lengths and difficulty levels.  
These can be used as-is or mixed/matched to suit your design goals.

---

## 🪶 Short / Easy – “The First Dream”

**Intent:**  
Quick runs (10–15 min) with forgiving pacing and more player agency.

**Map**
- **Nodes:** 10–12 total.
- **Fragments:** 3.
- **Encounters:** 20% of nodes.
- **Branching:** None (linear path).

**Market Composition**
- Keep most movement cards but remove *Move +3* **or** *Astral Drift* to prevent over-skipping.
- Add 1–2 extra resource cards (🎯) for faster market growth.

**Cruxflare Deck**
- Size: 8 cards.
- 1 × Final Darkness (last card).
- Fewer map-shrinking effects (Dream Collapse only once).

**Pacing Notes**
- Goal is to let players build a fun deck without much pressure.
- Cruxflare rarely ends the game early.

---

## 🌗 Medium / Standard – “The Waking Path”

**Intent:**  
Balanced core loop (~20 min) where map, market, and Cruxflare all stay competitive.

**Map**
- **Nodes:** 14–16 total.
- **Fragments:** 4.
- **Encounters:** 30% of nodes.
- **Branching:** Occasional forks (2–3 node divergence).

**Market Composition**
- Reduce movement density:
  - Cut *Move +2* and *Void Step*.
  - Keep *Astral Drift* but make it expensive.
- Add 2 new hybrid cards:
  - “Shadow Courier” (Move 2, gain 1 orb).
  - “Foresight Step” (Move 1, look at top Cruxflare card).

**Cruxflare Deck**
- Size: 10 cards.
- 2 × Final Darkness triggers (placed ~3 and 1 turns from end).
- Map-shrinking events appear twice.

**Pacing Notes**
- Resource management matters — you can’t buy every card.
- More tactical choice between movement and market building.

---

## 🩸 Long / Hard – “The Endless Dream”

**Intent:**  
Challenging runs (~30+ min) where the map feels epic and the Cruxflare is relentless.

**Map**
- **Nodes:** 20–22 total.
- **Fragments:** 5–6.
- **Encounters:** 40% of nodes.
- **Branching:** Multiple forks, some dead ends, secret paths.

**Market Composition**
- Sharply cut movement cards:
  - Keep *Move +1*, *Shadow Walk*, *Spirit Guide*, and one hybrid.
  - Remove *Move +2*, *Move +3*, *Astral Drift*.
- Add rare one-time cards:
  - “Blink Stone” — Move 3, remove from game.
  - “Shatter Ward” — Destroy top Cruxflare, remove from game.
  - “Fragment Compass” — Teleport to nearest fragment, remove from game.

**Cruxflare Deck**
- Size: 12 cards.
- More high-impact events:
  - 3 × Dream Collapse.
  - 2 × Reality Shift.
- Final Darkness arrives while fragments remain unless player pushes aggressively.

**Pacing Notes**
- Long travel time makes movement precious.
- Cruxflare will actively reshape the map before you finish.
- Deck must be lean and efficient to win.

---

## Implementation Notes
- **Map Scaling:** Use `totalNodes` as an easily tunable constant in code.
- **Market Scaling:** Filter the `marketDeck` array at game start based on preset.
- **Cruxflare Scaling:** Load different prebuilt event arrays per preset.
- **Encounter Scaling:** Adjust encounter node placement percentage when building map.

---
