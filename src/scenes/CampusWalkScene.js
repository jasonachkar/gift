import AudioManager from '../systems/AudioManager.js';
import DialogueSystem from '../systems/DialogueSystem.js';

export default class CampusWalkScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CampusWalkScene' });
        this.progress = 0;
        this.targetProgress = 3000;
        this.heartsCollected = 0;
        this.jumpBufferTime = 140;
        this.coyoteTime = 140;
        this.lastJumpPressed = -Infinity;
        this.lastGroundedTime = 0;
        this.wasOnGround = false;
        this.fallSpeed = 0;
        this.cameraLookAhead = 0;
        this.lastFootstepTime = 0;
        this.touchJumpPressed = false;
        this.touchJumpHeld = false;
        this.touchJumpReleased = false;
        this.touchMoveDirection = 0;
        this.storyBeats = [];
        this.nextStoryIndex = 0;
        this.isTransitioning = false;
    }

    create() {
        const { width, height } = this.cameras.main;
        const groundY = height - 80;

        this.audio = new AudioManager(this);
        this.audio.playMusic('campus-walk-music', { volume: 0.35 });
        this.dialogue = new DialogueSystem(this);
        this.storyBeats = [
            { progress: 400, text: 'This campus feels so alive today.' },
            { progress: 1200, text: 'I can almost see him ahead...' },
            { progress: 2100, text: 'Just a little farther.' }
        ];
        this.nextStoryIndex = 0;

        // Parallax backgrounds
        this.skyBg = this.add.tileSprite(0, 0, width * 3, 400, 'sky-layer')
            .setOrigin(0, 0).setDepth(-100).setScrollFactor(0.1);

        this.distantBuildings = this.add.tileSprite(0, 100, width * 3, 300, 'distant-buildings')
            .setOrigin(0, 0).setDepth(-90).setScrollFactor(0.3);

        this.treesLayer = this.add.tileSprite(0, 200, width * 3, 400, 'trees-layer')
            .setOrigin(0, 0).setDepth(-80).setScrollFactor(0.6);

        // Subtle color grade overlay (fixed to camera)
        this.colorGrade = this.add.rectangle(0, 0, width, height, 0xFFDDE8, 0.12)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(20);

        // Ground platform
        const ground = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(width * 5, groundY + 40, width * 10, 80, 0x4C9900);
        ground.add(groundRect);
        groundRect.body.updateFromGameObject();

        // Ground texture
        this.groundTexture = this.add.tileSprite(0, groundY, width * 10, 80, 'campus-ground')
            .setOrigin(0, 0).setDepth(-2);

        // Path decoration
        this.add.rectangle(0, groundY + 10, width * 10, 30, 0xC2B280).setOrigin(0, 0).setDepth(-1);

        // Landmarks
        this.placeLandmarks(groundY);

        // Player character sprite
        const playerScale = 1.3;
        this.playerBaseScale = playerScale;
        this.jumpVelocity = -720;
        this.player = this.add.sprite(100, groundY - 36, 'girl-sprite');
        this.player.setScale(playerScale);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(false);
        this.player.body.setSize(32, 60);
        this.player.body.setOffset(16, 12);
        this.player.body.setMaxVelocity(360, 900);
        this.player.body.setDragX(1400);

        this.physics.add.collider(this.player, ground);
        if (this.anims.exists('girl-idle-anim')) {
            this.player.play('girl-idle-anim');
        }

        // Camera setup
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(100, 0);
        this.cameras.main.setBounds(0, 0, width * 10, height);

        // Progress bar (fixed to camera)
        this.progressBarBg = this.add.rectangle(width / 2, 20, 200, 20, 0x646464)
            .setScrollFactor(0).setDepth(100);
        this.progressBarFill = this.add.rectangle(width / 2 - 98, 22, 0, 16, 0xFF69B4)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);

        this.add.text(width / 2, 50, 'Finding Your Love...', {
            fontSize: '16px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        // Hearts counter
        this.heartCounter = this.add.text(20, 20, '💕 0', {
            fontSize: '24px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setScrollFactor(0).setDepth(100);

        this.progressText = this.add.text(width - 20, 20, '0%', {
            fontSize: '18px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // Spawn decorations
        this.spawnDecorations(groundY);

        // Spawn collectible hearts
        this.hearts = this.physics.add.group();
        this.spawnHearts(groundY);
        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Touch controls
        this.input.on('pointerdown', this.handleTouch, this);
        this.input.on('pointermove', this.handleTouchMove, this);
        this.input.on('pointerup', () => {
            this.touchJumpHeld = false;
            this.touchJumpReleased = true;
            this.touchMoveDirection = 0;
        });
        this.touchStartX = 0;

        // Instructions
        this.add.text(width / 2, height - 30,
            'Arrow keys / Swipe to move, Space / Tap to jump!', {
            fontSize: '16px',
            fontFamily: 'Quicksand',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.8);

        // Falling cherry blossom petals
        this.petalEmitter = this.add.particles(0, 0, 'petal', {
            x: { min: 0, max: width },
            y: -20,
            lifespan: 8000,
            speedY: { min: 40, max: 80 },
            speedX: { min: -30, max: 30 },
            scale: { start: 0.5, end: 0.2 },
            alpha: { start: 0.8, end: 0 },
            rotate: { start: 0, end: 360 },
            frequency: 400
        });
        this.petalEmitter.setScrollFactor(0.5);

        // Movement dust and landing bursts
        this.runEmitter = this.add.particles(0, 0, 'dust', {
            speedX: { min: -30, max: 30 },
            speedY: { min: -10, max: -40 },
            lifespan: 500,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.4, end: 0 },
            frequency: 90
        });
        this.runEmitter.startFollow(this.player, 0, 28);
        this.runEmitter.on = false;

        this.dustEmitter = this.add.particles(0, 0, 'dust', {
            speed: { min: 40, max: 120 },
            angle: { min: 200, max: 340 },
            lifespan: 600,
            scale: { start: 0.7, end: 0 },
            alpha: { start: 0.6, end: 0 },
            frequency: -1
        });

        this.heartMagnetRadiusSq = 140 * 140;
    }

    update(time, delta) {
        if (this.isTransitioning) {
            return;
        }
        const movingLeft = this.cursors.left.isDown || this.touchMoveDirection < 0;
        const movingRight = this.cursors.right.isDown || this.touchMoveDirection > 0;
        const onGround = this.player.body.blocked.down || this.player.body.touching.down;

        // Movement with acceleration
        const accel = 1400;
        if (movingLeft) {
            this.player.body.setAccelerationX(-accel);
            this.player.setFlipX(true);
        } else if (movingRight) {
            this.player.body.setAccelerationX(accel);
            this.player.setFlipX(false);
        } else {
            this.player.body.setAccelerationX(0);
        }

        // Jump buffering and coyote time
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.touchJumpPressed;
        if (jumpPressed) {
            this.lastJumpPressed = time;
        }
        this.touchJumpPressed = false;

        if (onGround) {
            this.lastGroundedTime = time;
        }

        if ((time - this.lastJumpPressed) <= this.jumpBufferTime &&
            (time - this.lastGroundedTime) <= this.coyoteTime) {
            this.performJump();
            this.lastJumpPressed = -Infinity;
        }

        const jumpReleased = Phaser.Input.Keyboard.JustUp(this.spaceKey) || this.touchJumpReleased;
        if (jumpReleased) {
            this.touchJumpReleased = false;
            this.touchJumpHeld = false;
        }

        const jumpHeld = this.spaceKey.isDown || this.touchJumpHeld;
        if (!jumpHeld && this.player.body.velocity.y < -200) {
            this.player.body.setVelocityY(-200);
        }

        // Landing detection
        if (!onGround && this.player.body.velocity.y > 0) {
            this.fallSpeed = Math.max(this.fallSpeed, this.player.body.velocity.y);
        }

        if (!this.wasOnGround && onGround) {
            this.onLand();
        }
        this.wasOnGround = onGround;

        // Animations
        if (!onGround && this.textures.exists('girl-jump')) {
            this.player.anims.stop();
            this.player.setTexture('girl-jump');
        } else if (movingLeft || movingRight) {
            if (this.anims.exists('girl-walk-anim')) {
                this.player.play('girl-walk-anim', true);
            } else if (this.textures.exists('girl-walk1')) {
                this.player.setTexture('girl-walk1');
            }
        } else if (this.anims.exists('girl-idle-anim')) {
            this.player.play('girl-idle-anim', true);
        } else {
            this.player.setTexture('girl-sprite');
        }

        const movingOnGround = onGround && (movingLeft || movingRight);
        this.runEmitter.on = movingOnGround && Math.abs(this.player.body.velocity.x) > 80;

        if (movingOnGround && time - this.lastFootstepTime > 280) {
            if (this.audio) {
                this.audio.playSfx('footstep', { volume: 0.2 });
            }
            this.lastFootstepTime = time;
        }

        // Update parallax backgrounds
        this.skyBg.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.distantBuildings.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.treesLayer.tilePositionX = this.cameras.main.scrollX * 0.6;
        this.groundTexture.tilePositionX = this.cameras.main.scrollX * 0.5;

        // Update petal emitter position to follow camera
        this.petalEmitter.setPosition(
            this.cameras.main.scrollX + this.cameras.main.width / 2,
            this.cameras.main.scrollY
        );

        // Camera look-ahead
        const targetLookAhead = Phaser.Math.Clamp(this.player.body.velocity.x * 0.25, -120, 120);
        this.cameraLookAhead = Phaser.Math.Linear(this.cameraLookAhead, targetLookAhead, 0.08);
        this.cameras.main.setFollowOffset(100 + this.cameraLookAhead, 0);

        // Update progress
        this.progress = Math.max(0, this.player.x - 100);
        const fillWidth = Math.min(196, (this.progress / this.targetProgress) * 196);
        this.progressBarFill.width = fillWidth;
        const progressRatio = Phaser.Math.Clamp(this.progress / this.targetProgress, 0, 1);
        const percent = Math.floor(progressRatio * 100);
        this.progressText.setText(`${percent}%`);
        this.updateColorGrade(progressRatio);
        this.updateStoryBeats();
        this.attractHearts();

        // Check if reached destination
        if (!this.isTransitioning && this.progress >= this.targetProgress) {
            this.reachedDestination();
        }
    }

    performJump() {
        this.player.body.setVelocityY(this.jumpVelocity);
        this.squashPlayer(0.95, 1.05, 120);
        if (this.audio) {
            this.audio.playSfx('jump');
        }
        if (this.dustEmitter) {
            this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 28, 6);
        }
    }

    onLand() {
        this.squashPlayer(1.05, 0.95, 120);
        if (this.fallSpeed > 450) {
            this.cameras.main.shake(120, 0.0025);
            if (this.audio) {
                this.audio.playSfx('land', { volume: 0.25 });
            }
            if (this.dustEmitter) {
                this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 30, 10);
            }
        }
        this.fallSpeed = 0;
    }

    squashPlayer(xScale, yScale, duration) {
        this.player.setScale(this.playerBaseScale * xScale, this.playerBaseScale * yScale);
        this.tweens.add({
            targets: this.player,
            scaleX: this.playerBaseScale,
            scaleY: this.playerBaseScale,
            duration,
            ease: 'Quad.easeOut'
        });
    }

    updateColorGrade(progressRatio) {
        if (!this.colorGrade) {
            return;
        }
        const start = { r: 255, g: 221, b: 232 };
        const end = { r: 255, g: 239, b: 210 };
        const step = Math.floor(progressRatio * 100);
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(start, end, 100, step);
        this.colorGrade.setFillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 0.12);
    }

    updateStoryBeats() {
        if (!this.dialogue || this.nextStoryIndex >= this.storyBeats.length) {
            return;
        }
        const beat = this.storyBeats[this.nextStoryIndex];
        if (this.progress >= beat.progress) {
            this.dialogue.showThought(this.player.x + 80, this.player.y - 120, beat.text, 2200);
            this.nextStoryIndex++;
        }
    }

    attractHearts() {
        if (!this.hearts) {
            return;
        }
        this.hearts.children.iterate((heart) => {
            if (!heart || !heart.active || !heart.body) {
                return;
            }
            const dx = this.player.x - heart.x;
            const dy = this.player.y - heart.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < this.heartMagnetRadiusSq) {
                if (!heart.getData('magnetized')) {
                    const floatTween = heart.getData('floatTween');
                    if (floatTween) {
                        floatTween.stop();
                    }
                    heart.setData('magnetized', true);
                }
                const dist = Math.max(1, Math.sqrt(distSq));
                const pull = 240;
                heart.body.setVelocity((dx / dist) * pull, (dy / dist) * pull);
            }
        });
    }

    placeLandmarks(groundY) {
        this.add.sprite(160, groundY, 'campus-arch')
            .setScale(1.4).setOrigin(0.5, 1).setDepth(-6);
        this.add.text(160, groundY - 85, 'UNIVERSITY', {
            fontSize: '16px',
            fontFamily: 'Quicksand',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5, 1).setDepth(-5);

        this.add.sprite(420, groundY, 'campus-sign')
            .setOrigin(0.5, 1).setDepth(-4);
        this.add.text(420, groundY - 52, 'Welcome', {
            fontSize: '14px',
            fontFamily: 'Quicksand',
            color: '#6B4E2E',
            fontStyle: 'bold'
        }).setOrigin(0.5, 1).setDepth(-3);
    }

    spawnDecorations(groundY) {
        const decorationTypes = ['tree', 'building', 'flower', 'bench', 'lamp-post'];
        let xPos = 240;
        while (xPos < this.targetProgress + 500) {
            const decoType = Phaser.Math.RND.pick(decorationTypes);
            let scale = Phaser.Math.FloatBetween(0.6, 1.2);
            let depth = -5;

            if (decoType === 'building') {
                scale = Phaser.Math.FloatBetween(0.8, 1.15);
                depth = -15;
            } else if (decoType === 'flower') {
                scale = Phaser.Math.FloatBetween(0.8, 1.4);
                depth = -3;
            } else if (decoType === 'lamp-post') {
                scale = Phaser.Math.FloatBetween(0.95, 1.1);
                depth = -6;
            }

            const deco = this.add.sprite(xPos, groundY, decoType)
                .setScale(scale)
                .setOrigin(0.5, 1)
                .setDepth(depth);

            if (decoType === 'tree') {
                this.tweens.add({
                    targets: deco,
                    angle: { from: -1, to: 1 },
                    duration: 2000 + Phaser.Math.Between(0, 2000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

            if (decoType === 'lamp-post') {
                this.add.circle(xPos, groundY - 120, 40, 0xFFE3A3, 0.18)
                    .setBlendMode('ADD')
                    .setDepth(-7);
            }

            xPos += Phaser.Math.Between(150, 340);
        }
    }

    spawnHearts(groundY) {
        let xPos = 300;
        while (xPos < this.targetProgress + 200) {
            const heart = this.add.sprite(
                xPos,
                Phaser.Math.Between(200, 400),
                'heart'
            ).setScale(1.5).setOrigin(0.5);

            this.physics.add.existing(heart);
            heart.body.setAllowGravity(false);
            heart.body.setDrag(200, 200);
            heart.body.setMaxVelocity(260, 260);
            heart.setData('magnetized', false);
            this.hearts.add(heart);

            // Floating animation
            const floatTween = this.tweens.add({
                targets: heart,
                y: heart.y - 10,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            heart.setData('floatTween', floatTween);

            xPos += Phaser.Math.Between(250, 450);
        }
    }

    collectHeart(player, heart) {
        const x = heart.x;
        const y = heart.y;
        const floatTween = heart.getData('floatTween');
        if (floatTween) {
            floatTween.stop();
        }
        heart.destroy();
        this.heartsCollected++;
        this.heartCounter.setText(`💕 ${this.heartsCollected}`);
        if (this.audio) {
            this.audio.playSfx('heart-collect');
        }

        // Sparkle burst effect
        const burst = this.add.particles(x, y, 'sparkle', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 8,
            blendMode: 'ADD'
        });

        this.time.delayedCall(500, () => burst.destroy());
    }

    handleTouch(pointer) {
        this.touchStartX = pointer.x;
        this.touchJumpPressed = true;
        this.touchJumpHeld = true;
        this.touchMoveDirection = 0;
    }

    handleTouchMove(pointer) {
        if (pointer.isDown) {
            const touchX = pointer.x - this.touchStartX;
            if (touchX > 30) {
                this.touchMoveDirection = 1;
            } else if (touchX < -30) {
                this.touchMoveDirection = -1;
            } else {
                this.touchMoveDirection = 0;
            }
        }
    }

    reachedDestination() {
        if (this.isTransitioning) {
            return;
        }
        this.isTransitioning = true;
        this.player.body.setAccelerationX(0);
        this.player.body.setVelocityX(0);
        if (this.audio) {
            this.audio.stopAll();
        }

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MeetingScene', { hearts: this.heartsCollected });
        });
    }
}
