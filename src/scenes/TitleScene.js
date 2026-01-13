import AudioManager from '../systems/AudioManager.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        this.audio = new AudioManager(this);
        this.audio.playMusic('title-theme', { volume: 0.35 });

        // Background gradient (using rectangles)
        this.add.rectangle(0, 0, width, height, 0xFFB6C1).setOrigin(0, 0).setDepth(0);

        // Stable floating hearts (avoid particle jitter)
        this.titleHearts = [];
        const heartCount = Math.max(12, Math.floor(width / 120));
        for (let i = 0; i < heartCount; i++) {
            const heart = this.add.image(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                'heart'
            )
                .setScale(Phaser.Math.FloatBetween(0.4, 0.7))
                .setAlpha(0.7)
                .setDepth(1);
            heart.setData('speed', Phaser.Math.FloatBetween(35, 70));
            heart.setData('sway', Phaser.Math.FloatBetween(6, 14));
            heart.setData('phase', Phaser.Math.FloatBetween(0, Math.PI * 2));
            heart.setData('baseX', heart.x);
            this.titleHearts.push(heart);
        }

        this.titleHeartUpdate = (time, delta) => {
            const deltaSec = delta / 1000;
            const t = time / 1000;
            this.titleHearts.forEach((heart) => {
                const speed = heart.getData('speed');
                const sway = heart.getData('sway');
                const phase = heart.getData('phase');
                heart.y -= speed * deltaSec;
                heart.x = heart.getData('baseX') + Math.sin(t + phase) * sway;
                if (heart.y < -40) {
                    heart.y = height + 40;
                    heart.setData('baseX', Phaser.Math.Between(0, width));
                    heart.setScale(Phaser.Math.FloatBetween(0.4, 0.7));
                    heart.setAlpha(0.7);
                }
            });
        };
        this.events.on('update', this.titleHeartUpdate);
        this.events.once('shutdown', () => {
            this.events.off('update', this.titleHeartUpdate);
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
        const titleScale = 1.1;
        const girlfriend = this.add.sprite(centerX - 60, centerY + 80, 'girl-sprite')
            .setScale(titleScale);

        const boyfriend = this.add.sprite(centerX + 60, centerY + 80, 'boy-sprite')
            .setScale(titleScale);

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
        const loveHeart = this.add.image(centerX, centerY + 60, 'heart')
            .setScale(1.4)
            .setDepth(2);

        this.tweens.add({
            targets: loveHeart,
            scale: { from: 1.3, to: 1.6 },
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
        if (this.audio) {
            this.audio.stopAll();
        }

        // Fade out transition
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CampusWalkScene');
        });
    }
}
