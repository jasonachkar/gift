export default class CampusWalkScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CampusWalkScene' });
        this.progress = 0;
        this.targetProgress = 3000;
        this.heartsCollected = 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        const groundY = height - 80;

        // Parallax backgrounds
        this.skyBg = this.add.tileSprite(0, 0, width * 3, 400, 'sky-layer')
            .setOrigin(0, 0).setDepth(-100).setScrollFactor(0.1);

        this.distantBuildings = this.add.tileSprite(0, 100, width * 3, 300, 'distant-buildings')
            .setOrigin(0, 0).setDepth(-90).setScrollFactor(0.3);

        this.treesLayer = this.add.tileSprite(0, 200, width * 3, 400, 'trees-layer')
            .setOrigin(0, 0).setDepth(-80).setScrollFactor(0.6);

        // Ground platform
        const ground = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(width * 5, groundY + 40, width * 10, 80, 0x4C9900);
        ground.add(groundRect);
        groundRect.body.updateFromGameObject();

        // Path decoration
        this.add.rectangle(0, groundY + 10, width * 10, 30, 0xC2B280).setOrigin(0, 0).setDepth(-1);

        // Player character sprite
        this.player = this.add.sprite(100, groundY - 36, 'girl-sprite');
        this.player.setScale(2);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(false);
        this.player.body.setSize(32, 60);
        this.player.body.setOffset(16, 12);

        this.physics.add.collider(this.player, ground);

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
    }

    update(time, delta) {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-300);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(300);
            this.player.setFlipX(false);
        } else {
            this.player.body.setVelocityX(0);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.touching.down) {
            this.player.body.setVelocityY(-550);
        }

        // Update parallax backgrounds
        this.skyBg.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.distantBuildings.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.treesLayer.tilePositionX = this.cameras.main.scrollX * 0.6;

        // Update petal emitter position to follow camera
        this.petalEmitter.setPosition(
            this.cameras.main.scrollX + this.cameras.main.width / 2,
            this.cameras.main.scrollY
        );

        // Update progress
        this.progress = Math.max(0, this.player.x - 100);
        const fillWidth = Math.min(196, (this.progress / this.targetProgress) * 196);
        this.progressBarFill.width = fillWidth;

        // Check if reached destination
        if (this.progress >= this.targetProgress) {
            this.reachedDestination();
        }
    }

    spawnDecorations(groundY) {
        const decorationTypes = ['tree', 'building', 'flower', 'bench'];
        let xPos = 200;
        while (xPos < this.targetProgress + 500) {
            const decoType = Phaser.Math.RND.pick(decorationTypes);
            const scale = Phaser.Math.FloatBetween(0.5, 1.2);
            const deco = this.add.sprite(xPos, groundY, decoType)
                .setScale(scale)
                .setOrigin(0.5, 1)
                .setDepth(-5);
            xPos += Phaser.Math.Between(150, 350);
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
            this.hearts.add(heart);

            // Floating animation
            this.tweens.add({
                targets: heart,
                y: heart.y - 10,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            xPos += Phaser.Math.Between(250, 450);
        }
    }

    collectHeart(player, heart) {
        const x = heart.x;
        const y = heart.y;
        heart.destroy();
        this.heartsCollected++;
        this.heartCounter.setText(`💕 ${this.heartsCollected}`);

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
        if (this.player.body.touching.down) {
            this.player.body.setVelocityY(-550);
        }
    }

    handleTouchMove(pointer) {
        if (pointer.isDown) {
            const touchX = pointer.x - this.touchStartX;
            if (touchX > 30) {
                this.player.body.setVelocityX(300);
                this.player.flipX = false;
            } else if (touchX < -30) {
                this.player.body.setVelocityX(-300);
                this.player.flipX = true;
            }
        }
    }

    reachedDestination() {
        // TODO: Stop music
        // this.campusMusic.stop();

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MeetingScene', { hearts: this.heartsCollected });
        });
    }
}
