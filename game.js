import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";

// Initialize Kaboom
const k = kaboom({
    canvas: document.getElementById("game"),
    background: [135, 206, 235],
    width: window.innerWidth,
    height: window.innerHeight,
    stretch: true,
    letterbox: false,
});

// Game constants
const SPEED = 300;
const JUMP_FORCE = 550;
const GRAVITY = 1200;

// Set gravity
setGravity(GRAVITY);

// ============ SCENE 1: TITLE SCREEN ============
scene("title", () => {
    const centerX = width() / 2;
    const centerY = height() / 2;

    // Animated background gradient
    add([
        rect(width(), height()),
        pos(0, 0),
        color(255, 182, 193),
        fixed(),
    ]);

    // Floating hearts background
    loop(0.5, () => {
        const heart = add([
            text("💕", { size: rand(20, 40) }),
            pos(rand(0, width()), height() + 50),
            anchor("center"),
            opacity(0.6),
            lifespan(8),
            move(UP, rand(50, 100)),
            "heart",
        ]);
    });

    // Cherry blossoms
    loop(0.3, () => {
        add([
            text("🌸", { size: rand(15, 30) }),
            pos(rand(0, width()), -30),
            anchor("center"),
            opacity(0.8),
            lifespan(10),
            move(rand(170, 190), rand(30, 80)),
        ]);
    });

    // Title with animation
    const title = add([
        text("Journey to You", { size: 64, font: "sans-serif" }),
        pos(centerX, centerY - 100),
        anchor("center"),
        color(255, 255, 255),
        scale(1),
        fixed(),
    ]);

    // Pulsing animation for title
    title.onUpdate(() => {
        title.scale = vec2(1 + Math.sin(time() * 2) * 0.05);
    });

    // Subtitle
    add([
        text("A Gift Made With Love 💖", { size: 28 }),
        pos(centerX, centerY - 30),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
    ]);

    // Characters preview
    const girlfriend = add([
        text("👩", { size: 80 }),
        pos(centerX - 60, centerY + 80),
        anchor("center"),
        fixed(),
    ]);

    const boyfriend = add([
        text("👨", { size: 80 }),
        pos(centerX + 60, centerY + 80),
        anchor("center"),
        fixed(),
    ]);

    // Bobbing animation
    girlfriend.onUpdate(() => {
        girlfriend.pos.y = centerY + 80 + Math.sin(time() * 3) * 10;
    });
    boyfriend.onUpdate(() => {
        boyfriend.pos.y = centerY + 80 + Math.sin(time() * 3 + 1) * 10;
    });

    // Heart between them
    const loveHeart = add([
        text("❤️", { size: 40 }),
        pos(centerX, centerY + 60),
        anchor("center"),
        fixed(),
    ]);
    loveHeart.onUpdate(() => {
        loveHeart.scale = vec2(1 + Math.sin(time() * 4) * 0.2);
    });

    // Start prompt
    const prompt = add([
        text("✨ Tap or Press SPACE to Begin ✨", { size: 24 }),
        pos(centerX, centerY + 200),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
    ]);
    prompt.onUpdate(() => {
        prompt.opacity = 0.5 + Math.sin(time() * 3) * 0.5;
    });

    // Start game
    onKeyPress("space", () => go("campus"));
    onClick(() => go("campus"));
});

