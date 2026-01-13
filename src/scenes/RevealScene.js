export default class RevealScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RevealScene' });
    }

    init(data) {
        this.heartsCollected = data.hearts || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Dark background (will lighten)
        this.background = this.add.rectangle(0, 0, width, height, 0x323250)
            .setOrigin(0, 0).setDepth(-100);

        // Couple sprite (walking in)
        this.couple = this.add.sprite(-50, height - 100, 'couple-sprite')
            .setScale(2.5).setOrigin(0.5, 1);

        // Banner/wall (hidden initially)
        this.bannerBorder = this.add.rectangle(width / 2, height / 2 - 50, 520, 320, 0xFF69B4)
            .setOrigin(0.5).setDepth(9).setAlpha(0);

        this.banner = this.add.rectangle(width / 2, height / 2 - 50, 500, 300, 0xFFFFFF)
            .setOrigin(0.5).setDepth(10).setAlpha(0);

        // Message texts (hidden initially)
        this.messages = [
            this.add.text(width / 2, height / 2 - 100, 'I Love You Baby! 💖', {
                fontSize: '36px',
                fontFamily: 'Quicksand',
                color: '#E91E63',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0).setDepth(20),

            this.add.text(width / 2, height / 2 - 40, 'I Support You!', {
                fontSize: '32px',
                fontFamily: 'Quicksand',
                color: '#9C27B0',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0).setDepth(20),

            this.add.text(width / 2, height / 2 + 20, 'I Believe You Can Do This!!', {
                fontSize: '28px',
                fontFamily: 'Quicksand',
                color: '#673AB7',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0).setDepth(20),

            this.add.text(width / 2, height / 2 + 70, '🎓 Go Crush It! 🌟', {
                fontSize: '26px',
                fontFamily: 'Quicksand',
                color: '#3F51B5',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0).setDepth(20)
        ];

        // TODO: Add celebration music
        // this.celebrationMusic = this.sound.add('celebration-music', { loop: true, volume: 0.7 });

        // Start cinematic sequence
        this.startCinematic(width, height);
    }

    startCinematic(width, height) {
        // Phase 1: Couple walks to center
        this.tweens.add({
            targets: this.couple,
            x: width / 2,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Phase 2: Lighten background
                this.time.delayedCall(500, () => {
                    this.lightenBackground();
                });
            }
        });
    }

    lightenBackground() {
        // Gradually change background color
        this.tweens.addCounter({
            from: 50,
            to: 255,
            duration: 1000,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                this.background.setFillStyle(
                    Phaser.Display.Color.GetColor(value, Math.min(255, value + 50), Math.min(255, value + 100))
                );
            },
            onComplete: () => {
                this.revealBanner();
            }
        });
    }

    revealBanner() {
        // Fade in banner
        this.tweens.add({
            targets: [this.banner, this.bannerBorder],
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.revealMessages();
                });
            }
        });
    }

    revealMessages() {
        // TODO: Start celebration music
        // this.celebrationMusic.play();

        // Reveal each message with delay
        this.messages.forEach((msg, index) => {
            this.time.delayedCall(300 + (index * 500), () => {
                // Fade in
                this.tweens.add({
                    targets: msg,
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2'
                });

                // Add glow effect
                this.tweens.add({
                    targets: msg,
                    scale: { from: 1, to: 1.05 },
                    duration: 400,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });

                // TODO: Play whoosh sound
                // this.sound.play('whoosh', { volume: 0.4 });
            });
        });

        // Start celebration after all messages shown
        this.time.delayedCall(300 + (this.messages.length * 500) + 200, () => {
            this.startMassiveCelebration();
        });
    }

    startMassiveCelebration() {
        const { width, height } = this.cameras.main;

        // 1. FIREWORKS - Random colored explosions
        this.time.addEvent({
            delay: 300,
            callback: () => {
                const fx = Phaser.Math.Between(100, width - 100);
                const fy = Phaser.Math.Between(50, height / 2);
                const colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00, 0x0000FF, 0xFF00FF, 0xFF69B4];
                const color = Phaser.Math.RND.pick(colors);

                // Create firework explosion
                const firework = this.add.particles(fx, fy, 'sparkle', {
                    speed: { min: 100, max: 300 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 1, end: 0 },
                    tint: color,
                    alpha: { start: 1, end: 0 },
                    lifespan: 2000,
                    quantity: 15,
                    blendMode: 'ADD'
                });

                this.time.delayedCall(2000, () => firework.destroy());
            },
            loop: true
        });

        // 2. CONFETTI RAIN with gravity
        this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: width },
            y: -30,
            lifespan: 5000,
            speedY: { min: 100, max: 200 },
            speedX: { min: -50, max: 50 },
            gravityY: 200,
            rotation: { min: 0, max: 360 },
            rotateSpeed: { min: -200, max: 200 },
            scale: { min: 0.8, max: 1.5 },
            tint: [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00, 0x0000FF, 0xFF00FF],
            frequency: 100
        });

        // 3. FLOWERS rising from bottom
        this.add.particles(0, 0, 'flower', {
            x: { min: 0, max: width },
            y: height + 30,
            lifespan: 4000,
            speedY: { min: -80, max: -150 },
            speedX: { min: -20, max: 20 },
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            frequency: 400
        });

        // 4. SIDE HEARTS converging to center
        this.time.addEvent({
            delay: 600,
            callback: () => {
                // Left side
                this.add.particles(-20, Phaser.Math.Between(0, height), 'heart', {
                    speedX: { min: 50, max: 100 },
                    lifespan: 5000,
                    scale: { start: 1.5, end: 0 },
                    alpha: { start: 1, end: 0 },
                    quantity: 1
                });

                // Right side
                this.add.particles(width + 20, Phaser.Math.Between(0, height), 'heart', {
                    speedX: { min: -100, max: -50 },
                    lifespan: 5000,
                    scale: { start: 1.5, end: 0 },
                    alpha: { start: 1, end: 0 },
                    quantity: 1
                });
            },
            loop: true
        });

        // 5. AMBIENT SPARKLES everywhere
        this.add.particles(0, 0, 'sparkle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 1000,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            frequency: 200
        });

        // 6. FOOTER MESSAGE
        this.time.delayedCall(2000, () => {
            this.showFooter(width, height);
        });
    }

    showFooter(width, height) {
        this.add.text(width / 2, height - 60,
            'Made with all my love, for you 💕', {
            fontSize: '20px',
            fontFamily: 'Quicksand',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        const replay = this.add.text(width / 2, height - 30,
            '💖 Tap to experience again 💖', {
            fontSize: '18px',
            fontFamily: 'Quicksand',
            color: '#FFC8DC'
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: replay,
            alpha: { from: 0.6, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', () => this.restart());
        this.input.keyboard.on('keydown-SPACE', () => this.restart());
    }

    restart() {
        // TODO: Stop music
        // this.celebrationMusic.stop();

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TitleScene');
        });
    }
}
