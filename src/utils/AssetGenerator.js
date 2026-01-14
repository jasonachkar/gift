// Asset Generator - Creates programmatic graphics for the game
// This allows the game to work beautifully without external assets

export default class AssetGenerator {
    static generateParticles(scene) {
        // Generate heart particle
        if (!scene.textures.exists('heart')) {
            const heart = scene.add.graphics();
            // Base heart
            heart.fillStyle(0xD81B60, 1);
            heart.fillCircle(8, 8, 7);
            heart.fillCircle(16, 8, 7);
            heart.fillTriangle(1, 10, 23, 10, 12, 22);
            // Inner highlight
            heart.fillStyle(0xFF8FC4, 0.95);
            heart.fillCircle(8, 8, 5);
            heart.fillCircle(15, 8, 5);
            heart.fillTriangle(3, 11, 21, 11, 12, 20);
            // Specular sparkle
            heart.fillStyle(0xFFFFFF, 0.7);
            heart.fillCircle(6, 6, 2);
            heart.generateTexture('heart', 24, 24);
            heart.destroy();
        }

        // Generate sparkle particle
        if (!scene.textures.exists('sparkle')) {
            const sparkle = scene.add.graphics();
            sparkle.fillStyle(0xFFFFFF, 1);
            sparkle.fillRect(10, 0, 4, 24);
            sparkle.fillRect(0, 10, 24, 4);
            sparkle.fillStyle(0xFFFFFF, 0.7);
            sparkle.fillRect(11, 2, 2, 20);
            sparkle.fillRect(2, 11, 20, 2);
            sparkle.fillCircle(12, 12, 3);
            sparkle.generateTexture('sparkle', 24, 24);
            sparkle.destroy();
        }

        // Generate petal particle
        if (!scene.textures.exists('petal')) {
            const petal = scene.add.graphics();
            petal.fillStyle(0xFFB6D9, 1);
            petal.fillEllipse(8, 8, 12, 16);
            petal.generateTexture('petal', 16, 16);
            petal.destroy();
        }

        // Generate confetti particle
        if (!scene.textures.exists('confetti')) {
            const confetti = scene.add.graphics();
            confetti.fillStyle(0xFF6B9D, 1);
            confetti.fillRect(0, 0, 8, 12);
            confetti.generateTexture('confetti', 8, 12);
            confetti.destroy();
        }

        // Generate dust particle
        if (!scene.textures.exists('dust')) {
            const dust = scene.add.graphics();
            dust.fillStyle(0xC2B280, 0.6);
            dust.fillCircle(10, 12, 7);
            dust.fillStyle(0xC2B280, 0.35);
            dust.fillCircle(16, 10, 5);
            dust.generateTexture('dust', 24, 24);
            dust.destroy();
        }
    }

