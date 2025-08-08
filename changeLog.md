# Shadows of the Deck – Intended Changes Log

## 1. Gameplay & Mechanics
- **Randomize starting hand**  
  Cards dealt to the player's hand should be randomized at the start.
- **Market shuffle mid-game?**  
  Consider whether the market should shuffle when the lighting shifts to red.

## 2. Tutorial & UI
- **Show Tutorial button**  
  Add a button to trigger the tutorial sequence.
- **Play Music button**  
  Add a button to play background music. Music is stored in `/music` in the root folder.
- **Tutorial timing**  
  Tutorial should last **twice as long** as current.
- **Legend display**  
  Show the legend **only** during the tutorial.

## 3. Music Flow
1. **Start of game** – Play `moonlitreflections.mp3`.
2. **Mid-game (lighting shifts to red)** – Switch to `rogue.mp3`.
3. **Last two rounds** – Switch to `grove.mp3` and increase background color shift.

## 4. End Screen Behavior
- Keep cards **visible behind** the win/lose popup (currently they disappear).
- Fix **restart button alignment** (currently off-center).
- Ensure **End Turn** button is centered after restarting (currently stays in off-center position).

## 5. Visual Feedback
- Increase background color shift **more dramatically** during the last two rounds.
- Provide **better feedback** when moving onto a **purple encounter** spot (Cruxflare activity is unclear).

## 6. Card Behavior
- **Dream Echo** card does not replay all cards — needs review/fix.
