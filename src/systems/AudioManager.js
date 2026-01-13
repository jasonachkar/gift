export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.musicVolume = 0.6;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
    }

    playMusic(key, options = {}) {
        // Stop current music with fade out
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    this.currentMusic.stop();
                    this.startNewMusic(key, options);
                }
            });
        } else {
            this.startNewMusic(key, options);
        }
    }

    startNewMusic(key, options) {
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
        this.scene.sound.play(key, {
            volume: options.volume || this.sfxVolume,
            detune: options.detune || 0,
            rate: options.rate || 1
        });
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
    }
}
