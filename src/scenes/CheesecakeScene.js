import AudioManager from '../systems/AudioManager.js';
import DialogueSystem from '../systems/DialogueSystem.js';

export default class CheesecakeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CheesecakeScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        this.audio = new AudioManager(this);
        this.audio.playMusic('cheesecake-moment', { volume: 0.32 });
        this.events.once('shutdown', () => {
            if (this.audio) {
                this.audio.stopAll();
            }
            if (this.crumbEmitter) {
                this.crumbEmitter.destroy();
            }
        });

        const bg = this.add.graphics();
        for (let i = 0; i < height; i++) {
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                { r: 255, g: 226, b: 236 },
                { r: 255, g: 248, b: 220 },
                height,
                i
            );
            bg.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
            bg.fillRect(0, i, width, 1);
        }
        bg.setDepth(-100);

        // Soft vignette
        const vignette = this.add.rectangle(0, 0, width * 1.2, height * 1.2, 0x000000, 0.1)
            .setOrigin(0, 0).setDepth(10);
        vignette.setBlendMode('MULTIPLY');

        // Table
        this.add.rectangle(width / 2, height - 110, width, 180, 0x6B4E2E)
            .setOrigin(0.5).setDepth(1);
        this.add.rectangle(width / 2, height - 200, width, 20, 0x8B5A2B)
            .setOrigin(0.5).setDepth(2);
        this.add.rectangle(width / 2, height - 140, width, 60, 0x7A5233, 0.5)
            .setOrigin(0.5).setDepth(2);

        // Plate + cheesecake
        const plateY = height - 160;
        this.add.image(width / 2 - 120, plateY, 'cheesecake-plate').setDepth(3);
        this.add.image(width / 2 + 120, plateY, 'cheesecake-plate').setDepth(3);
        const sliceLeft = this.add.image(width / 2 - 120, plateY - 12, 'cheesecake-slice').setDepth(4);
        const sliceRight = this.add.image(width / 2 + 120, plateY - 12, 'cheesecake-slice').setDepth(4);

        const leftFork = this.add.container(sliceLeft.x - 30, plateY - 8).setDepth(6);
        const leftForkSprite = this.add.image(0, 0, 'cheesecake-fork');
        const leftBite = this.add.image(0, -10, 'cheesecake-slice').setScale(0.22).setAlpha(0);
        leftFork.add([leftForkSprite, leftBite]);
        leftFork.setRotation(-0.2);

        const rightFork = this.add.container(sliceRight.x + 30, plateY - 8).setDepth(6);
        const rightForkSprite = this.add.image(0, 0, 'cheesecake-fork').setFlipX(true);
        const rightBite = this.add.image(0, -10, 'cheesecake-slice').setScale(0.22).setAlpha(0).setFlipX(true);
        rightFork.add([rightForkSprite, rightBite]);
        rightFork.setRotation(0.2);

        // Characters
        const girl = this.add.sprite(width / 2 - 260, height - 140, 'girl-sprite')
            .setScale(1.5).setOrigin(0.5, 1).setDepth(5);
        const boy = this.add.sprite(width / 2 + 260, height - 140, 'boy-sprite')
            .setScale(1.5).setOrigin(0.5, 1).setDepth(5);

        this.tweens.add({
            targets: [girl, boy],
            y: '-=6',
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: [sliceLeft, sliceRight],
            y: '-=4',
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Floating hearts
        this.add.particles(0, 0, 'heart', {
            x: { min: 0, max: width },
            y: height + 20,
            lifespan: 8000,
            speedY: { min: -40, max: -90 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.5, end: 0.2 },
            alpha: { start: 0.6, end: 0 },
            frequency: 600
        });

        this.crumbEmitter = this.add.particles(0, 0, 'dust', {
            speed: { min: 40, max: 90 },
            angle: { min: 210, max: 330 },
            lifespan: 650,
            gravityY: 260,
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xF3D9B1,
            frequency: -1
        }).setDepth(12);

        const startEatingLoop = (side, fork, bite, slice, character) => {
            const home = { x: fork.x, y: fork.y, rotation: fork.rotation };
            let biteCount = 0;

            const chew = (mouthX, mouthY) => {
                if (this.audio) {
                    this.audio.playSfx('chew', { volume: 0.38 });
                }
                this.crumbEmitter.explode(6, mouthX + (side === 'left' ? 6 : -6), mouthY + 4);
                this.tweens.add({
                    targets: character,
                    angle: side === 'left' ? -6 : 6,
                    duration: 120,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Sine.easeInOut'
                });

                biteCount += 1;
                const targetScale = 1 - Math.min(biteCount, 4) * 0.04;
                this.tweens.add({
                    targets: slice,
                    scale: targetScale,
                    duration: 140,
                    ease: 'Sine.easeOut'
                });
                if (biteCount >= 5) {
                    biteCount = 0;
                    this.time.delayedCall(260, () => {
                        this.tweens.add({
                            targets: slice,
                            scale: 1,
                            duration: 260,
                            ease: 'Back.easeOut'
                        });
                    });
                }
            };

            const runCycle = () => {
                const mouthX = side === 'left'
                    ? character.x + character.displayWidth * 0.18
                    : character.x - character.displayWidth * 0.18;
                const mouthY = character.y - character.displayHeight * 0.72;
                const biteX = slice.x + (side === 'left' ? 12 : -12);
                const biteY = slice.y - 8;

                const moveToMouth = () => {
                    this.tweens.add({
                        targets: fork,
                        x: mouthX,
                        y: mouthY,
                        rotation: side === 'left' ? -0.7 : 0.7,
                        duration: 360,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            chew(mouthX, mouthY);
                            moveHome();
                        }
                    });
                };

                const moveHome = () => {
                    this.tweens.add({
                        targets: fork,
                        x: home.x,
                        y: home.y,
                        rotation: home.rotation,
                        duration: 360,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            bite.setAlpha(0);
                            this.time.delayedCall(Phaser.Math.Between(520, 1200), runCycle);
                        }
                    });
                };

                this.tweens.add({
                    targets: fork,
                    x: biteX,
                    y: biteY,
                    rotation: side === 'left' ? -0.3 : 0.3,
                    duration: 240,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        bite.setAlpha(1);
                        moveToMouth();
                    }
                });
            };

            this.time.delayedCall(Phaser.Math.Between(520, 1200), runCycle);
        };

        startEatingLoop('left', leftFork, leftBite, sliceLeft, girl);
        startEatingLoop('right', rightFork, rightBite, sliceRight, boy);

        // Title and message
        this.add.text(width / 2, 90, 'Cheesecake Date', {
            fontSize: '42px',
            fontFamily: 'Quicksand',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20);

        const prompt = this.add.text(width / 2, 140,
            'A sweet moment to end our journey', {
                fontSize: '20px',
                fontFamily: 'Quicksand',
                color: '#fff2f8'
            }).setOrigin(0.5).setDepth(20);

        this.dialogue = new DialogueSystem(this);
        this.time.delayedCall(800, () => {
            this.dialogue.showThought(width / 2, height - 260, 'Cheesecake together? 💕', 2200);
        });

        const replay = this.add.text(width / 2, height - 40,
            'Tap or press SPACE to replay', {
                fontSize: '18px',
                fontFamily: 'Quicksand',
                color: '#FFE6F0'
            }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: replay,
            alpha: { from: 0.4, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => this.restart());
        this.input.keyboard.once('keydown-SPACE', () => this.restart());
    }

    restart() {
        if (this.audio) {
            this.audio.stopAll();
        }
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TitleScene');
        });
    }
}