// ============ SCENE 2: CAMPUS WALK ============
scene("campus", () => {
    // Sky gradient background
    add([rect(width(), height() * 0.6), pos(0, 0), color(135, 206, 235), fixed(), z(-100)]);
    add([rect(width(), height() * 0.4), pos(0, height() * 0.6), color(34, 139, 34), fixed(), z(-100)]);

    // Ground
    const groundY = height() - 80;
    add([
        rect(width() * 10, 80),
        pos(0, groundY),
        color(76, 153, 0),
        area(),
        body({ isStatic: true }),
        "ground",
    ]);

    // Path on ground
    add([rect(width() * 10, 30), pos(0, groundY + 10), color(194, 178, 128), z(-1)]);

    // Progress tracker
    let progress = 0;
    const targetProgress = 3000;

    // Progress bar background
    add([rect(200, 20), pos(width() / 2 - 100, 20), color(100, 100, 100), fixed(), z(100)]);

    const progressBar = add([
        rect(0, 16),
        pos(width() / 2 - 98, 22),
        color(255, 105, 180),
        fixed(),
        z(101),
    ]);

    // Progress label
    add([
        text("Finding Your Love...", { size: 16 }),
        pos(width() / 2, 50),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        z(100),
    ]);

    // Player (girlfriend)
    const player = add([
        text("👩‍🎓", { size: 60 }),
        pos(100, groundY - 60),
        anchor("bot"),
        area({ width: 40, height: 60 }),
        body(),
        "player",
    ]);

    let facingRight = true;
    let walkFrame = 0;

    // Walking animation
    player.onUpdate(() => {
        walkFrame += dt() * 10;
        player.pos.y += Math.sin(walkFrame) * 0.5;
    });

    // Campus decorations (spawn as player moves)
    const decorations = ["🏛️", "📚", "🌳", "🌲", "🪴", "🏫", "🎓", "🌺", "🌷"];
    let lastDecoX = 200;

    function spawnDecoration() {
        if (lastDecoX < player.pos.x + width()) {
            const deco = decorations[Math.floor(rand(0, decorations.length))];
            const size = rand(40, 80);
            add([
                text(deco, { size: size }),
                pos(lastDecoX + rand(100, 300), groundY - size / 2),
                anchor("bot"),
                z(-5),
            ]);
            lastDecoX += rand(150, 350);
        }
    }

    // Cherry blossoms falling
    loop(0.4, () => {
        add([
            text("🌸", { size: rand(15, 25) }),
            pos(camPos().x + rand(-width()/2, width()/2), camPos().y - height()/2 - 20),
            anchor("center"),
            opacity(0.8),
            lifespan(8),
            move(rand(170, 190), rand(40, 80)),
        ]);
    });

    // Collectible hearts
    let lastHeartX = 300;
    let heartsCollected = 0;

    function spawnHeart() {
        if (lastHeartX < player.pos.x + width()) {
            const heart = add([
                text("💖", { size: 30 }),
                pos(lastHeartX + rand(200, 400), groundY - rand(100, 200)),
                anchor("center"),
                area({ width: 30, height: 30 }),
                "collectible",
            ]);
            heart.onUpdate(() => {
                heart.pos.y += Math.sin(time() * 4) * 0.5;
            });
            lastHeartX += rand(250, 450);
        }
    }

    // Collect hearts
    player.onCollide("collectible", (heart) => {
        destroy(heart);
        heartsCollected++;
        // Burst effect
        for (let i = 0; i < 5; i++) {
            add([
                text("✨", { size: 20 }),
                pos(heart.pos),
                anchor("center"),
                lifespan(0.5),
                move(rand(0, 360), rand(100, 200)),
            ]);
        }
    });

    // Hearts counter
    const heartCounter = add([
        text("💕 0", { size: 24 }),
        pos(20, 20),
        fixed(),
        z(100),
    ]);

    // Controls
    onKeyDown("right", () => {
        player.move(SPEED, 0);
        facingRight = true;
    });
    onKeyDown("left", () => {
        player.move(-SPEED, 0);
        facingRight = false;
    });
    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Touch controls
    let touchStartX = 0;
    onTouchStart((pos) => {
        touchStartX = pos.x;
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });
    onTouchMove((pos) => {
        if (pos.x > touchStartX + 30) {
            player.move(SPEED, 0);
        } else if (pos.x < touchStartX - 30) {
            player.move(-SPEED, 0);
        }
    });

    // Camera follow
    player.onUpdate(() => {
        camPos(player.pos.x + 100, height() / 2);
        progress = Math.max(0, player.pos.x - 100);
        progressBar.width = Math.min(196, (progress / targetProgress) * 196);
        heartCounter.text = `💕 ${heartsCollected}`;

        spawnDecoration();
        spawnHeart();

        // Check if reached destination
        if (progress >= targetProgress) {
            go("meeting", { hearts: heartsCollected });
        }
    });

    // Instructions
    const instructions = add([
        text("Arrow keys / Swipe to move, Space / Tap to jump!", { size: 16 }),
        pos(width() / 2, height() - 30),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        opacity(0.8),
    ]);
});

