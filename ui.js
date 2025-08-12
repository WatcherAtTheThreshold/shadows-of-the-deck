/* Card flip container */
.card-flip {
  width: 120px;
  height: 170px;
  margin: 8px;
  perspective: 1000px;
  position: relative;
  cursor: pointer;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.4s;
  transform-style: preserve-3d;
}

.card-flip.flipped .card-flip-inner {
  transform: rotateY(180deg);
}

/* NEW: Support for the in-place played state */
.card-flip-inner.played {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.1em; /* Increased from 0.95em */
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

/* ENHANCED Front face - sci-fi styling */
.card-front {
  background: 
    linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(10, 10, 30, 0.9) 100%),
    radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
  border: 2px solid rgba(138, 43, 226, 0.4);
  backdrop-filter: blur(10px);
  color: #f2f2f2;
  transition: all 0.3s ease;
}

.card-front:hover {
  border-color: rgba(222, 184, 135, 0.8);
  background: 
    linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 40, 0.95) 100%),
    radial-gradient(circle at 30% 30%, rgba(222, 184, 135, 0.1) 0%, transparent 50%);
  box-shadow: 0 5px 15px rgba(222, 184, 135, 0.3);
}

/* ENHANCED Back face with mystical symbol */
.card-back {
  background: 
    linear-gradient(135deg, rgba(40, 20, 60, 0.95) 0%, rgba(30, 10, 50, 0.9) 100%),
    radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.2) 0%, transparent 60%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140"><defs><pattern id="cardPattern" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="2" fill="%23654321" opacity="0.3"/></pattern></defs><rect width="100" height="140" fill="%232a1810"/><rect width="100" height="140" fill="url(%23cardPattern)"/><path d="M20 20 L80 20 L50 50 Z" fill="%234a2820" opacity="0.6"/><path d="M20 120 L80 120 L50 90 Z" fill="%234a2820" opacity="0.6"/></svg>') center/cover;
  background-blend-mode: normal, overlay;
  border: 2px solid rgba(138, 43, 226, 0.6);
  backdrop-filter: blur(15px);
  transform: rotateY(180deg);
  color: rgba(222, 184, 135, 0.9);
  position: relative;
}

/* Mystical center emblem on card backs */
.card-back::before {
  content: '✧';
  position: absolute;
  font-size: 2em;
  color: rgba(138, 43, 226, 0.7);
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: gentle-glow 3s ease-in-out infinite alternate;
}

@keyframes gentle-glow {
  0% { 
    text-shadow: 0 0 10px rgba(138, 43, 226, 0.5); 
    transform: translate(-50%, -50%) scale(1);
  }
  100% { 
    text-shadow: 0 0 15px rgba(138, 43, 226, 0.8); 
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.cost {
  font-size: 0.9em; /* Increased from 0.8em */
  color: rgba(222, 184, 135, 0.9);
  font-weight: bold;
  margin-top: 5px;
}

/* NEW: Played card visual state - STAYS IN PLACE */
.card-played {
  opacity: 0.6;
  transform: scale(0.96);
  filter: grayscale(0.2);
  pointer-events: none;
  cursor: default;
  transition: all 0.3s ease;
}

/* Both market and hand cards flip and stay visible */
.card-flip.market-bought .card-flip-inner,
.card-flip.hand-played .card-flip-inner {
  animation: flipAndStay 0.5s ease-in-out forwards;
}

@keyframes flipAndStay {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}
