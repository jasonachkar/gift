export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Background gradient (using rectangles)
        this.add.rectangle(0, 0, width, height, 0xFFB6C1).setOrigin(0, 0).setDepth(0);

        // TODO: Add particle emitters when particle textures are loaded
        // For now, creating simple heart emojis as placeholders

        // Floating hearts (placeholder - will use particle emitter)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const heart = this.add.text(
                    Phaser.Math.Between(0, width),
                    height + 50,
                    '💕',
                    { fontSize: Phaser.Math.Between(20, 40) + 'px' }
                ).setAlpha(0.6);

                this.tweens.add({
                    targets: heart,
                    y: -50,
                    duration: 8000,
                    onComplete: () => heart.destroy()
                });
            },
            loop: true
        });

        // Cherry blossoms (placeholder)
        this.time.addEvent({
            delay: 300,
            callback: () => {
                const petal = this.add.text(
                    Phaser.Math.Between(0, width),
                    -30,
                    '🌸',
                    { fontSize: Phaser.Math.Between(15, 30) + 'px' }
                ).setAlpha(0.8);

                this.tweens.add({
                    targets: petal,
                    y: height + 30,
                    x: petal.x + Phaser.Math.Between(-50, 50),
                    duration: 10000,
                    onComplete: () => petal.destroy()
                });
            },
            loop: true
        });

        // Title with animation
        const title = this.add.text(centerX, centerY - 100,
            'Journey to You', {
            fontSize: '64px',
            fontFamily: 'Quicksand',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Pulsing animation for title
        this.tweens.add({
            targets: title,
            scale: { from: 1.0, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(centerX, centerY - 30,
            'A Gift Made With Love 💖', {
            fontSize: '28px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Character preview (using emojis as placeholders)
        // TODO: Replace with sprite animations when assets are loaded
        const girlfriend = this.add.text(centerX - 60, centerY + 80, '👩‍🎓', {
            fontSize: '80px'
        }).setOrigin(0.5);

        const boyfriend = this.add.text(centerX + 60, centerY + 80, '👨', {
            fontSize: '80px'
        }).setOrigin(0.5);

        // Bobbing animation
        this.tweens.add({
            targets: girlfriend,
            y: centerY + 70,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: boyfriend,
            y: centerY + 70,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 500
        });

        // Heart between them
        const loveHeart = this.add.text(centerX, centerY + 60, '❤️', {
            fontSize: '40px'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: loveHeart,
            scale: { from: 1.0, to: 1.2 },
            duration: 750,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Start prompt
        const prompt = this.add.text(centerX, centerY + 200,
            '✨ Tap or Press SPACE to Begin ✨', {
            fontSize: '24px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: { from: 0.3, to: 1.0 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.on('pointerdown', () => this.startGame());
    }

    startGame() {
        // Fade out transition
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CampusWalkScene');
        });
    }
}
