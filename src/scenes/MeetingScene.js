import DialogueSystem from '../systems/DialogueSystem.js';

export default class MeetingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MeetingScene' });
    }

    init(data) {
        this.heartsCollected = data.hearts || 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        const groundY = height - 100;

        // Garden background
        this.add.image(width / 2, height / 2, 'garden-bg').setOrigin(0.5).setAlpha(0.7).setDepth(-90);

        // Ground
        this.add.rectangle(0, groundY, width, 100, 0x4C9900).setOrigin(0, 0);

        // Decorations - flowers
        for (let i = 0; i < 10; i++) {
            this.add.sprite(
                Phaser.Math.Between(50, width - 50),
                groundY - Phaser.Math.Between(0, 30),
                'flower'
            ).setScale(Phaser.Math.FloatBetween(0.8, 1.2)).setOrigin(0.5, 1);
        }

        // Trees
        this.add.sprite(50, groundY, 'tree').setScale(1.5).setOrigin(0.5, 1);
        this.add.sprite(width - 50, groundY, 'tree').setScale(1.5).setOrigin(0.5, 1);

        // Bench
        this.add.sprite(width / 2, groundY, 'bench').setScale(1.2).setOrigin(0.5, 1);

        // Character sprites
        this.girlfriend = this.add.sprite(-50, groundY, 'girl-sprite')
            .setScale(2.5).setOrigin(0.5, 1);

        this.boyfriend = this.add.sprite(width / 2 + 100, groundY, 'boy-sprite')
            .setScale(2.5).setOrigin(0.5, 1);

        // Boyfriend idle animation
        this.tweens.add({
            targets: this.boyfriend,
            y: groundY - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Dialogue system
        this.dialogueSystem = new DialogueSystem(this);

        // Floating petals particle emitter
        this.add.particles(0, 0, 'petal', {
            x: { min: 0, max: width },
            y: -20,
            lifespan: 6000,
            speedY: { min: 40, max: 70 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.5, end: 0.2 },
            alpha: { start: 0.8, end: 0 },
            rotate: { start: 0, end: 360 },
            frequency: 500
        });

        // Start animation sequence
        this.startSequence(width, height, groundY);
    }

    startSequence(width, height, groundY) {
        // Phase 1: Girlfriend walks to center
        this.tweens.add({
            targets: this.girlfriend,
            x: width / 2 - 50,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Show thought bubble
                this.time.delayedCall(500, () => {
                    this.dialogueSystem.showThought(
                        this.girlfriend.x + 50,
                        groundY - 100,
                        "Where is he...?"
                    );
                });

                // Phase 2: Boyfriend notices
                this.time.delayedCall(2000, () => {
                    this.boyfriendApproach(width, height, groundY);
                });
            }
        });
    }

    boyfriendApproach(width, height, groundY) {
        this.tweens.add({
            targets: this.boyfriend,
            x: width / 2 + 50,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Show dialogue
                this.time.delayedCall(300, () => {
                    this.dialogueSystem.showThought(
                        width / 2,
                        groundY - 120,
                        "There you are! 💕"
                    );
                });

                // Phase 3: Hug sequence
                this.time.delayedCall(1500, () => {
                    this.startHugSequence(width, height, groundY);
                });
            }
        });
    }

    startHugSequence(width, height, groundY) {
        // Move characters together
        this.tweens.add({
            targets: this.girlfriend,
            x: width / 2 - 15,
            duration: 500,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: this.boyfriend,
            x: width / 2 + 15,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Replace with couple sprite
                this.girlfriend.setVisible(false);
                this.boyfriend.setVisible(false);

                const couple = this.add.sprite(width / 2, groundY, 'couple-sprite')
                    .setScale(2.5).setOrigin(0.5, 1);

                // Heart explosion particle effect
                this.createHeartExplosion(width / 2, groundY - 50);

                // Show message
                this.time.delayedCall(1000, () => {
                    this.add.text(width / 2, groundY - 150,
                        '💕 Together at last! 💕', {
                        fontSize: '28px',
                        fontFamily: 'Quicksand',
                        color: '#FF69B4',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                });

                // Continue prompt
                this.time.delayedCall(3000, () => {
                    this.showContinuePrompt(width, height);
                });
            }
        });
    }

    createHeartExplosion(x, y) {
        // Burst of hearts using particle emitter
        const heartBurst = this.add.particles(x, y, 'heart', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            quantity: 20,
            frequency: 50,
            duration: 1000
        });
    }

    showContinuePrompt(width, height) {
        const prompt = this.add.text(width / 2, height - 50,
            'Tap or Press SPACE to continue...', {
            fontSize: '20px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: prompt,
            alpha: 1,
            duration: 500
        });

        this.tweens.add({
            targets: prompt,
            alpha: { from: 0.5, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard.once('keydown-SPACE', () => this.goToReveal());
        this.input.once('pointerdown', () => this.goToReveal());
    }

    goToReveal() {
        // TODO: Stop music
        // this.meetingMusic.stop();

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RevealScene', { hearts: this.heartsCollected });
        });
    }
}
