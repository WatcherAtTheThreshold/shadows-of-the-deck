# 📋 Shadows of the Deck – Transition Plan to Level-Based, Data-Driven Structure

This plan outlines how to evolve the current HTML/CSS/JS implementation into a scalable, maintainable structure that supports multiple levels and difficulty modes without file bloat.

---

## 1. Current State

**Engine:**  
- All core mechanics implemented directly in HTML, CSS, and JavaScript.
- Game loop is functional with:
  - Player deck & hand system
  - Market system
  - Cruxflare deck system
  - Node-based “Dream Map” navigation
  - Win/Loss conditions

**Assets:**  
- Cards and effects defined inside JavaScript.
- Map size, market composition, and Cruxflare deck size are hardcoded.
- Encounters are limited and fixed.

---

## 2. Goal

Transition to **one HTML entry point** (`index.html`) that can:
- Show a **start screen** with level select.
- Load any level configuration dynamically from a data file (JSON).
- Use the same game engine for all levels.
- Allow easy tweaks to difficulty, pacing, and content by editing data, not code.

---

## 3. Proposed File Structure

```
/shadows/
  index.html                # Start screen + game UI (sections toggled by JS)
  /css/
    style.css
  /js/
    main.js                 # Entry point, loads level config and starts game
    game-engine.js          # Orchestrates a run (init, loop, win/loss checks)
    map.js                  # Nodes, movement, encounters
    deck.js                 # Player deck, market, discard/shuffle
    cruxflare.js            # Event deck + resolution
    encounters.js           # Encounter tables + handlers
    audio.js                # Music phases
    ui.js                   # DOM rendering and updates
  /data/
    levels.json             # List of all levels and their metadata
    /levels/
      level-1.json
      level-2.json
      level-3.json
      level-4.json
      level-5.json
    /cards/
      market.json           # Base market card pool
      starting.json         # Starting deck composition
      cruxflare.json        # Base Cruxflare event pool
  /images/
  /music/
```

---

## 4. JSON: What It Is and Why Use It

**Definition:**  
JSON (*JavaScript Object Notation*) is just structured text that looks like a JS object but follows strict syntax rules.  
It’s perfect for storing:
- Level parameters (map size, encounters, branching, difficulty)
- Market composition (include/exclude/prices)
- Cruxflare deck details (size, event weights, danger thresholds)

**Benefits:**  
- Easy to edit without touching core game logic.
- Can share configs or add new levels by adding new JSON files.
- Keeps JS files focused on *how* the game runs, not *what values* it runs with.

---

## 5. Example Level Config

```json
{
  "id": 1,
  "name": "The First Dream",
  "map": {
    "nodes": 12,
    "fragments": 3,
    "encounterRate": 0.2,
    "branching": "none"
  },
  "market": {
    "include": ["Focus+2", "Move+1", "ShadowWalk", "DreamEcho", "EssenceTap", "LuckyFind"],
    "exclude": ["Move+3", "AstralDrift"],
    "prices": { "ShadowWalk": 4, "DreamEcho": 5 }
  },
  "cruxflare": {
    "deckSize": 8,
    "weights": { "DreamCollapse": 1, "SuddenEclipse": 1, "RealityShift": 1 },
    "finalDarknessAt": [8]
  },
  "oneTimeCards": ["BlinkStone"]
}
```

---

## 6. Level Loading Flow

**Step-by-step:**
1. Player clicks “Level 1” on start screen.
2. JS reads `?level=1` from URL or local state.
3. `main.js` uses `fetch()` to load `/data/levels/level-1.json`.
4. Parsed JSON config is passed into `game-engine.js`.
5. Game engine:
   - Builds map from `cfg.map`
   - Loads market from `cfg.market`
   - Creates Cruxflare deck from `cfg.cruxflare`
   - Registers any `cfg.oneTimeCards`
6. Game runs normally.

---

## 7. Short-Term Action Items

1. **Extract constants** (map size, market card list, Cruxflare deck size) from JS into variables.
2. Create `/data/levels/level-1.json` and move those constants there.
3. Write a minimal loader in `main.js` to:
   - Read the JSON file
   - Pass it into your existing init code
4. Update HTML to have a **start screen** and hide the game area until a level is selected.

---

## 8. Long-Term Benefits

- **Scalability:** Add new levels, difficulties, or seasonal events just by adding JSON files.
- **Maintainability:** No need to duplicate HTML or JS for each level.
- **Testing:** Quickly adjust game balance (map length, market variety, Cruxflare threat) without touching core code.
- **Replay Value:** Easier to experiment with unique level rules or special events.

---
