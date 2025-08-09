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

// --- core control functions ---
function setTrackByPhase(phase) {
  const next = TRACKS[phase] || TRACKS.start;
  // Avoid churn if already set
  if (audio.currentSrc && audio.currentSrc.endsWith(next)) return;
  
  // Remember if music was playing before track change
  const wasPlaying = !audio.paused;
  
  audio.src = next;
  audio.load();
  
  // ========== BUG FIX: Restart music if it was playing ==========
  if (wasPlaying) {
    audio.play()
      .then(() => { if (musicText) musicText.textContent = 'Pause'; })
      .catch(err => console.log('Music blocked:', err));
  }
  // ===========================================================
}

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
  audio.volume = Math.min(1, Math.max(0, v / 100));
});

// Set an initial volume that isn't deafening
audio.volume = 0.7;

// Expose a tiny global API so game.js can call it
window.MusicManager = { setTrackByPhase, playMusic, pauseMusic };