    static generateCharacters(scene) {
        // Girl character (pink dress) - Enhanced with more detail
        if (!scene.textures.exists('girl-sprite')) {
            const girl = scene.add.graphics();

            // Shadow
            girl.fillStyle(0x000000, 0.2);
            girl.fillEllipse(32, 70, 20, 4);

            // Legs
            girl.fillStyle(0xFFDBB5, 1);
            girl.fillRoundedRect(24, 54, 6, 14, 2);
            girl.fillRoundedRect(34, 54, 6, 14, 2);

            // Shoes (red)
            girl.fillStyle(0xDC143C, 1);
            girl.fillRoundedRect(22, 66, 10, 5, 2);
            girl.fillRoundedRect(32, 66, 10, 5, 2);
            // Shoe highlights
            girl.fillStyle(0xFFFFFF, 0.4);
            girl.fillRect(24, 67, 3, 2);
            girl.fillRect(34, 67, 3, 2);

            // Body (pink dress with details)
            girl.fillStyle(0xFF69B4, 1);
            girl.fillEllipse(32, 42, 26, 34);
            // Dress highlight
            girl.fillStyle(0xFFB6C1, 1);
            girl.fillEllipse(28, 38, 12, 16);
            // Dress shadow
            girl.fillStyle(0xDB7093, 1);
            girl.fillEllipse(36, 48, 10, 12);

            // Arms
            girl.fillStyle(0xFFDBB5, 1);
            girl.fillRoundedRect(16, 34, 7, 22, 3);
            girl.fillRoundedRect(41, 34, 7, 22, 3);
            // Hands
            girl.fillCircle(19, 54, 4);
            girl.fillCircle(45, 54, 4);

            // Neck
            girl.fillStyle(0xFFDBB5, 1);
            girl.fillRect(28, 28, 8, 6);

            // Head (skin tone with shading)
            girl.fillStyle(0xFFDBB5, 1);
            girl.fillCircle(32, 20, 13);
            // Face highlight
            girl.fillStyle(0xFFE4C4, 1);
            girl.fillCircle(28, 18, 6);

            // Hair (long brown hair)
            girl.fillStyle(0x8B4513, 1);
            girl.fillEllipse(32, 14, 22, 18);
            // Hair strands
            girl.fillStyle(0x654321, 1);
            girl.fillEllipse(24, 16, 8, 14);
            girl.fillEllipse(40, 16, 8, 14);
            // Hair highlight
            girl.fillStyle(0xA0522D, 1);
            girl.fillEllipse(30, 12, 8, 8);

            // Eyes (larger and more detailed)
            girl.fillStyle(0xFFFFFF, 1);
            girl.fillCircle(27, 20, 3);
            girl.fillCircle(37, 20, 3);
            girl.fillStyle(0x4169E1, 1);
            girl.fillCircle(27, 20, 2);
            girl.fillCircle(37, 20, 2);
            girl.fillStyle(0x000000, 1);
            girl.fillCircle(27, 20, 1);
            girl.fillCircle(37, 20, 1);
            // Eye highlights
            girl.fillStyle(0xFFFFFF, 0.8);
            girl.fillCircle(27.5, 19.5, 0.8);
            girl.fillCircle(37.5, 19.5, 0.8);

            // Eyebrows
            girl.lineStyle(1.5, 0x654321, 1);
            girl.beginPath();
            girl.arc(27, 17, 3, Math.PI * 0.8, Math.PI * 1.3);
            girl.strokePath();
            girl.beginPath();
            girl.arc(37, 17, 3, Math.PI * 1.7, Math.PI * 0.2);
            girl.strokePath();

            // Smile
            girl.lineStyle(2, 0xFF1493, 1);
            girl.beginPath();
            girl.arc(32, 23, 5, 0, Math.PI, false);
            girl.strokePath();

            // Blush
            girl.fillStyle(0xFF69B4, 0.3);
            girl.fillCircle(22, 24, 3);
            girl.fillCircle(42, 24, 3);

            girl.generateTexture('girl-sprite', 64, 72);
            girl.destroy();
        }

        // Boy character (blue shirt) - Enhanced with more detail
        if (!scene.textures.exists('boy-sprite')) {
            const boy = scene.add.graphics();

            // Shadow
            boy.fillStyle(0x000000, 0.2);
            boy.fillEllipse(32, 70, 20, 4);

            // Pants (dark jeans)
            boy.fillStyle(0x1E3A5F, 1);
            boy.fillRoundedRect(20, 56, 11, 13, 2);
            boy.fillRoundedRect(33, 56, 11, 13, 2);
            // Pants highlights
            boy.fillStyle(0x2E5A8F, 1);
            boy.fillRect(21, 57, 3, 10);
            boy.fillRect(34, 57, 3, 10);

            // Shoes (black sneakers)
            boy.fillStyle(0x1C1C1C, 1);
            boy.fillRoundedRect(18, 66, 13, 5, 2);
            boy.fillRoundedRect(33, 66, 13, 5, 2);
            // Shoe soles
            boy.fillStyle(0xFFFFFF, 1);
            boy.fillRect(18, 70, 13, 2);
            boy.fillRect(33, 70, 13, 2);
            // Shoe laces
            boy.fillStyle(0xFFFFFF, 0.6);
            boy.fillRect(22, 67, 2, 1);
            boy.fillRect(37, 67, 2, 1);

            // Body (blue shirt with details)
            boy.fillStyle(0x4169E1, 1);
            boy.fillRoundedRect(19, 34, 26, 24, 4);
            // Shirt collar
            boy.fillStyle(0x1E3A8A, 1);
            boy.fillTriangle(28, 34, 36, 34, 32, 38);
            // Shirt highlight
            boy.fillStyle(0x6495ED, 1);
            boy.fillRoundedRect(22, 36, 10, 18, 3);

            // Arms
            boy.fillStyle(0xFFDBB5, 1);
            boy.fillRoundedRect(13, 36, 7, 20, 3);
            boy.fillRoundedRect(44, 36, 7, 20, 3);
            // Hands
            boy.fillCircle(16, 54, 4);
            boy.fillCircle(47, 54, 4);

            // Neck
            boy.fillStyle(0xFFDBB5, 1);
            boy.fillRect(28, 28, 8, 7);

            // Head (skin tone with shading)
            boy.fillStyle(0xFFDBB5, 1);
            boy.fillCircle(32, 20, 13);
            // Face highlight
            boy.fillStyle(0xFFE4C4, 1);
            boy.fillCircle(29, 18, 6);

            // Hair (short dark hair)
            boy.fillStyle(0x2C1810, 1);
            boy.fillEllipse(32, 12, 20, 14);
            // Hair texture
            boy.fillStyle(0x1A0F08, 1);
            boy.fillRect(23, 10, 3, 10);
            boy.fillRect(29, 9, 3, 11);
            boy.fillRect(35, 9, 3, 11);
            boy.fillRect(41, 10, 3, 10);

            // Ears
            boy.fillStyle(0xFFDBB5, 1);
            boy.fillCircle(19, 22, 3);
            boy.fillCircle(45, 22, 3);

            // Eyes (larger and more detailed)
            boy.fillStyle(0xFFFFFF, 1);
            boy.fillCircle(27, 20, 3);
            boy.fillCircle(37, 20, 3);
            boy.fillStyle(0x654321, 1);
            boy.fillCircle(27, 20, 2);
            boy.fillCircle(37, 20, 2);
            boy.fillStyle(0x000000, 1);
            boy.fillCircle(27, 20, 1);
            boy.fillCircle(37, 20, 1);
            // Eye highlights
            boy.fillStyle(0xFFFFFF, 0.8);
            boy.fillCircle(27.5, 19.5, 0.8);
            boy.fillCircle(37.5, 19.5, 0.8);

            // Eyebrows
            boy.lineStyle(1.5, 0x1A0F08, 1);
            boy.beginPath();
            boy.arc(27, 17, 3, Math.PI * 0.8, Math.PI * 1.3);
            boy.strokePath();
            boy.beginPath();
            boy.arc(37, 17, 3, Math.PI * 1.7, Math.PI * 0.2);
            boy.strokePath();

            // Smile
            boy.lineStyle(2, 0x8B4513, 1);
            boy.beginPath();
            boy.arc(32, 23, 5, 0, Math.PI, false);
            boy.strokePath();

            boy.generateTexture('boy-sprite', 64, 72);
            boy.destroy();
        }

        // Couple (embracing)
        if (!scene.textures.exists('couple-sprite')) {
            const couple = scene.add.graphics();

            // Girl on left (pink)
            couple.fillStyle(0xFF69B4, 1);
            couple.fillEllipse(24, 36, 20, 28);
            couple.fillStyle(0xFFDBB5, 1);
            couple.fillCircle(24, 18, 10);
            couple.fillStyle(0x8B4513, 1);
            couple.fillEllipse(24, 14, 16, 12);

            // Boy on right (blue)
            couple.fillStyle(0x4169E1, 1);
            couple.fillRect(32, 28, 20, 20);
            couple.fillStyle(0xFFDBB5, 1);
            couple.fillCircle(42, 18, 10);
            couple.fillStyle(0x654321, 1);
            couple.fillRect(34, 10, 16, 10);

            // Heart between them
            couple.fillStyle(0xFF0000, 1);
            couple.fillCircle(30, 32, 4);
            couple.fillCircle(36, 32, 4);
            couple.fillTriangle(26, 34, 40, 34, 33, 42);

            couple.generateTexture('couple-sprite', 64, 72);
            couple.destroy();
        }
    }

