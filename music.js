// Music System for Shadows in the Deck
class MusicManager {
  constructor() {
    this.tracks = {
      start: null,
      danger: null,
      final: null
    };
    
    this.currentTrack = null;
    this.currentStage = 'start';
    this.isEnabled = localStorage.getItem('shadows-music-enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('shadows-music-volume')) || 0.7;
    this.crossfadeDuration = 1000; // 1 second crossfade
    
    this.initializeTracks();
    this.setupControls();
  }

  initializeTracks() {
    // Preload all audio tracks
    this.tracks.start = new Audio('/music/moonlitreflections.mp3');
    this.tracks.danger = new Audio('/music/rogue.mp3');
    this.tracks.final = new Audio('/music/grove.mp3');

    // Configure all tracks
    Object.values(this.tracks).forEach(track => {
      track.loop = true;
      track.volume = 0;
      track.preload = 'auto';
      
      // Handle loading errors gracefully
      track.onerror = () => {
        console.log('Music file not found, continuing without audio');
      };
    });
  }

  setupControls() {
    const musicToggle = document.getElementById('music-toggle');
    const musicText = document.getElementById('music-text');
    const volumeControl = document.getElementById('volume-control');
    const volumeSlider = document.getElementById('volume-slider');
    const tutorialToggle = document.getElementById('tutorial-toggle');

    // Set initial states
    this.updateMusicButton();
    volumeSlider.value = this.volume * 100;

    // Music toggle button
    musicToggle.onclick = () => {
      this.isEnabled = !this.isEnabled;
      localStorage.setItem('shadows-music-enabled', this.isEnabled);
      this.updateMusicButton();
      
      if (this.isEnabled) {
        this.playStage(this.currentStage);
      } else {
        this.stopAll();
      }
    };

    // Volume control
    volumeSlider.oninput = (e) => {
      this.volume = e.target.value / 100;
      localStorage.setItem('shadows-music-volume', this.volume);
      if (this.currentTrack) {
        this.currentTrack.volume = this.volume;
      }
    };

    // Tutorial button
    tutorialToggle.onclick = () => {
      // Reset tutorial and trigger it
      localStorage.removeItem('shadows-tutorial-complete');
      location.reload(); // Simple way to restart with tutorial
    };
  }

  updateMusicButton() {
    const musicToggle = document.getElementById('music-toggle');
    const musicText = document.getElementById('music-text');
    const volumeControl = document.getElementById('volume-control');

    if (this.isEnabled) {
      musicToggle.classList.add('active');
      musicText.textContent = 'Playing';
      volumeControl.style.display = 'flex';
    } else {
      musicToggle.classList.remove('active');
      musicText.textContent = 'Play Shadows';
      volumeControl.style.display = 'none';
    }
  }

  playStage(stage) {
    if (!this.isEnabled) return;
    
    const newTrack = this.tracks[stage];
    if (!newTrack || newTrack === this.currentTrack) return;

    this.currentStage = stage;

    if (this.currentTrack) {
      // Crossfade from current to new track
      this.crossfade(this.currentTrack, newTrack);
    } else {
      // First track - just fade in
      this.currentTrack = newTrack;
      this.fadeIn(newTrack);
    }
  }

  crossfade(fromTrack, toTrack) {
    const steps = 20;
    const stepDuration = this.crossfadeDuration / steps;
    let step = 0;

    // Start the new track at volume 0
    toTrack.volume = 0;
    toTrack.currentTime = 0;
    toTrack.play().catch(() => {
      console.log('Could not play audio - user interaction may be required');
    });

    const fadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      // Fade out old track
      fromTrack.volume = Math.max(0, this.volume * (1 - progress));
      
      // Fade in new track
      toTrack.volume = Math.min(this.volume, this.volume * progress);

      if (step >= steps) {
        clearInterval(fadeInterval);
        fromTrack.pause();
        fromTrack.currentTime = 0;
        this.currentTrack = toTrack;
      }
    }, stepDuration);
  }

  fadeIn(track) {
    const steps = 20;
    const stepDuration = 500 / steps; // 0.5 second fade in
    let step = 0;

    track.volume = 0;
    track.currentTime = 0;
    track.play().catch(() => {
      console.log('Could not play audio - user interaction may be required');
    });

    const fadeInterval = setInterval(() => {
      step++;
      track.volume = Math.min(this.volume, this.volume * (step / steps));

      if (step >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepDuration);
  }

  stopAll() {
    Object.values(this.tracks).forEach(track => {
      if (track) {
        track.pause();
        track.currentTime = 0;
        track.volume = 0;
      }
    });
    this.currentTrack = null;
  }

  // Called by game logic to trigger music changes
  onGameStateChange(cruxflareCardsLeft, dangerMode = false) {
    let newStage;
    
    if (cruxflareCardsLeft <= 2) {
      newStage = 'final';
    } else if (dangerMode || cruxflareCardsLeft <= 7) {
      newStage = 'danger';
    } else {
      newStage = 'start';
    }

    if (newStage !== this.currentStage) {
      console.log(`Music: Switching to ${newStage} stage`);
      this.playStage(newStage);
    }
  }

  // Method to start music when game begins
  startGame() {
    if (this.isEnabled) {
      this.playStage('start');
    }
  }
}

// Create global music manager
export const musicManager = new MusicManager();