// ============ SCENE 3: MEETING ============
scene("meeting", ({ hearts = 0 }) => {
    const centerX = width() / 2;
    const centerY = height() / 2;
    const groundY = height() - 100;

    // Beautiful garden background
    add([rect(width(), height()), pos(0, 0), color(255, 218, 233), fixed()]);

    // Ground
    add([rect(width(), 100), pos(0, groundY), color(76, 153, 0), fixed()]);

    // Garden decorations
    for (let i = 0; i < 10; i++) {
        add([
            text(["🌸", "🌺", "🌷", "🌹", "🌻"][Math.floor(rand(0, 5))], { size: rand(30, 50) }),
            pos(rand(0, width()), groundY - rand(0, 30)),
            anchor("bot"),
        ]);
    }

    // Trees
    add([text("🌳", { size: 100 }), pos(50, groundY), anchor("bot")]);
    add([text("🌳", { size: 100 }), pos(width() - 50, groundY), anchor("bot")]);

    // Gazebo/bench
    add([text("🪑", { size: 60 }), pos(centerX, groundY), anchor("bot")]);

    // Girlfriend walking in
    const girlfriend = add([
        text("👩‍🎓", { size: 70 }),
        pos(-50, groundY),
        anchor("bot"),
    ]);

    // Boyfriend waiting
    const boyfriend = add([
        text("👨", { size: 70 }),
        pos(centerX + 100, groundY),
        anchor("bot"),
    ]);
    boyfriend.onUpdate(() => {
        boyfriend.pos.y = groundY + Math.sin(time() * 2) * 5;
    });

    // Animation sequence
    let phase = 0;

    // Phase 0: Girlfriend walks to center
    const walkTween = tween(
        girlfriend.pos.x,
        centerX - 50,
        2,
        (val) => girlfriend.pos.x = val,
        easings.easeOutQuad
    );

    walkTween.onEnd(() => {
        phase = 1;
        // Boyfriend notices and comes closer
        tween(
            boyfriend.pos.x,
            centerX + 50,
            1,
            (val) => boyfriend.pos.x = val,
            easings.easeOutQuad
        ).onEnd(() => {
            phase = 2;
            startHug();
        });
    });

    // Speech bubbles
    wait(0.5, () => {
        const bubble1 = add([
            text("💭 Where is he...?", { size: 18 }),
            pos(girlfriend.pos.x + 50, groundY - 100),
            anchor("center"),
            opacity(0),
        ]);
        tween(bubble1.opacity, 1, 0.5, (v) => bubble1.opacity = v);
        wait(2, () => destroy(bubble1));
    });

    wait(2.5, () => {
        const bubble2 = add([
            text("💭 There you are! 💕", { size: 18 }),
            pos(centerX, groundY - 120),
            anchor("center"),
            opacity(0),
        ]);
        tween(bubble2.opacity, 1, 0.5, (v) => bubble2.opacity = v);
        wait(1.5, () => destroy(bubble2));
    });

    function startHug() {
        // Move them together
        tween(girlfriend.pos.x, centerX - 15, 0.5, (v) => girlfriend.pos.x = v);
        tween(boyfriend.pos.x, centerX + 15, 0.5, (v) => boyfriend.pos.x = v).onEnd(() => {
            // Replace with hug emoji
            destroy(girlfriend);
            destroy(boyfriend);

            const couple = add([
                text("👫", { size: 80 }),
                pos(centerX, groundY),
                anchor("bot"),
            ]);

            // Hearts explosion
            for (let i = 0; i < 20; i++) {
                wait(i * 0.05, () => {
                    add([
                        text("❤️", { size: rand(20, 40) }),
                        pos(centerX, groundY - 50),
                        anchor("center"),
                        lifespan(2),
                        move(rand(0, 360), rand(100, 300)),
                    ]);
                });
            }

            // Hug message
            wait(1, () => {
                add([
                    text("💕 Together at last! 💕", { size: 28 }),
                    pos(centerX, groundY - 150),
                    anchor("center"),
                    color(255, 105, 180),
                ]);
            });

            // Continue prompt
            wait(3, () => {
                const continuePrompt = add([
                    text("Tap or Press SPACE to continue...", { size: 20 }),
                    pos(centerX, height() - 50),
                    anchor("center"),
                    opacity(0),
                ]);
                tween(continuePrompt.opacity, 1, 0.5, (v) => continuePrompt.opacity = v);
                continuePrompt.onUpdate(() => {
                    continuePrompt.opacity = 0.5 + Math.sin(time() * 3) * 0.5;
                });

                onKeyPress("space", () => go("reveal", { hearts }));
                onClick(() => go("reveal", { hearts }));
            });
        });
    }

    // Floating petals
    loop(0.5, () => {
        add([
            text("🌸", { size: rand(15, 25) }),
            pos(rand(0, width()), -20),
            anchor("center"),
            lifespan(6),
            move(rand(170, 190), rand(40, 70)),
        ]);
    });
});

