export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(0, 0, width, height, 0xFFB6C1).setOrigin(0, 0);

        // Show "Tap to Start" screen with sound icon
        const tapText = this.add.text(width / 2, height / 2,
            'Tap to Start\n🔊 Sound On', {
            fontSize: '32px',
            fontFamily: 'Quicksand',
            align: 'center',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Pulsing animation
        this.tweens.add({
            targets: tapText,
            alpha: { from: 0.3, to: 1 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Wait for user interaction to unlock audio
        this.input.once('pointerdown', () => this.startGame(tapText));
        this.input.keyboard.once('keydown-SPACE', () => this.startGame(tapText));
        this.input.keyboard.once('keydown-ENTER', () => this.startGame(tapText));
    }

    startGame(tapText) {
        if (this.sound && this.sound.locked) {
            this.sound.unlock();
        }
        if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
        if (typeof window !== 'undefined') {
            window.__giftAudioContext = this.sound && this.sound.context ? this.sound.context : null;
        }

        tapText.destroy();

        // Fade and start preload scene
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('PreloadScene');
        });
    }
}
