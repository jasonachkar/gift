// Asset Generator - Creates programmatic graphics for the game
// This allows the game to work beautifully without external assets

export default class AssetGenerator {
    static generateParticles(scene) {
        // Generate heart particle
        const heart = scene.add.graphics();
        heart.fillStyle(0xFF69B4, 1);
        heart.fillCircle(8, 8, 6);
        heart.fillCircle(14, 8, 6);
        heart.fillTriangle(2, 10, 20, 10, 11, 20);
        heart.generateTexture('heart', 24, 24);
        heart.destroy();

        // Generate sparkle particle
        const sparkle = scene.add.graphics();
        sparkle.fillStyle(0xFFFFFF, 1);
        sparkle.fillStar(12, 12, 5, 12, 6);
        sparkle.generateTexture('sparkle', 24, 24);
        sparkle.destroy();

        // Generate petal particle
        const petal = scene.add.graphics();
        petal.fillStyle(0xFFB6D9, 1);
        petal.fillEllipse(8, 8, 12, 16);
        petal.generateTexture('petal', 16, 16);
        petal.destroy();

        // Generate confetti particle
        const confetti = scene.add.graphics();
        confetti.fillStyle(0xFF6B9D, 1);
        confetti.fillRect(0, 0, 8, 12);
        confetti.generateTexture('confetti', 8, 12);
        confetti.destroy();
    }

    static generateCharacters(scene) {
        // Girl character (pink dress)
        const girl = scene.add.graphics();

        // Body (pink dress)
        girl.fillStyle(0xFF69B4, 1);
        girl.fillEllipse(32, 40, 24, 32);

        // Head (skin tone)
        girl.fillStyle(0xFFDBB5, 1);
        girl.fillCircle(32, 20, 12);

        // Hair (brown)
        girl.fillStyle(0x8B4513, 1);
        girl.fillEllipse(32, 16, 20, 16);

        // Eyes
        girl.fillStyle(0x000000, 1);
        girl.fillCircle(28, 20, 2);
        girl.fillCircle(36, 20, 2);

        // Smile
        girl.lineStyle(2, 0x000000, 1);
        girl.arc(32, 22, 4, 0, Math.PI, false);
        girl.strokePath();

        // Arms
        girl.fillStyle(0xFFDBB5, 1);
        girl.fillRect(16, 32, 6, 20);
        girl.fillRect(42, 32, 6, 20);

        // Legs
        girl.fillStyle(0xFFDBB5, 1);
        girl.fillRect(24, 54, 6, 14);
        girl.fillRect(34, 54, 6, 14);

        // Shoes
        girl.fillStyle(0x8B0000, 1);
        girl.fillRect(22, 66, 10, 4);
        girl.fillRect(32, 66, 10, 4);

        girl.generateTexture('girl-sprite', 64, 72);
        girl.destroy();

        // Boy character (blue shirt)
        const boy = scene.add.graphics();

        // Body (blue shirt)
        boy.fillStyle(0x4169E1, 1);
        boy.fillRect(20, 32, 24, 24);

        // Head (skin tone)
        boy.fillStyle(0xFFDBB5, 1);
        boy.fillCircle(32, 20, 12);

        // Hair (dark brown)
        boy.fillStyle(0x654321, 1);
        boy.fillRect(22, 10, 20, 12);

        // Eyes
        boy.fillStyle(0x000000, 1);
        boy.fillCircle(28, 20, 2);
        boy.fillCircle(36, 20, 2);

        // Smile
        boy.lineStyle(2, 0x000000, 1);
        boy.arc(32, 22, 4, 0, Math.PI, false);
        boy.strokePath();

        // Arms
        boy.fillStyle(0xFFDBB5, 1);
        boy.fillRect(14, 34, 6, 18);
        boy.fillRect(44, 34, 6, 18);

        // Pants (brown)
        boy.fillStyle(0x8B4513, 1);
        boy.fillRect(20, 56, 10, 12);
        boy.fillRect(34, 56, 10, 12);

        // Shoes
        boy.fillStyle(0x000000, 1);
        boy.fillRect(18, 66, 12, 4);
        boy.fillRect(34, 66, 12, 4);

        boy.generateTexture('boy-sprite', 64, 72);
        boy.destroy();

        // Couple (embracing)
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

    static generateEnvironment(scene) {
        // Ground tile
        const ground = scene.add.graphics();
        ground.fillStyle(0x4C9900, 1);
        ground.fillRect(0, 0, 64, 64);
        ground.fillStyle(0x3A7300, 1);
        ground.fillRect(0, 0, 32, 32);
        ground.fillRect(32, 32, 32, 32);
        ground.generateTexture('campus-ground', 64, 64);
        ground.destroy();

        // Tree
        const tree = scene.add.graphics();
        tree.fillStyle(0x8B4513, 1);
        tree.fillRect(45, 40, 10, 60);
        tree.fillStyle(0x228B22, 1);
        tree.fillCircle(50, 30, 30);
        tree.fillCircle(30, 35, 25);
        tree.fillCircle(70, 35, 25);
        tree.generateTexture('tree', 100, 100);
        tree.destroy();

        // Building
        const building = scene.add.graphics();
        building.fillStyle(0xD3D3D3, 1);
        building.fillRect(0, 0, 80, 120);
        building.fillStyle(0x87CEEB, 1);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                building.fillRect(10 + col * 20, 10 + row * 25, 15, 20);
            }
        }
        building.generateTexture('building', 80, 120);
        building.destroy();

