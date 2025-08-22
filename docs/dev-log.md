# Shadows of the Deck - Development Log

*A chronological trace of the development journey*

---

## 🎯 Project Overview

**Shadows of the Deck** is a single-player deck-building strategy game with atmospheric horror elements. Players navigate a dreamscape, collecting fragments while managing a growing deck and racing against the Cruxflare countdown.

**Core Concept**: Combine the strategic deck-building of games like Dominion with the tension of a countdown timer and atmospheric world exploration.

---

## 📋 Development Phases

### Phase 1: Core Game Foundation 🏗️

#### Initial Game Mechanics Implementation
- **File**: `game.js` (Core game loop)
- **File**: `cards.js` (Card database and effects)

**Key Features Developed:**
- Basic deck-building system with starting deck (7× Focus +1, 3× Move +1)
- Market system with 5-card rotation
- Map-based movement system (18 nodes, positions 0-17)
- Fragment collection system (7 fragments at specific positions: 2, 5, 7, 10, 12, 15, 17)
- Cruxflare countdown timer system
- Turn-based gameplay with Action → Market → Cruxflare → Draw phases

**Card Types Established:**
- **Focus Cards**: Generate orbs (currency) - Focus +1 through Focus +5
- **Move Cards**: Travel on the map - Move +1 through Move +3
- **Special Cards**: Unique effects like Lucky Find, Shadow Blocker, Dream Sight

**Technical Decisions:**
- Used ES6 modules for code organization
- Implemented random deck shuffling for replayability
- Created flexible card effect system for easy expansion

---

### Phase 2: Advanced Card System 🃏

#### Card Effect Database Expansion
- **File**: `cards.js` (CARD_EFFECTS expansion)

**New Card Categories Added:**
- **Safe Movement**: Swift Step, Void Step, Shadow Walk (move without triggering encounters)
- **Advanced Economy**: Higher-tier Focus cards, Coin Burst, Essence Tap
- **Utility Cards**: Fragment 2pts, Ethereal Leap, Dream Echo
- **Defensive Cards**: Shadow Blocker, Spirit Guide
- **Hybrid Cards**: Mist Walker (move + coin), combinations

**Cruxflare Event System:**
- 19 different negative events
- Final Darkness mechanic (guaranteed in last 3 cards)
- Event variety: resource drain, deck pollution, map shrinkage, hand disruption

**Card Market Balancing:**
- Cost curve: 2-8 orbs
- Power scaling aligned with cost
- Market deck of 28 cards with duplicates for reliability

---

### Phase 3: User Interface & Visual Design 🎨

#### UI System Development
- **File**: `ui.js` (Complete UI management)
- **File**: `style.css` (Comprehensive styling system)

**Major UI Components:**
- **HUD System**: Real-time resource tracking (orbs, fragments, Cruxflare countdown)
- **Card Display**: Hand and market rendering with hover effects
- **Map Visualization**: Node-based map with player position, fragments, encounters
- **Game Log**: Dynamic message system with special Cruxflare styling

**Visual Design Decisions:**
- Dark mystical theme with purple/gold color scheme
- Cormorant Garamond for headers, Source Sans Pro for body text
- Backdrop blur effects throughout for depth
- Card flip animations for visual feedback

**Responsive Design:**
- Mobile-first approach with progressive enhancement
- Scaling system for larger screens (up to 25% larger on 1920px+ displays)
- Touch-friendly controls and sizing

---

### Phase 4: Atmospheric Effects System 🌫️

#### Advanced Visual Atmosphere
- **File**: `style.css` (Atmospheric effects section)

**Mist & Particle Systems:**
- **Layered Mist**: Three-layer system with different animation speeds
- **Floating Particles**: 60 particles with golden, purple, and silver variants
- **Dynamic Backgrounds**: Phase-based mist overlay switching (mist-overlay.png → mist-overlay2.png)
- **State-Based Atmosphere**: Visual changes based on Cruxflare countdown
  - **Normal**: Subtle white mist
  - **Warning (≤9 cards)**: Purple-tinted effects
  - **Danger (≤3 cards)**: Red emergency atmosphere

**Animation System:**
- Multiple keyframe animations for organic movement
- GPU-accelerated transforms for smooth performance
- Particle drift with random variations

---

