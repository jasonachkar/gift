export default class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeDialogue = null;
        this.isTyping = false;
    }

    showThought(x, y, text, duration = 2000) {
        // Create thought bubble
        const bubble = this.scene.add.container(x, y);

        // Background
        const bg = this.scene.add.rectangle(0, 0, text.length * 10 + 40, 50, 0xFFFFFF, 0.95)
            .setStrokeStyle(2, 0x000000);

        // Text (will be revealed character by character)
        const thoughtText = this.scene.add.text(0, 0, '', {
            fontSize: '18px',
            fontFamily: 'Quicksand',
            color: '#333333'
        }).setOrigin(0.5);

        bubble.add([bg, thoughtText]);
        bubble.setAlpha(0);
        bubble.setDepth(1000);

        // Fade in bubble
        this.scene.tweens.add({
            targets: bubble,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                this.typewriterEffect(thoughtText, text, 50);
            }
        });

        // Auto-destroy after duration
        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: bubble,
                alpha: 0,
                duration: 500,
                onComplete: () => bubble.destroy()
            });
        });

        return bubble;
    }

    showDialogueBox(text, options = {}) {
        const { width, height } = this.scene.cameras.main;
        const boxHeight = 150;

        // Dialogue container
        this.activeDialogue = this.scene.add.container(0, height - boxHeight)
            .setDepth(2000)
            .setScrollFactor(0);

        // Box background
        const box = this.scene.add.rectangle(
            width / 2,
            boxHeight / 2,
            width - 100,
            boxHeight - 20,
            0x000000,
            0.8
        ).setStrokeStyle(4, 0xFFFFFF);

        // Text object (initially empty)
        const dialogueText = this.scene.add.text(
            60,
            30,
            '',
            {
                fontSize: '22px',
                fontFamily: 'Quicksand',
                color: '#ffffff',
                wordWrap: { width: width - 180 }
            }
        );

        // Continue indicator
        const continueIndicator = this.scene.add.text(
            width - 120,
            boxHeight - 40,
            '▼',
            {
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setAlpha(0);

        this.activeDialogue.add([box, dialogueText, continueIndicator]);

        // Start typewriter effect
        this.typewriterEffect(dialogueText, text, 30, () => {
            // Show continue indicator when done
            this.scene.tweens.add({
                targets: continueIndicator,
                alpha: { from: 0, to: 1 },
                duration: 300,
                yoyo: true,
                repeat: -1
            });
        });

        return this.activeDialogue;
    }

    typewriterEffect(textObject, fullText, speed = 50, onComplete = null) {
        this.isTyping = true;
        let currentChar = 0;

        const typeEvent = this.scene.time.addEvent({
            delay: speed,
            callback: () => {
                if (currentChar < fullText.length) {
                    textObject.text += fullText[currentChar];
                    currentChar++;
                } else {
                    typeEvent.remove();
                    this.isTyping = false;
                    if (onComplete) onComplete();
                }
            },
            loop: true
        });
    }

    hideDialogue(callback = null) {
        if (this.activeDialogue) {
            this.scene.tweens.add({
                targets: this.activeDialogue,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.activeDialogue.destroy();
                    this.activeDialogue = null;
                    if (callback) callback();
                }
            });
        }
    }
}
