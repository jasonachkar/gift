export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const { width, height } = this.cameras.main;

        // Loading bar background
        const barWidth = 400;
        const barHeight = 30;
        const barX = width / 2 - barWidth / 2;
        const barY = height / 2;

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(barX, barY, barWidth, barHeight);

        const progressBar = this.add.graphics();

        // Loading text
        const loadingText = this.add.text(width / 2, barY - 50, 'Loading Your Gift...', {
            fontSize: '24px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5);

        const percentText = this.add.text(width / 2, barY + 15, '0%', {
            fontSize: '18px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5);

        const assetText = this.add.text(width / 2, barY + 50, '', {
            fontSize: '14px',
            fontFamily: 'Quicksand',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFF69B4, 1);
            progressBar.fillRect(barX + 5, barY + 5, (barWidth - 10) * value, barHeight - 10);
            percentText.setText(Math.floor(value * 100) + '%');
        });

        // Update asset text
        this.load.on('fileprogress', (file) => {
            assetText.setText('Loading: ' + file.key);
        });

        // Complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // TODO: Download assets from sources in plan, then uncomment and update paths:

        // // Character sprites (sprite sheets with animation frames)
        // this.load.spritesheet('girl-idle', 'sprites/characters/girl/girl-idle.png', {
        //     frameWidth: 64, frameHeight: 64
        // });
        // this.load.spritesheet('girl-walk', 'sprites/characters/girl/girl-walk.png', {
        //     frameWidth: 64, frameHeight: 64
        // });
        // this.load.spritesheet('girl-jump', 'sprites/characters/girl/girl-jump.png', {
        //     frameWidth: 64, frameHeight: 64
        // });
        // this.load.spritesheet('boy-idle', 'sprites/characters/boy/boy-idle.png', {
        //     frameWidth: 64, frameHeight: 64
        // });

        // // Environment
        // this.load.image('campus-ground', 'tilesets/campus-ground.png');
        // this.load.image('building', 'tilesets/building.png');
        // this.load.image('tree', 'tilesets/tree.png');
        // this.load.image('bench', 'tilesets/bench.png');

        // // Backgrounds
        // this.load.image('sky-layer', 'backgrounds/sky-layer.png');
        // this.load.image('distant-buildings', 'backgrounds/distant-buildings.png');
        // this.load.image('trees-layer', 'backgrounds/trees-layer.png');
        // this.load.image('garden-bg', 'backgrounds/garden-bg.png');

        // // Particles
        // this.load.image('heart', 'sprites/particles/heart.png');
        // this.load.image('sparkle', 'sprites/particles/sparkle.png');
        // this.load.image('petal', 'sprites/particles/petal.png');
        // this.load.image('confetti', 'sprites/particles/confetti.png');

        // // Music
        // this.load.audio('title-theme', 'audio/music/title-theme.mp3');
        // this.load.audio('campus-walk-music', 'audio/music/campus-walk.mp3');
        // this.load.audio('meeting-romance', 'audio/music/meeting-romance.mp3');
        // this.load.audio('celebration-music', 'audio/music/celebration.mp3');

        // // Sound Effects
        // this.load.audio('footstep', 'audio/sfx/footstep.mp3');
        // this.load.audio('jump', 'audio/sfx/jump.mp3');
        // this.load.audio('heart-collect', 'audio/sfx/heart-collect.mp3');
        // this.load.audio('hug', 'audio/sfx/hug.mp3');
        // this.load.audio('firework', 'audio/sfx/firework.mp3');
        // this.load.audio('whoosh', 'audio/sfx/whoosh.mp3');
    }

    create() {
        // Create animations from sprite sheets
        // TODO: Uncomment when sprites are loaded

        // // Girl animations
        // this.anims.create({
        //     key: 'girl-idle-anim',
        //     frames: this.anims.generateFrameNumbers('girl-idle', { start: 0, end: 3 }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'girl-walk-anim',
        //     frames: this.anims.generateFrameNumbers('girl-walk', { start: 0, end: 7 }),
        //     frameRate: 12,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'girl-jump-anim',
        //     frames: this.anims.generateFrameNumbers('girl-jump', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: 0
        // });

        // // Boy animations
        // this.anims.create({
        //     key: 'boy-idle-anim',
        //     frames: this.anims.generateFrameNumbers('boy-idle', { start: 0, end: 3 }),
        //     frameRate: 8,
        //     repeat: -1
        // });

        // Fade to title screen
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('TitleScene');
        });
    }
}
