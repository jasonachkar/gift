import AssetGenerator from '../utils/AssetGenerator.js';

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

        // Character sprites (Kenney, single frames + walk frames)
        this.load.image('girl-sprite', 'sprites/characters/girl/girl-stand.png');
        this.load.image('boy-sprite', 'sprites/characters/boy/boy-stand.png');
        this.load.image('girl-walk1', 'sprites/characters/girl/girl-walk1.png');
        this.load.image('girl-walk2', 'sprites/characters/girl/girl-walk2.png');
        this.load.image('girl-jump', 'sprites/characters/girl/girl-jump.png');
        this.load.image('boy-walk1', 'sprites/characters/boy/boy-walk1.png');
        this.load.image('boy-walk2', 'sprites/characters/boy/boy-walk2.png');
        this.load.image('boy-jump', 'sprites/characters/boy/boy-jump.png');

        // Particles (Kenney sparkle)
        this.load.image('sparkle', 'sprites/particles/sparkle.png');

        // Environment (optional; programmatic fallbacks still used)
        this.load.image('campus-ground', 'tilesets/campus-ground.png');

        // Music
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
        // Ensure any missing textures are generated programmatically
        AssetGenerator.generateAll(this);

        // Create simple animations from individual frames if available
        if (this.textures.exists('girl-walk1') && this.textures.exists('girl-walk2') && !this.anims.exists('girl-walk-anim')) {
            this.anims.create({
                key: 'girl-walk-anim',
                frames: [{ key: 'girl-walk1' }, { key: 'girl-walk2' }],
                frameRate: 6,
                repeat: -1
            });
        }

        if (this.textures.exists('girl-sprite') && !this.anims.exists('girl-idle-anim')) {
            this.anims.create({
                key: 'girl-idle-anim',
                frames: [{ key: 'girl-sprite' }],
                frameRate: 1,
                repeat: -1
            });
        }

        if (this.textures.exists('boy-walk1') && this.textures.exists('boy-walk2') && !this.anims.exists('boy-walk-anim')) {
            this.anims.create({
                key: 'boy-walk-anim',
                frames: [{ key: 'boy-walk1' }, { key: 'boy-walk2' }],
                frameRate: 6,
                repeat: -1
            });
        }

        if (this.textures.exists('boy-sprite') && !this.anims.exists('boy-idle-anim')) {
            this.anims.create({
                key: 'boy-idle-anim',
                frames: [{ key: 'boy-sprite' }],
                frameRate: 1,
                repeat: -1
            });
        }

        // Fade to title screen
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('TitleScene');
        });
    }
}
