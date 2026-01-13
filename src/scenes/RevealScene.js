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
        this.couple = this.add.text(-50, height - 100, '👫', {
            fontSize: '70px'
        }).setOrigin(0.5, 1);

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

        // 1. FIREWORKS (emoji placeholders)
        this.time.addEvent({
            delay: 300,
            callback: () => {
                const fx = Phaser.Math.Between(100, width - 100);
                const fy = Phaser.Math.Between(50, height / 2);

                // Create firework explosion
                const colors = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
                const emoji = Phaser.Math.RND.pick(colors);

                for (let i = 0; i < 15; i++) {
                    const particle = this.add.text(fx, fy, emoji, {
                        fontSize: Phaser.Math.Between(15, 30) + 'px'
                    }).setOrigin(0.5);

                    const angle = Phaser.Math.Between(0, 360);
                    const speed = Phaser.Math.Between(100, 300);

                    this.tweens.add({
                        targets: particle,
                        x: particle.x + Math.cos(angle * Math.PI / 180) * speed,
                        y: particle.y + Math.sin(angle * Math.PI / 180) * speed,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => particle.destroy()
                    });
                }

                // TODO: Play firework sound
                // this.sound.play('firework', { volume: 0.3 });
            },
            loop: true
        });

        // 2. CONFETTI RAIN
        this.time.addEvent({
            delay: 100,
            callback: () => {
                const confetti = this.add.text(
                    Phaser.Math.Between(0, width),
                    -30,
                    Phaser.Math.RND.pick(['🎊', '🎉', '✨', '💫', '⭐']),
                    { fontSize: Phaser.Math.Between(20, 35) + 'px' }
                );

                this.tweens.add({
                    targets: confetti,
                    y: height + 30,
                    x: confetti.x + Phaser.Math.Between(-50, 50),
                    rotation: Phaser.Math.Between(0, 360),
                    duration: 5000,
                    onComplete: () => confetti.destroy()
                });
            },
            loop: true
        });

        // 3. FLOWERS FROM BOTTOM
        this.time.addEvent({
            delay: 400,
            callback: () => {
                const flowers = ['🌸', '🌺', '🌷', '🌹', '🌻', '💐', '🌼'];
                const flower = this.add.text(
                    Phaser.Math.Between(0, width),
                    height + 30,
                    Phaser.Math.RND.pick(flowers),
                    { fontSize: Phaser.Math.Between(30, 50) + 'px' }
                );

                this.tweens.add({
                    targets: flower,
                    y: -30,
                    x: flower.x + Phaser.Math.Between(-20, 20),
                    alpha: { from: 1, to: 0 },
                    duration: 4000,
                    onComplete: () => flower.destroy()
                });
            },
            loop: true
        });

        // 4. SIDE HEARTS
        this.time.addEvent({
            delay: 600,
            callback: () => {
                // Left side
                const heartL = this.add.text(-20, Phaser.Math.Between(0, height), '💕', {
                    fontSize: Phaser.Math.Between(25, 40) + 'px'
                });
                this.tweens.add({
                    targets: heartL,
                    x: width / 2,
                    alpha: 0,
                    duration: 5000,
                    onComplete: () => heartL.destroy()
                });

                // Right side
                const heartR = this.add.text(width + 20, Phaser.Math.Between(0, height), '💕', {
                    fontSize: Phaser.Math.Between(25, 40) + 'px'
                });
                this.tweens.add({
                    targets: heartR,
                    x: width / 2,
                    alpha: 0,
                    duration: 5000,
                    onComplete: () => heartR.destroy()
                });
            },
            loop: true
        });

        // 5. AMBIENT SPARKLES
        this.time.addEvent({
            delay: 200,
            callback: () => {
                const sparkle = this.add.text(
                    Phaser.Math.Between(0, width),
                    Phaser.Math.Between(0, height),
                    '✨',
                    { fontSize: Phaser.Math.Between(10, 25) + 'px' }
                ).setAlpha(0.8);

                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    scale: 0,
                    duration: 1000,
                    onComplete: () => sparkle.destroy()
                });
            },
            loop: true
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