### Phase 5: Audio & Music Integration 🎵

#### Dynamic Music System
- **File**: `music.js` (Complete audio management)
- **File**: `index.html` (Audio element setup)

**Music Features:**
- **Phase-Based Tracks**: 
  - `echoes1.mp3` (Start phase)
  - `echoes2.mp3` (Warning phase)
  - `echoes3.mp3` (Danger phase)
- **Smooth Transitions**: Fade-out → Track Change → Fade-in system
- **Volume Controls**: Slider with real-time adjustment
- **State Management**: Prevents unnecessary track restarts

**Technical Implementation:**
- Single audio element with source switching
- Transition state tracking to prevent conflicts
- Auto-playing with fallback for browser restrictions

---

### Phase 6: Card Visual Enhancement 🖼️

#### Custom Card Backgrounds
- **File**: `style.css` (Card background system)
- **Assets**: Custom 120px card background images

**Card Visual Categories:**
- **Focus Cards**: Golden orb imagery (`focus-card-120.png`)
- **Move Cards**: Footprint/path imagery (`move-card-120.png`)
- **Defensive Cards**: Barrier/shield themes
- **Mystical Cards**: Crystal ball, time manipulation visuals
- **Dead Cards**: Ominous corrupted appearance

**Implementation Details:**
- CSS `background-image` with `data-card-name` selectors
- Gradient overlays to maintain text readability
- Hover effect enhancements for each card type

---

### Phase 7: Tutorial & Onboarding System 📚

#### Interactive Tutorial
- **File**: `intro.js` (Tutorial system)
- **File**: `manual.html` (Complete player manual)

**Tutorial Features:**
- **Progressive Disclosure**: 5-step guided introduction
- **Visual Highlighting**: Border glow and overlay text on UI elements
- **Auto-Advancement**: Timed progression through tutorial steps
- **Manual Access**: In-game tutorial popup + comprehensive manual

**Manual System:**
- **Complete Reference**: All cards, strategies, FAQ
- **Visual Design**: Matching game aesthetic with purple/gold theme
- **Interactive Elements**: Expandable FAQ, smooth scrolling navigation
- **Strategic Guidance**: Early/mid/late game advice

---

### Phase 8: Advanced Game Features ⚙️

#### Sophisticated Gameplay Systems
- **File**: `game.js` (Advanced features)

**Enhanced Mechanics:**
- **Encounter System**: 60% treasure / 40% penalty random events with visual feedback
- **Fragment Boost**: Cards that multiply fragment collection value
- **Card Draw Integration**: Some cards draw additional cards mid-turn
- **Skip Next Draw**: Time Fracture Cruxflare effect
- **Final Darkness Mode**: 2-turn countdown with visual changes

**Visual Feedback Systems:**
- **Encounter Animations**: Node scaling and ripple effects
- **Card Play Feedback**: Immediate visual response to actions
- **Cruxflare Overlays**: Full-screen event cards with mystical styling
- **Win/Lose Screens**: Particle systems and atmospheric endings

---

### Phase 9: Polish & Optimization ✨

#### User Experience Refinements
- **File**: `ui.js` (Hand system improvements)
- **File**: `game.js` (Phase management)

**UX Improvements:**
- **Phase System**: Clear separation of Action vs Market phases with enlarged cards
- **Hand State Management**: In-place card system without full re-renders
- **Button State Management**: 0.5-second locks to prevent spam clicking
- **Loading States**: Smooth transitions between game phases

**Performance Optimizations:**
- **Efficient Rendering**: Minimal DOM manipulation during card play
- **Animation Queuing**: Smooth card entrance animations
- **State Persistence**: Maintain card positions during gameplay

---

### Phase 10: Advanced Styling & Effects 💫

#### Visual Polish Systems
- **File**: `style.css` (Complete styling overhaul)

**Advanced Visual Features:**
- **Card Overlapping Systems**: Different layouts for hand vs market
- **Hover State Management**: Sophisticated card spread and lift effects
- **Custom Icon System**: Icon replacements for emojis using PNG assets
- **Cruxflare Card Overlays**: Full mystical card design with corners and effects
- **Game Over Particle Systems**: Win (expanding starburst) vs Lose (contracting vacuum)

