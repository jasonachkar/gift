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
        this.add.rectangle(0, 0, width, height, 0xFFDAE9).setOrigin(0, 0).setDepth(-100);
        // TODO: Add garden background image when available
        // this.add.image(width / 2, height / 2, 'garden-bg').setOrigin(0.5).setAlpha(0.7).setDepth(-90);

        // Ground
        this.add.rectangle(0, groundY, width, 100, 0x4C9900).setOrigin(0, 0);

        // Decorations (placeholder emojis)
        for (let i = 0; i < 10; i++) {
            const flower = Phaser.Math.RND.pick(['🌸', '🌺', '🌷', '🌹', '🌻']);
            this.add.text(
                Phaser.Math.Between(50, width - 50),
                groundY - Phaser.Math.Between(0, 30),
                flower,
                { fontSize: Phaser.Math.Between(30, 50) + 'px' }
            ).setOrigin(0.5, 1);
        }

        // Trees
        this.add.text(50, groundY, '🌳', { fontSize: '100px' }).setOrigin(0.5, 1);
        this.add.text(width - 50, groundY, '🌳', { fontSize: '100px' }).setOrigin(0.5, 1);

        // Bench
        this.add.text(width / 2, groundY, '🪑', { fontSize: '60px' }).setOrigin(0.5, 1);

        // Characters (emoji placeholders - will be sprites)
        this.girlfriend = this.add.text(-50, groundY, '👩‍🎓', {
            fontSize: '70px'
        }).setOrigin(0.5, 1);

        this.boyfriend = this.add.text(width / 2 + 100, groundY, '👨', {
            fontSize: '70px'
        }).setOrigin(0.5, 1);

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

        // Floating petals
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const petal = this.add.text(
                    Phaser.Math.Between(0, width),
                    -20,
                    '🌸',
                    { fontSize: Phaser.Math.Between(20, 30) + 'px' }
                ).setAlpha(0.8);

                this.tweens.add({
                    targets: petal,
                    y: height + 20,
                    x: petal.x + Phaser.Math.Between(-20, 20),
                    duration: 6000,
                    onComplete: () => petal.destroy()
                });
            },
            loop: true
        });

        // TODO: Add music
        // this.meetingMusic = this.sound.add('meeting-romance', { loop: true, volume: 0.5 });
        // this.meetingMusic.play();

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
                // Replace with couple emoji
                this.girlfriend.setVisible(false);
                this.boyfriend.setVisible(false);

                const couple = this.add.text(width / 2, groundY, '👫', {
                    fontSize: '80px'
                }).setOrigin(0.5, 1);

                // TODO: Play hug sound
                // this.sound.play('hug', { volume: 0.6 });

                // Heart explosion
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
        // Burst of hearts
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 50, () => {
                const heart = this.add.text(x, y, '❤️', {
                    fontSize: Phaser.Math.Between(20, 40) + 'px'
                }).setOrigin(0.5);

                const angle = Phaser.Math.Between(0, 360);
                const speed = Phaser.Math.Between(100, 300);

                this.tweens.add({
                    targets: heart,
                    x: heart.x + Math.cos(angle) * speed,
                    y: heart.y + Math.sin(angle) * speed,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => heart.destroy()
                });
            });
        }
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
