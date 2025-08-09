// music.js

// Grab elements that already exist in index.html
const audio = document.getElementById('shadowsMusic');     // <audio id="shadowsMusic">
const musicText = document.getElementById('music-text');   // span in the Play button
const volumeSlider = document.getElementById('volume-slider'); // range input

// Your actual tracks — make sure these filenames/case match what's in /music
const TRACKS = {
  start:   'music/echoes1.mp3',
  warning: 'music/echoes2.mp3',
  danger:  'music/echoes3.mp3',
};

// ========== ENHANCED MUSIC STATE TRACKING ==========
let currentPhase = 'start';
let targetVolume = 0.7;
let isTransitioning = false;
// ==================================================

// --- core control functions ---
function setTrackByPhase(phase) {
  const newPhase = phase || 'start';
  
  // ========== ONLY CHANGE IF PHASE ACTUALLY CHANGED ==========
  if (currentPhase === newPhase || isTransitioning) {
    return; // No change needed, avoid unnecessary restarts
  }
  
  console.log(`🎵 Music transition: ${currentPhase} → ${newPhase}`);
  currentPhase = newPhase;
  
  const nextTrack = TRACKS[newPhase] || TRACKS.start;
  const wasPlaying = !audio.paused;
  
  if (wasPlaying) {
    // Smooth transition with fade out → change → fade in
    fadeTransition(nextTrack);
  } else {
    // Just change track without fading if not playing
    audio.src = nextTrack;
    audio.load();
  }
  // =========================================================
}

// ========== SMOOTH FADE TRANSITION SYSTEM ==========
function fadeTransition(nextTrack) {
  isTransitioning = true;
  
  // Fade out current track
  fadeOut(() => {
    // Change track during silence
    audio.src = nextTrack;
    audio.load();
    
    // Start playing new track and fade in
    audio.play()
      .then(() => {
        fadeIn(() => {
          isTransitioning = false;
          if (musicText) musicText.textContent = 'Pause';
        });
      })
      .catch(err => {
        console.log('Music blocked:', err);
        isTransitioning = false;
      });
  });
}

function fadeOut(callback) {
  const fadeStep = targetVolume / 20; // 20 steps to fade out
  const currentVol = audio.volume;
  
  const fade = setInterval(() => {
    if (audio.volume > fadeStep) {
      audio.volume -= fadeStep;
    } else {
      audio.volume = 0;
      clearInterval(fade);
      callback();
    }
  }, 50); // 50ms per step = 1 second total fade
}

function fadeIn(callback) {
  audio.volume = 0;
  const fadeStep = targetVolume / 20; // 20 steps to fade in
  
  const fade = setInterval(() => {
    if (audio.volume < targetVolume - fadeStep) {
      audio.volume += fadeStep;
    } else {
      audio.volume = targetVolume;
      clearInterval(fade);
      if (callback) callback();
    }
  }, 50); // 50ms per step = 1 second total fade
}
// ================================================

function playMusic() {
  audio.play()
    .then(() => { if (musicText) musicText.textContent = 'Pause'; })
    .catch(err => console.log('Music blocked until user gesture:', err));
}

function pauseMusic() {
  audio.pause();
  if (musicText) musicText.textContent = 'Play';
}

// --- UI wiring ---
document.getElementById('music-toggle')?.addEventListener('click', () => {
  if (audio.paused) playMusic();
  else pauseMusic();
});

volumeSlider?.addEventListener('input', (e) => {
  const v = Number(e.target.value); // 0-100
  targetVolume = Math.min(1, Math.max(0, v / 100));
  
  // Only update audio volume if not transitioning
  if (!isTransitioning) {
    audio.volume = targetVolume;
  }
});

// Set an initial volume that isn't deafening
audio.volume = 0.7;
targetVolume = 0.7;

// Expose a tiny global API so game.js can call it
window.MusicManager = { setTrackByPhase, playMusic, pauseMusic };
