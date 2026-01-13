import AudioManager from '../systems/AudioManager.js';

export default class RevealScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RevealScene' });
    }

    init(data) {
        this.heartsCollected = data.hearts || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        this.audio = new AudioManager(this);
        this.audio.playMusic('celebration-music', { volume: 0.35 });
        this.events.once('shutdown', () => {
            if (this.audio) {
                this.audio.stopAll();
            }
        });

        // Dark background (will lighten)
        this.background = this.add.rectangle(0, 0, width, height, 0x323250)
            .setOrigin(0, 0).setDepth(-100);

        // Couple sprite (walking in)
        this.couple = this.add.sprite(-50, height - 100, 'couple-sprite')
            .setScale(2.5).setOrigin(0.5, 1);

        // Banner/wall (hidden initially)
        this.bannerGlow = this.add.circle(width / 2, height / 2 - 50, 180, 0xFFD1E8, 0)
            .setDepth(8).setBlendMode('ADD');

        this.bannerBorder = this.add.rectangle(width / 2, height / 2 - 50, 520, 320, 0xFF69B4)
            .setOrigin(0.5).setDepth(9).setAlpha(0);

        this.banner = this.add.rectangle(width / 2, height / 2 - 50, 500, 300, 0xFFFFFF)
            .setOrigin(0.5).setDepth(10).setAlpha(0);

        this.bannerSparkles = this.add.particles(width / 2, height / 2 - 50, 'sparkle', {
            speed: { min: 20, max: 60 },
            angle: { min: 0, max: 360 },
            lifespan: 2000,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            frequency: 200,
            blendMode: 'ADD'
        });
        this.bannerSparkles.setDepth(15);
        this.bannerSparkles.on = false;

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

        this.tweens.add({
            targets: this.bannerGlow,
            alpha: 0.6,
            scale: 1.1,
            duration: 1200,
            ease: 'Sine.easeOut'
        });
        this.bannerSparkles.on = true;
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

                if (this.audio) {
                    this.audio.playSfx('whoosh');
                }
            });
        });

        // Start celebration after all messages shown
        this.time.delayedCall(300 + (this.messages.length * 500) + 200, () => {
            this.startMassiveCelebration();
        });
    }

    startMassiveCelebration() {
        const { width, height } = this.cameras.main;

        // 1. FIREWORKS - Random colored explosions (reused emitter)
        this.fireworkEmitter = this.add.particles(0, 0, 'sparkle', {
            speed: { min: 100, max: 260 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1600,
            quantity: 12,
            blendMode: 'ADD',
            frequency: -1
        });
        this.fireworkTimer = this.time.addEvent({
            delay: 450,
            callback: () => {
                const fx = Phaser.Math.Between(100, width - 100);
                const fy = Phaser.Math.Between(60, height / 2);
                const colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00, 0x0000FF, 0xFF00FF, 0xFF69B4];
                this.fireworkEmitter.setParticleTint(Phaser.Math.RND.pick(colors));
                this.fireworkEmitter.explode(12, fx, fy);
            },
            loop: true
        });

        // 2. CONFETTI RAIN with gravity
        this.confettiEmitter = this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: width },
            y: -30,
            lifespan: 4500,
            speedY: { min: 90, max: 170 },
            speedX: { min: -40, max: 40 },
            gravityY: 180,
            rotation: { min: 0, max: 360 },
            rotateSpeed: { min: -200, max: 200 },
            scale: { min: 0.6, max: 1.2 },
            tint: [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00, 0x0000FF, 0xFF00FF],
            frequency: 140,
            maxParticles: 180
        });

        // 3. FLOWERS rising from bottom
        this.flowerEmitter = this.add.particles(0, 0, 'flower', {
            x: { min: 0, max: width },
            y: height + 30,
            lifespan: 3600,
            speedY: { min: -70, max: -130 },
            speedX: { min: -18, max: 18 },
            scale: { start: 0.9, end: 0.4 },
            alpha: { start: 1, end: 0 },
            frequency: 520,
            maxParticles: 120
        });

        // 4. SIDE HEARTS converging to center (reused emitters)
        this.leftHeartEmitter = this.add.particles(-20, 0, 'heart', {
            speedX: { min: 50, max: 100 },
            lifespan: 3800,
            scale: { start: 1.2, end: 0 },
            alpha: { start: 0.9, end: 0 },
            quantity: 1,
            frequency: -1
        });
        this.rightHeartEmitter = this.add.particles(width + 20, 0, 'heart', {
            speedX: { min: -100, max: -50 },
            lifespan: 3800,
            scale: { start: 1.2, end: 0 },
            alpha: { start: 0.9, end: 0 },
            quantity: 1,
            frequency: -1
        });
        this.sideHeartTimer = this.time.addEvent({
            delay: 750,
            callback: () => {
                this.leftHeartEmitter.emitParticleAt(-20, Phaser.Math.Between(0, height), 1);
                this.rightHeartEmitter.emitParticleAt(width + 20, Phaser.Math.Between(0, height), 1);
            },
            loop: true
        });

        // 5. AMBIENT SPARKLES everywhere
        this.ambientSparkles = this.add.particles(0, 0, 'sparkle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 1200,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.7, end: 0 },
            blendMode: 'ADD',
            frequency: 320,
            maxParticles: 140
        });

        // 6. FOOTER MESSAGE
        this.time.delayedCall(2000, () => {
            this.showFooter(width, height);
        });

        this.events.once('shutdown', () => {
            if (this.fireworkTimer) {
                this.fireworkTimer.remove(false);
            }
            if (this.sideHeartTimer) {
                this.sideHeartTimer.remove(false);
            }
            if (this.fireworkEmitter) {
                this.fireworkEmitter.destroy();
            }
            if (this.confettiEmitter) {
                this.confettiEmitter.destroy();
            }
            if (this.flowerEmitter) {
                this.flowerEmitter.destroy();
            }
            if (this.leftHeartEmitter) {
                this.leftHeartEmitter.destroy();
            }
            if (this.rightHeartEmitter) {
                this.rightHeartEmitter.destroy();
            }
            if (this.ambientSparkles) {
                this.ambientSparkles.destroy();
            }
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
            '🍰 Tap for our cheesecake date 🍰', {
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

        this.input.once('pointerdown', () => this.goToCheesecake());
        this.input.keyboard.once('keydown-SPACE', () => this.goToCheesecake());
    }

    goToCheesecake() {
        if (this.audio) {
            this.audio.stopAll();
        }

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CheesecakeScene');
        });
    }
}