    static generateEnvironment(scene) {
        // Ground tile
        if (!scene.textures.exists('campus-ground')) {
            const ground = scene.add.graphics();
            ground.fillStyle(0x3F8F2E, 1);
            ground.fillRect(0, 0, 64, 64);
            ground.fillStyle(0x367A28, 1);
            ground.fillRect(0, 36, 64, 28);
            ground.fillStyle(0x4FAF39, 0.9);
            for (let i = 0; i < 24; i++) {
                const x = (i * 5) % 64;
                const y = (i * 11) % 64;
                ground.fillRect(x, y, 2, 4);
            }
            ground.generateTexture('campus-ground', 64, 64);
            ground.destroy();
        }

        // Tree
        if (!scene.textures.exists('tree')) {
            const tree = scene.add.graphics();
            tree.fillStyle(0x6B3E1E, 1);
            tree.fillRect(46, 40, 8, 60);
            tree.fillStyle(0x8B5A2B, 1);
            tree.fillRect(46, 40, 3, 60);
            tree.fillStyle(0x2E8B57, 1);
            tree.fillCircle(50, 30, 30);
            tree.fillCircle(30, 35, 25);
            tree.fillCircle(70, 35, 25);
            tree.fillStyle(0x3CB371, 0.9);
            tree.fillCircle(40, 25, 16);
            tree.fillCircle(60, 22, 14);
            tree.fillStyle(0x1E6B3A, 0.9);
            tree.fillEllipse(50, 45, 50, 20);
            tree.generateTexture('tree', 100, 100);
            tree.destroy();
        }

        // Building
        if (!scene.textures.exists('building')) {
            const building = scene.add.graphics();
            building.fillStyle(0xD5D5D5, 1);
            building.fillRect(0, 0, 80, 120);
            building.fillStyle(0xC0C0C0, 1);
            building.fillRect(0, 0, 80, 12);
            building.fillStyle(0xB0B0B0, 1);
            building.fillRect(0, 0, 6, 120);
            building.fillStyle(0x87CEEB, 1);
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 3; col++) {
                    building.fillRect(12 + col * 20, 18 + row * 24, 14, 18);
                }
            }
            building.fillStyle(0x6B4E2E, 1);
            building.fillRect(32, 98, 16, 22);
            building.generateTexture('building', 80, 120);
            building.destroy();
        }

        // Bench
        if (!scene.textures.exists('bench')) {
            const bench = scene.add.graphics();
            bench.fillStyle(0x7A3E12, 1);
            bench.fillRect(0, 12, 60, 8);
            bench.fillStyle(0x8B5A2B, 1);
            bench.fillRect(0, 6, 60, 6);
            bench.fillRect(0, 0, 60, 6);
            bench.fillStyle(0x5E2E0F, 1);
            bench.fillRect(5, 18, 4, 15);
            bench.fillRect(51, 18, 4, 15);
            bench.fillRect(0, 0, 6, 12);
            bench.fillRect(54, 0, 6, 12);
            bench.generateTexture('bench', 60, 33);
            bench.destroy();
        }

        // Cheesecake slice
        if (!scene.textures.exists('cheesecake-slice')) {
            const cake = scene.add.graphics();
            cake.fillStyle(0xD9A15F, 1);
            cake.fillRect(6, 28, 68, 14);
            cake.fillStyle(0xF3D9B1, 1);
            cake.fillRoundedRect(6, 10, 68, 20, 6);
            cake.fillStyle(0xEFA1C6, 1);
            cake.fillRoundedRect(6, 6, 68, 8, 4);
            cake.fillStyle(0xFFFFFF, 0.7);
            cake.fillRect(10, 12, 8, 10);
            cake.generateTexture('cheesecake-slice', 80, 50);
            cake.destroy();
        }

        // Cheesecake plate
        if (!scene.textures.exists('cheesecake-plate')) {
            const plate = scene.add.graphics();
            plate.fillStyle(0xF8F8F8, 1);
            plate.fillEllipse(50, 20, 100, 30);
            plate.fillStyle(0xE0E0E0, 1);
            plate.fillEllipse(50, 20, 80, 20);
            plate.generateTexture('cheesecake-plate', 100, 40);
            plate.destroy();
        }

        // Cheesecake fork
        if (!scene.textures.exists('cheesecake-fork')) {
            const fork = scene.add.graphics();
            fork.fillStyle(0xC0C0C0, 1);
            fork.fillRect(4, 4, 4, 28);
            fork.fillRect(0, 0, 12, 4);
            fork.fillRect(0, 0, 2, 6);
            fork.fillRect(5, 0, 2, 6);
            fork.fillRect(10, 0, 2, 6);
            fork.generateTexture('cheesecake-fork', 16, 36);
            fork.destroy();
        }

        // Flower
        if (!scene.textures.exists('flower')) {
            const flower = scene.add.graphics();
            flower.fillStyle(0xFF6FB1, 1);
            for (let i = 0; i < 5; i++) {
                const angle = (i * 72) * Math.PI / 180;
                flower.fillCircle(15 + Math.cos(angle) * 8, 15 + Math.sin(angle) * 8, 6);
            }
            flower.fillStyle(0xFF9FD3, 0.9);
            for (let i = 0; i < 5; i++) {
                const angle = (i * 72) * Math.PI / 180;
                flower.fillCircle(15 + Math.cos(angle) * 6, 15 + Math.sin(angle) * 6, 3);
            }
            flower.fillStyle(0xFFFF00, 1);
            flower.fillCircle(15, 15, 5);
            flower.fillStyle(0x228B22, 1);
            flower.fillRect(13, 20, 4, 20);
            flower.generateTexture('flower', 30, 40);
            flower.destroy();
        }

        // Lamp post
        if (!scene.textures.exists('lamp-post')) {
            const lamp = scene.add.graphics();
            lamp.fillStyle(0x3A3A3A, 1);
            lamp.fillRect(18, 20, 4, 92);
            lamp.fillRect(14, 108, 12, 10);
            lamp.fillStyle(0xFFD27D, 1);
            lamp.fillCircle(20, 16, 8);
            lamp.fillStyle(0xFFF2B2, 0.6);
            lamp.fillCircle(20, 16, 12);
            lamp.generateTexture('lamp-post', 40, 140);
            lamp.destroy();
        }

        // Campus sign
        if (!scene.textures.exists('campus-sign')) {
            const sign = scene.add.graphics();
            sign.fillStyle(0x8B5A2B, 1);
            sign.fillRect(8, 40, 6, 50);
            sign.fillRect(46, 40, 6, 50);
            sign.fillStyle(0xF5DEB3, 1);
            sign.fillRect(0, 0, 60, 34);
            sign.lineStyle(2, 0xA67C52, 1);
            sign.strokeRect(1, 1, 58, 32);
            sign.generateTexture('campus-sign', 60, 90);
            sign.destroy();
        }

        // Campus arch
        if (!scene.textures.exists('campus-arch')) {
            const arch = scene.add.graphics();
            arch.fillStyle(0xC9C9C9, 1);
            arch.fillRect(0, 40, 26, 80);
            arch.fillRect(94, 40, 26, 80);
            arch.fillRect(0, 20, 120, 20);
            arch.fillStyle(0xB0B0B0, 1);
            arch.fillRect(10, 40, 10, 80);
            arch.fillRect(100, 40, 10, 80);
            arch.generateTexture('campus-arch', 120, 120);
            arch.destroy();
        }
    }

    static generateBackgrounds(scene) {
        const { width, height } = scene.cameras.main;

        // Sky layer (gradient)
        if (!scene.textures.exists('sky-layer')) {
            const sky = scene.add.graphics();
            for (let i = 0; i < 400; i++) {
                const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    { r: 135, g: 206, b: 235 },
                    { r: 255, g: 218, b: 185 },
                    400,
                    i
                );
                sky.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
                sky.fillRect(0, i, 1280, 1);
            }
            // Sun glow
            sky.fillStyle(0xFFE3A3, 0.9);
            sky.fillCircle(1080, 80, 45);
            sky.fillStyle(0xFFF1C4, 0.5);
            sky.fillCircle(1080, 80, 70);
            // Soft clouds
            sky.fillStyle(0xFFFFFF, 0.6);
            sky.fillEllipse(240, 80, 120, 40);
            sky.fillEllipse(300, 80, 90, 30);
            sky.fillEllipse(520, 120, 140, 50);
            sky.fillEllipse(610, 120, 110, 36);
            sky.generateTexture('sky-layer', 1280, 400);
            sky.destroy();
        }

        // Distant buildings silhouette
        if (!scene.textures.exists('distant-buildings')) {
            const buildings = scene.add.graphics();
            buildings.fillStyle(0x5F6D7A, 0.4);
            for (let i = 0; i < 10; i++) {
                const h = Phaser.Math.Between(80, 150);
                buildings.fillRect(i * 130, 300 - h, 120, h);
                buildings.fillStyle(0x7A8794, 0.25);
                buildings.fillRect(i * 130 + 10, 300 - h + 10, 100, h - 10);
                buildings.fillStyle(0x5F6D7A, 0.4);
            }
            buildings.generateTexture('distant-buildings', 1280, 300);
            buildings.destroy();
        }

        // Trees layer
        if (!scene.textures.exists('trees-layer')) {
            const trees = scene.add.graphics();
            trees.fillStyle(0x2E7D32, 0.45);
            for (let i = 0; i < 15; i++) {
                const x = i * 90;
                trees.fillEllipse(x + 40, 350, 80, 100);
            }
            trees.fillStyle(0x3E8D3A, 0.35);
            for (let i = 0; i < 12; i++) {
                const x = i * 110;
                trees.fillEllipse(x + 60, 330, 90, 90);
            }
            trees.generateTexture('trees-layer', 1280, 400);
            trees.destroy();
        }

        // Garden background
        if (!scene.textures.exists('garden-bg')) {
            const garden = scene.add.graphics();
            for (let i = 0; i < 720; i++) {
                const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    { r: 255, g: 218, b: 233 },
                    { r: 220, g: 255, b: 220 },
                    720,
                    i
                );
                garden.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
                garden.fillRect(0, i, 1280, 1);
            }
            garden.fillStyle(0x90EE90, 0.25);
            for (let i = 0; i < 50; i++) {
                garden.fillCircle(
                    Phaser.Math.Between(0, 1280),
                    Phaser.Math.Between(0, 720),
                    Phaser.Math.Between(20, 40)
                );
            }
            garden.generateTexture('garden-bg', 1280, 720);
            garden.destroy();
        }
    }

    static generateAll(scene) {
        console.log('🎨 Generating missing programmatic graphics...');
        this.generateParticles(scene);
        this.generateCharacters(scene);
        this.generateEnvironment(scene);
        this.generateBackgrounds(scene);
        console.log('✅ All graphics generated!');
    }
}