        // Bench
        const bench = scene.add.graphics();
        bench.fillStyle(0x8B4513, 1);
        bench.fillRect(0, 10, 60, 8);
        bench.fillRect(5, 18, 4, 15);
        bench.fillRect(51, 18, 4, 15);
        bench.fillRect(0, 0, 6, 12);
        bench.fillRect(54, 0, 6, 12);
        bench.generateTexture('bench', 60, 33);
        bench.destroy();

        // Flower
        const flower = scene.add.graphics();
        flower.fillStyle(0xFF69B4, 1);
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72) * Math.PI / 180;
            flower.fillCircle(15 + Math.cos(angle) * 8, 15 + Math.sin(angle) * 8, 6);
        }
        flower.fillStyle(0xFFFF00, 1);
        flower.fillCircle(15, 15, 5);
        flower.fillStyle(0x228B22, 1);
        flower.fillRect(13, 20, 4, 20);
        flower.generateTexture('flower', 30, 40);
        flower.destroy();
    }

    static generateBackgrounds(scene) {
        const { width, height } = scene.cameras.main;

        // Sky layer (gradient)
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
        sky.generateTexture('sky-layer', 1280, 400);
        sky.destroy();

        // Distant buildings silhouette
        const buildings = scene.add.graphics();
        buildings.fillStyle(0x708090, 0.3);
        for (let i = 0; i < 10; i++) {
            const h = Phaser.Math.Between(80, 150);
            buildings.fillRect(i * 130, 300 - h, 120, h);
        }
        buildings.generateTexture('distant-buildings', 1280, 300);
        buildings.destroy();

        // Trees layer
        const trees = scene.add.graphics();
        trees.fillStyle(0x2E7D32, 0.5);
        for (let i = 0; i < 15; i++) {
            const x = i * 90;
            trees.fillEllipse(x + 40, 350, 80, 100);
        }
        trees.generateTexture('trees-layer', 1280, 400);
        trees.destroy();

        // Garden background
        const garden = scene.add.graphics();
        garden.fillStyle(0xFFDAE9, 1);
        garden.fillRect(0, 0, 1280, 720);
        garden.fillStyle(0x90EE90, 0.3);
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

    static generateAll(scene) {
        console.log('🎨 Generating programmatic graphics...');
        this.generateParticles(scene);
        this.generateCharacters(scene);
        this.generateEnvironment(scene);
        this.generateBackgrounds(scene);
        console.log('✅ All graphics generated!');
    }
}
