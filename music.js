// Music System for Shadows in the Deck
// Simplified approach based on Rook's Gambit pattern

class MusicManager {
  constructor() {
    this.musicPlaying = false;
    this.shadowsMusic = null;
    this.musicToggle = null;
    this.volumeSlider = null;
    this.currentStage = 'start';
    this.isEnabled = localStorage.getItem('shadows-music-enabled') === 'true';
    this.volume = parseFloat(localStorage.getItem('shadows-music-volume')) || 0.3;
    
    // Track URLs
    this.tracks = {
      start: 'music/echoes1.mp3',
      danger: 'music/echoes2.mp3',
      final: 'music/echoes3.mp3'
    };
    
    // Wait for DOM to be ready before initializing (like Rook's Gambit)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    console.log('MusicManager: Initializing...');
    
    // Get DOM elements
    this.shadowsMusic = document.getElementById('shadowsMusic');
    this.musicToggle = document.getElementById('music-toggle');
    this.volumeSlider = document.getElementById('volume-slider');
    
    // Debug: Check if elements exist
    console.log('MusicManager: Audio element found:', !!this.shadowsMusic);
    console.log('MusicManager: Toggle button found:', !!this.musicToggle);
    console.log('MusicManager: Volume slider found:', !!this.volumeSlider);
    
    if (!this.shadowsMusic) {
      console.error('MusicManager: Audio element with id "shadowsMusic" not found');
      return;
    }
    
    this.setupControls();
    this.setInitialVolume();
    this.setupAudioEventListeners();
    
    console.log('MusicManager: Initialization complete');
  }

  setupControls() {
    // Set up music toggle button
    if (this.musicToggle) {
      this.musicToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('MusicManager: Toggle button clicked');
        this.toggleMusic();
      });
      
      console.log('MusicManager: Music toggle listener attached');
    }
    
    // Set up volume slider
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        console.log('MusicManager: Volume changed to:', e.target.value);
        this.setVolume(e.target.value);
        // Save volume preference
        localStorage.setItem('shadows-music-volume', e.target.value / 100);
      });
      
      console.log('MusicManager: Volume slider listener attached');
    }
    
    // Set initial button state
    this.updateMusicButton();
  }

  setupAudioEventListeners() {
    if (!this.shadowsMusic) return;
    
    // Playback events
    this.shadowsMusic.addEventListener('play', () => {
      console.log('MusicManager: Audio started playing');
      this.musicPlaying = true;
      this.updateMusicButton();
    });
    
    this.shadowsMusic.addEventListener('pause', () => {
      console.log('MusicManager: Audio paused');
      this.musicPlaying = false;
      this.updateMusicButton();
    });
    
    // Error events
    this.shadowsMusic.addEventListener('error', (e) => {
      console.error('MusicManager: Audio error:', e);
      this.onMusicError();
    });
    
    // Set initial volume
    this.shadowsMusic.volume = this.volume;
    
    console.log('MusicManager: Audio source:', this.shadowsMusic.src || this.shadowsMusic.currentSrc);
  }

  setInitialVolume() {
    if (this.shadowsMusic) {
      this.shadowsMusic.volume = this.volume;
      console.log('MusicManager: Initial volume set to:', this.volume);
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume * 100;
    }
  }

  toggleMusic() {
    console.log('MusicManager: Toggle music called, current state:', this.musicPlaying);
    
    if (!this.shadowsMusic) {
      console.error('MusicManager: No audio element available');
      return;
    }
    
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('shadows-music-enabled', this.isEnabled);
    
    if (this.isEnabled) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
    
    this.updateMusicButton();
  }

  async playMusic() {
    if (!this.shadowsMusic) {
      console.error('MusicManager: No audio element for playback');
      return;
    }
    
    console.log('MusicManager: Attempting to play music...');
    
    try {
      const playPromise = this.shadowsMusic.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('MusicManager: Music started successfully');
      }
      
    } catch (error) {
      console.error('MusicManager: Failed to play music:', error);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError') {
        console.log('MusicManager: Autoplay blocked by browser - user interaction required');
      }
    }
  }

  pauseMusic() {
    if (!this.shadowsMusic) return;
    
    console.log('MusicManager: Pausing music');
    this.shadowsMusic.pause();
  }

  updateMusicButton() {
    if (!this.musicToggle) return;
    
    const musicText = document.getElementById('music-text');
    if (!musicText) return;
    
    if (this.isEnabled && this.musicPlaying) {
      this.musicToggle.classList.add('active');
      musicText.textContent = 'Pause';
    } else {
      this.musicToggle.classList.remove('active');
      musicText.textContent = 'Play';
    }
    
    console.log('MusicManager: Button updated -', musicText.textContent);
  }

  setVolume(value) {
    if (!this.shadowsMusic) return;
    
    const volume = Math.max(0, Math.min(100, parseInt(value))) / 100;
    this.shadowsMusic.volume = volume;
    this.volume = volume;
    console.log('MusicManager: Volume set to:', volume);
  }

  // Change track based on game stage (like our original plan)
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
      console.log(`MusicManager: Switching to ${newStage} stage`);
      this.playStage(newStage);
    }
  }

  // Switch to different track (like changing radio stations)
  playStage(stage) {
    if (!this.isEnabled || !this.shadowsMusic) return;
    
    const trackUrl = this.tracks[stage];
    if (!trackUrl) {
      console.error('MusicManager: Unknown stage:', stage);
      return;
    }
    
    this.currentStage = stage;
    
    // If music is currently playing, switch source smoothly
    if (this.musicPlaying) {
      console.log('MusicManager: Switching track to:', trackUrl);
      this.shadowsMusic.src = trackUrl;
      this.shadowsMusic.load();
      this.shadowsMusic.play().catch(e => {
        console.error('MusicManager: Error switching track:', e);
      });
    } else {
      // Just change the source for when music starts
      this.shadowsMusic.src = trackUrl;
      this.shadowsMusic.load();
    }
  }

  // Start game - only play if enabled
  startGame() {
    if (this.isEnabled) {
      this.playMusic();
    }
  }

  onMusicError() {
    console.error('MusicManager: Music error occurred');
    this.musicPlaying = false;
    this.updateMusicButton();
  }
}

// Create global music manager
export const musicManager = new MusicManager();