**Technical Achievements:**
- **2000+ Lines of Organized CSS**: Sectioned and commented for maintainability
- **Mobile-First Responsive**: Comprehensive mobile experience
- **GPU Acceleration**: Hardware-accelerated animations throughout
- **Accessibility**: High contrast ratios and semantic markup

---

## 🔧 Development Challenges & Solutions

### Challenge 1: Card State Management
**Problem**: Cards flickering during hover states and complex hand management
**Solution**: Implemented wrapper containers and GPU layer promotion with `will-change` properties

### Challenge 2: Mobile Performance
**Problem**: Complex animations causing performance issues on mobile devices
**Solution**: Reduced particle counts, simplified animations, and optimized card sizing for mobile

### Challenge 3: Music Synchronization
**Problem**: Music restarting unnecessarily and transition conflicts
**Solution**: State tracking system prevents redundant changes and manages transition locks

### Challenge 4: Responsive Card Layout
**Problem**: Card overlapping system breaking on different screen sizes
**Solution**: Progressive scaling system with device-specific margin adjustments

---

## 📊 Current Game Statistics

- **Total Cards**: 23 unique card types
- **Map Size**: 18 nodes
- **Fragment Count**: 7 (win condition)
- **Cruxflare Events**: 19 different events
- **Maximum Game Length**: 19 turns
- **CSS Lines**: 2400+ (fully organized and sectioned)
- **JavaScript Modules**: 6 files with clear separation of concerns

---

## 🚀 Features Implemented

### ✅ Core Systems
- [x] Complete deck-building mechanics
- [x] Dynamic market system
- [x] Map-based exploration
- [x] Fragment collection win condition
- [x] Cruxflare countdown lose condition
- [x] Complex card interaction system

### ✅ Visual & Audio
- [x] Atmospheric mist and particle effects
- [x] Dynamic music system with phase changes
- [x] Custom card backgrounds
- [x] Responsive mobile design
- [x] Smooth animations throughout

### ✅ User Experience
- [x] Interactive tutorial system
- [x] Comprehensive manual
- [x] Visual feedback for all actions
- [x] Phase-based UI management
- [x] Accessibility considerations

### ✅ Polish Features
- [x] Game over screens with particles
- [x] Cruxflare event overlays
- [x] Advanced card hover systems
- [x] Mobile optimization
- [x] Volume controls

---

## 🎯 Enhancement Opportunities (From Dev Notes)

### High Priority
- **Market Card Flip Animation**: Replace slide-in with flip animation
- **Mist Overlay Background Integration**: Full implementation of PNG mist backgrounds
- **End-of-Map Ping-Pong Movement**: Allow continued movement past final node

### Medium Priority
- **Fullscreen Background System**: Dynamic backgrounds based on game phase
- **Scoring System**: Points-based performance metrics with ranking
- **Final Darkness Bug Fix**: Ensure proper 2-turn countdown

### Low Priority
- **Extended Tutorial**: Additional guided instructions beyond current popup
- **Additional Card Art**: More custom backgrounds for special cards
- **Sound Effects**: Card play and action feedback sounds

---

## 🏆 Development Achievements

1. **Complete Game Experience**: Fully playable from start to finish
2. **Atmospheric Design**: Successfully created immersive dreamscape aesthetic
3. **Mobile Excellence**: Comprehensive mobile experience maintaining visual quality
4. **Code Organization**: Clean, modular architecture with 6 focused JavaScript files
5. **Visual Polish**: Professional-grade animations and effects throughout
6. **Player Onboarding**: Complete tutorial and manual system
7. **Performance Optimization**: Smooth 60fps animations across devices
8. **Accessibility**: High contrast, keyboard navigation, and semantic markup

---

## 📈 Project Evolution Summary

**Shadows of the Deck** evolved from a basic deck-building prototype into a complete atmospheric gaming experience. The development process demonstrated strong iterative improvement, with each phase building upon previous work while maintaining code quality and visual consistency.

The project successfully balances strategic gameplay depth with atmospheric presentation, creating a unique entry in the deck-building genre that emphasizes tension and immersion alongside mechanical complexity.

---

*This devlog represents the current state of Shadows of the Deck development. The project demonstrates comprehensive full-stack web game development with particular strength in visual design, responsive implementation, and atmospheric presentation.*