// ============ SCENE 4: THE REVEAL ============
scene("reveal", ({ hearts = 0 }) => {
    const centerX = width() / 2;
    const centerY = height() / 2;

    // Dark dramatic background that will lighten
    const bg = add([
        rect(width(), height()),
        pos(0, 0),
        color(50, 50, 80),
        fixed(),
        z(-100),
    ]);

    // Couple walking in
    const couple = add([
        text("👫", { size: 70 }),
        pos(-50, height() - 100),
        anchor("bot"),
    ]);

    // Wall/Banner (hidden initially)
    const banner = add([
        rect(500, 300),
        pos(centerX, centerY - 50),
        anchor("center"),
        color(255, 255, 255),
        opacity(0),
        z(10),
    ]);

    const bannerBorder = add([
        rect(520, 320),
        pos(centerX, centerY - 50),
        anchor("center"),
        color(255, 105, 180),
        opacity(0),
        z(9),
    ]);

    // Walk couple to center
    tween(couple.pos.x, centerX, 2, (v) => couple.pos.x = v, easings.easeOutQuad).onEnd(() => {
        wait(0.5, () => {
            // Lighten background
            tween(50, 255, 1, (v) => {
                bg.color = rgb(v, Math.min(255, v + 50), Math.min(255, v + 100));
            });

            // Reveal banner
            tween(0, 1, 1, (v) => {
                banner.opacity = v;
                bannerBorder.opacity = v;
            });

            wait(1, () => showMessage());
        });
    });

    function showMessage() {
        // Main message
        const msg1 = add([
            text("I Love You Baby! 💖", { size: 36 }),
            pos(centerX, centerY - 100),
            anchor("center"),
            color(233, 30, 99),
            opacity(0),
            z(20),
        ]);

        const msg2 = add([
            text("I Support You!", { size: 32 }),
            pos(centerX, centerY - 40),
            anchor("center"),
            color(156, 39, 176),
            opacity(0),
            z(20),
        ]);

        const msg3 = add([
            text("I Believe You Can Do This!!", { size: 28 }),
            pos(centerX, centerY + 20),
            anchor("center"),
            color(103, 58, 183),
            opacity(0),
            z(20),
        ]);

        const msg4 = add([
            text("🎓 Go Crush It! 🌟", { size: 26 }),
            pos(centerX, centerY + 70),
            anchor("center"),
            color(63, 81, 181),
            opacity(0),
            z(20),
        ]);

        // Animate messages appearing
        wait(0.3, () => tween(0, 1, 0.5, (v) => msg1.opacity = v));
        wait(0.8, () => tween(0, 1, 0.5, (v) => msg2.opacity = v));
        wait(1.3, () => tween(0, 1, 0.5, (v) => msg3.opacity = v));
        wait(1.8, () => {
            tween(0, 1, 0.5, (v) => msg4.opacity = v);
            startCelebration();
        });
    }

    function startCelebration() {
        // MASSIVE celebration!

        // Fireworks
        loop(0.3, () => {
            const fx = rand(0, width());
            const fy = rand(50, height() / 2);
            const colors = ["❤️", "🧡", "💛", "💚", "💙", "💜", "💖", "✨", "⭐", "🌟"];

            for (let i = 0; i < 15; i++) {
                add([
                    text(colors[Math.floor(rand(0, colors.length))], { size: rand(15, 30) }),
                    pos(fx, fy),
                    anchor("center"),
                    lifespan(2),
                    move(rand(0, 360), rand(100, 300)),
                    z(50),
                ]);
            }
        });

        // Confetti rain
        loop(0.1, () => {
            add([
                text(["🎊", "🎉", "✨", "💫", "⭐"][Math.floor(rand(0, 5))], { size: rand(20, 35) }),
                pos(rand(0, width()), -30),
                anchor("center"),
                lifespan(5),
                move(rand(170, 190), rand(100, 200)),
                z(30),
            ]);
        });

        // Flowers blooming from bottom
        loop(0.4, () => {
            const flowers = ["🌸", "🌺", "🌷", "🌹", "🌻", "💐", "🌼"];
            add([
                text(flowers[Math.floor(rand(0, flowers.length))], { size: rand(30, 50) }),
                pos(rand(0, width()), height() + 30),
                anchor("center"),
                lifespan(4),
                move(UP, rand(80, 150)),
                z(25),
            ]);
        });

        // Side hearts
        loop(0.6, () => {
            // Left side
            add([
                text("💕", { size: rand(25, 40) }),
                pos(-20, rand(0, height())),
                anchor("center"),
                lifespan(5),
                move(RIGHT, rand(50, 100)),
                z(20),
            ]);
            // Right side
            add([
                text("💕", { size: rand(25, 40) }),
                pos(width() + 20, rand(0, height())),
                anchor("center"),
                lifespan(5),
                move(LEFT, rand(50, 100)),
                z(20),
            ]);
        });

        // Footer message
        wait(2, () => {
            add([
                text(`Made with all my love, for you 💕`, { size: 20 }),
                pos(centerX, height() - 60),
                anchor("center"),
                color(255, 255, 255),
                z(100),
            ]);

            const replay = add([
                text("💖 Tap to experience again 💖", { size: 18 }),
                pos(centerX, height() - 30),
                anchor("center"),
                color(255, 200, 220),
                z(100),
            ]);
            replay.onUpdate(() => {
                replay.opacity = 0.6 + Math.sin(time() * 3) * 0.4;
            });

            onClick(() => go("title"));
            onKeyPress("space", () => go("title"));
        });
    }

    // Ambient sparkles
    loop(0.2, () => {
        add([
            text("✨", { size: rand(10, 25) }),
            pos(rand(0, width()), rand(0, height())),
            anchor("center"),
            lifespan(1),
            z(15),
        ]);
    });
});

// Start the game!
go("title");
