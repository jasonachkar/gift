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

        // Sky gradient background (placeholder - will be parallax layers)
        this.add.rectangle(0, 0, width, height * 0.6, 0x87CEEB).setOrigin(0, 0).setDepth(-100);
        this.add.rectangle(0, height * 0.6, width, height * 0.4, 0x228B22).setOrigin(0, 0).setDepth(-100);

        // TODO: Add parallax backgrounds when assets are loaded
        // this.skyBg = this.add.tileSprite(0, 0, width * 3, 400, 'sky-layer')
        //     .setOrigin(0, 0).setDepth(-100).setScrollFactor(0.1);

        // Ground platform
        const ground = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(width * 5, groundY + 40, width * 10, 80, 0x4C9900);
        ground.add(groundRect);
        groundRect.body.updateFromGameObject();

        // Path decoration
        this.add.rectangle(0, groundY + 10, width * 10, 30, 0xC2B280).setOrigin(0, 0).setDepth(-1);

        // Player character (emoji placeholder - will be sprite)
        // TODO: Replace with sprite when assets are loaded
        this.player = this.add.text(100, groundY - 30, '👩‍🎓', {
            fontSize: '60px'
        }).setOrigin(0.5);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(false);
        this.player.body.setSize(40, 60);

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

        // TODO: Add audio when assets are loaded
        // this.campusMusic = this.sound.add('campus-walk-music', { loop: true, volume: 0.6 });
        // this.campusMusic.play();

        // Falling petals (placeholder)
        this.time.addEvent({
            delay: 400,
            callback: () => {
                const petal = this.add.text(
                    this.cameras.main.scrollX + Phaser.Math.Between(0, width),
                    this.cameras.main.scrollY - 20,
                    '🌸',
                    { fontSize: Phaser.Math.Between(15, 25) + 'px' }
                ).setAlpha(0.8);

                this.tweens.add({
                    targets: petal,
                    y: petal.y + 500,
                    x: petal.x + Phaser.Math.Between(-30, 30),
                    duration: 8000,
                    onComplete: () => petal.destroy()
                });
            },
            loop: true
        });
    }

    update(time, delta) {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-300);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(300);
            this.player.flipX = false;
        } else {
            this.player.body.setVelocityX(0);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.touching.down) {
            this.player.body.setVelocityY(-550);
            // TODO: Play jump sound
        }

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
        const decorations = ['🏛️', '📚', '🌳', '🌲', '🏫', '🎓', '🌺'];
        let xPos = 200;
        while (xPos < this.targetProgress + 500) {
            const deco = Phaser.Math.RND.pick(decorations);
            const size = Phaser.Math.Between(40, 80);
            this.add.text(xPos, groundY - size / 2, deco, {
                fontSize: size + 'px'
            }).setOrigin(0.5, 1).setDepth(-5);
            xPos += Phaser.Math.Between(150, 350);
        }
    }

    spawnHearts(groundY) {
        let xPos = 300;
        while (xPos < this.targetProgress + 200) {
            const heart = this.add.text(
                xPos,
                Phaser.Math.Between(200, 400),
                '💖',
                { fontSize: '30px' }
            ).setOrigin(0.5);

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
        heart.destroy();
        this.heartsCollected++;
        this.heartCounter.setText(`💕 ${this.heartsCollected}`);

        // TODO: Play collect sound
        // this.sound.play('heart-collect', { volume: 0.5 });

        // Burst effect
        for (let i = 0; i < 5; i++) {
            const sparkle = this.add.text(heart.x, heart.y, '✨', {
                fontSize: '20px'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: sparkle,
                x: sparkle.x + Phaser.Math.Between(-50, 50),
                y: sparkle.y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: 500,
                onComplete: () => sparkle.destroy()
            });
        }
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
