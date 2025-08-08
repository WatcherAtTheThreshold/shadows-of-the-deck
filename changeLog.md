# Shadows of the Deck – Intended Changes Log V2

-Link: https://watcheratthethreshold.github.io/shadows-of-the-deck/

## 1. Gameplay & Mechanics
- **Randomize starting hand** – *Still needs to be implemented*  
  Cards dealt to the player's hand should be randomized at the start.
- **Market shuffle mid-game?**  
  Consider whether the market should shuffle when the lighting shifts to red.

## 2. Tutorial & UI
- **Show Tutorial button** – *Implemented*  
  Add a button to trigger the tutorial sequence.
- **Play Music button** – *Implemented*  
  Add a button to play background music. Music is stored in `/music` in the root folder.
- **Tutorial timing** – *Needs update*  
  Tutorial should last **twice as long** as current.
- **Legend display** – *Legend still shows full-time*  
  Show the legend **only** during the tutorial.  
  → Plan: Replace where the legend is with the world map and move the world map up the screen.

## 3. Music Flow
1. **Start of game** – Play `moonlitreflections.mp3`.
2. **Mid-game (lighting shifts to red)** – Switch to `rogue.mp3`.
3. **Last two rounds** – Switch to `grove.mp3` and increase background color shift.

## 4. End Screen Behavior
- Keep cards **visible behind** the win/lose popup (currently they disappear).
- **Restart button alignment issue** – Still misaligned.
- Ensure **End Turn** button is centered after restarting (currently stays in off-center position).

## 5. Visual Feedback
- Increase background color shift **more dramatically** during the last two rounds.
- Provide **better feedback** when moving onto a **purple encounter** spot (Cruxflare activity is unclear).  
  → Possibly expand nodes as you move onto them and give a clear encounter animation.

## 6. Card Behavior
- **Dream Echo** – Fixed; now replays all intended cards.

## 7. Additional UI Adjustments
- Increase text size **across the board** — all text elements should be noticeably larger.
- Remove the **game name at the top** of the screen.
- Make **End Turn** button slightly larger.
- Address **mobile UI issues**:  
  Looks good on iPad/medium screens, but on phone sizes, layout folds oddly.  
  → Currently a top row of four cards, with the fifth dropping to a single row beneath; may need a cleaner wrap solution.
