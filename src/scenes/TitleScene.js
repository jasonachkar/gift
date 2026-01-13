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

        // Floating hearts particle emitter
        this.add.particles(0, 0, 'heart', {
            x: { min: 0, max: width },
            y: height + 50,
            lifespan: 8000,
            speedY: { min: -100, max: -50 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.5, end: 0.3 },
            alpha: { start: 0.6, end: 0 },
            frequency: 500
        });

        // Cherry blossom petals
        this.add.particles(0, 0, 'petal', {
            x: { min: 0, max: width },
            y: -30,
            lifespan: 10000,
            speedY: { min: 30, max: 80 },
            speedX: { min: -30, max: 30 },
            alpha: { start: 0.8, end: 0.3 },
            scale: { start: 0.6, end: 0.3 },
            rotate: { start: 0, end: 360 },
            frequency: 300
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

        // Character sprites
        const girlfriend = this.add.sprite(centerX - 60, centerY + 80, 'girl-sprite')
            .setScale(1.5);

        const boyfriend = this.add.sprite(centerX + 60, centerY + 80, 'boy-sprite')
            .setScale(1.5);

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
