export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.musicVolume = 0.6;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
        this.synthMusic = null;
        this.context = scene.sound && scene.sound.context ? scene.sound.context : null;
        if (!this.context && typeof window !== 'undefined' && window.__giftAudioContext) {
            this.context = window.__giftAudioContext;
        }
    }

    playMusic(key, options = {}) {
        this.ensureAudioContext();
        this.stopSynthMusic();

        if (!this.hasAudioKey(key)) {
            this.stopCurrentMusic();
            this.startSynthMusic(this.getMusicPreset(key, options));
            return;
        }

        // Stop current music with fade out
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    this.currentMusic.stop();
                    this.currentMusic = null;
                    this.startNewMusic(key, options);
                }
            });
        } else {
            this.startNewMusic(key, options);
        }
    }

    startNewMusic(key, options) {
        this.ensureAudioContext();
        this.currentMusic = this.scene.sound.add(key, {
            loop: options.loop !== undefined ? options.loop : true,
            volume: options.volume || this.musicVolume
        });

        // Fade in
        this.currentMusic.volume = 0;
        this.currentMusic.play();

        this.scene.tweens.add({
            targets: this.currentMusic,
            volume: options.volume || this.musicVolume,
            duration: 1000
        });
    }

    playSfx(key, options = {}) {
        this.ensureAudioContext();
        if (this.hasAudioKey(key)) {
            this.scene.sound.play(key, {
                volume: options.volume || this.sfxVolume,
                detune: options.detune || 0,
                rate: options.rate || 1
            });
            return;
        }

        const fallback = options.tone || this.getFallbackTone(key);
        if (fallback) {
            this.playTone({
                ...fallback,
                volume: options.volume || this.sfxVolume
            });
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.currentMusic) {
            this.currentMusic.setVolume(volume);
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = volume;
    }

    stopAll() {
        this.scene.sound.stopAll();
        this.stopSynthMusic();
    }

    stopCurrentMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: 300,
                onComplete: () => {
                    this.currentMusic.stop();
                    this.currentMusic = null;
                }
            });
        } else {
            this.currentMusic = null;
        }
    }

    startSynthMusic(options = {}) {
        this.ensureAudioContext();
        if (!this.context) {
            return;
        }

        const base = options.base || 220;
        const frequencies = options.frequencies || [base, base * 1.25, base * 1.5];
        const type = options.type || 'sine';
        const targetVolume = (options.volume || this.musicVolume) / frequencies.length;
        const now = this.context.currentTime;

        this.synthMusic = frequencies.map((frequency) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(targetVolume, now + 0.4);
            osc.connect(gain).connect(this.context.destination);
            osc.start(now);
            return { osc, gain };
        });
    }

    stopSynthMusic() {
        if (!this.synthMusic || !this.context) {
            this.synthMusic = null;
            return;
        }

        const now = this.context.currentTime;
        this.synthMusic.forEach(({ osc, gain }) => {
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            osc.stop(now + 0.35);
        });
        this.synthMusic = null;
    }

    playTone({ frequency, duration = 0.15, volume = 0.4, type = 'sine', attack = 0.01, release = 0.05 }) {
        this.ensureAudioContext();
        if (!this.context) {
            return;
        }

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

        osc.connect(gain).connect(this.context.destination);
        osc.start(now);
        osc.stop(now + duration + release + 0.05);
    }

    getFallbackTone(key) {
        const tones = {
            jump: { frequency: 520, duration: 0.12, type: 'square' },
            'heart-collect': { frequency: 880, duration: 0.1, type: 'sine' },
            chew: { frequency: 220, duration: 0.1, type: 'square' },
            hug: { frequency: 392, duration: 0.3, type: 'triangle' },
            whoosh: { frequency: 220, duration: 0.2, type: 'sawtooth' },
            footstep: { frequency: 140, duration: 0.08, type: 'triangle' },
            land: { frequency: 90, duration: 0.12, type: 'triangle' }
        };
        return tones[key];
    }

    getMusicPreset(key, options = {}) {
        const presets = {
            'title-theme': 220,
            'campus-walk-music': 246,
            'meeting-romance': 196,
            'celebration-music': 262,
            'cheesecake-moment': 233
        };
        return {
            base: presets[key] || 220,
            volume: options.volume || this.musicVolume,
            type: options.type || 'sine',
            frequencies: options.frequencies
        };
    }

    hasAudioKey(key) {
        return !!(this.scene.cache && this.scene.cache.audio && this.scene.cache.audio.get(key));
    }

    ensureAudioContext() {
        if (!this.context && typeof window !== 'undefined' && window.__giftAudioContext) {
            this.context = window.__giftAudioContext;
        }
        if (!this.context && typeof window !== 'undefined') {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) {
                this.context = new Ctx();
                window.__giftAudioContext = this.context;
            }
        }
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
        if (this.scene.sound && this.scene.sound.locked) {
            this.scene.sound.unlock();
        }
    }
}
