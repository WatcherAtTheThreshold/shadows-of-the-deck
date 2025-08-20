---

# Shadows of the Deck — Dev Team Handoff: Fixes & Enhancements

## Overview

This document outlines current issues, glitches, and enhancement ideas for *Shadows of the Deck*. Each section lists the **Problem** followed by the **Proposed Solution**. These changes aim to improve gameplay polish, user experience, and replayability.

---

## 1. Market Card Flip

**Problem:**
Market cards currently slide in from the side when replaced. This can feel abrupt and create layout shifts.

**Proposed Solution:**

* Replace the slot with a **flip animation** (`rotateY(180deg)`), revealing the new card directly in place.
* Use CSS 3D transforms with front/back card faces.
* Implementation: Pre-render the new card on the hidden back face, trigger the flip, then swap faces post-animation.

---

## 2. Flickering Hover Glitch

**Problem:**
Cards flicker when the mouse cursor hovers near the edges, toggling between hover and normal states.

**Proposed Solution:**

* Wrap cards in a slightly larger invisible container to stabilize hover.
* Use GPU layer promotion (`will-change: transform`, `translateZ(0)`).
* Prefer `transform` for hover effects over `margin`/`padding` to avoid reflow flicker.

---

## 3. End of Map Handling

**Problem:**
Reaching the final node stops progression abruptly.

**Proposed Solution:**

* Implement **ping-pong movement**: upon reaching the end, player reverses direction.
* Example: Move +3 at last node → 17 → 16 → 15.
* Adds depth and prolongs runs without requiring more nodes.

---

## 4. Fullscreen Backgrounds

**Problem:**
Game background is static, reducing immersion.

**Proposed Solution:**

* Add fullscreen background layer behind game container.
* Switch/fade backgrounds on triggers:

  * **Node ranges** (e.g., Dawn → Forest → Ruins → Threshold).
  * **Music phases** (`start`, `warning`, `danger`).
* CSS: `#background { position: fixed; width:100%; height:100%; background-size:cover; z-index:-1; }`

---

## 5. Scoring System

**Problem:**
Currently no performance metric or replayability incentive.

**Proposed Solution:**

* Introduce a **score system** displayed in HUD and at game end.
* Example scoring framework:

  * +100 per fragment collected
  * +15 per unused Cruxflare turn
  * +1 per unspent orb
  * +5 per encounter entered
  * −8 per dead/debuff card in deck
* End-of-game rank grading (S/A/B/C/D) to encourage mastery.

---

## 6. Final Darkness Cruxflare Bug

**Problem:**
Drawing **Final Darkness** when 1–2 danger turns remain ends the game prematurely, even though the UI shows “2 turns remain.”

**Proposed Solution:**

* Ensure Final Darkness always resets to at least 2 turns:

  ```js
  dangerTurns = Math.max(dangerTurns, 2);
  ```
* This turns the card into a situational benefit, aligning gameplay with UI expectations.

---

## 7. Add Log dialogue

**Problem:**
Log says Welcome to the game! at start, but could it be helpfully instructional as well?”

**Proposed Solution:**

* Welcome to the game! stays on-screen for, what, 5-6 seconds, then it changes to Select cards to play them!. Simple, helpful.:

  ```?
  How would we do this?;
  ```
* Can you think of anything else to add/change?.

---

## 8. Original mist-overlay.png & mist-overlay2.png

**Problem:**
The current mist is really good, but the images actaully make solid grounding background, mist-overlay.png for early game, mistoverlay2.png for end game?”

**Proposed Solution:**

* See if we can get those images showing, maybe even behind the current mist overlay?:

  ```?
  We could work on this.;
  ```
* Can you think of anything else to add/change?.

---

## Next Steps

1. **Prioritization**
   
   * **Mist-Overlay:** getting the mist-overlay backgrounds in place.
   * **Bug Fixes First:** Final Darkness logic, flickering hover, end-of-map handling.
   * **Enhancements Second:** Market flip animation, fullscreen backgrounds.
   * **Systems Third:** Scoring framework and HUD update.

3. **Testing**

   * Verify flickering fix on multiple browsers (Chrome, Firefox, Safari).
   * Confirm background switching logic syncs with both node traversal and music phase.
   * Playtest scoring balance for fun vs. grind.

4. **Deployment**

   * Stage changes in a test branch (`feature-polish-pass`).
   * Collect feedback from playtesters before merging to `main`.

---

✅ *This document is intended for dev handoff and team discussion. Each proposed solution is flexible — implementation details may shift during development.*

---
