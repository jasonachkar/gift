# Journey to You - Implementation Guide

## 🎉 What's Been Completed

### ✅ Project Structure
- ✅ Phaser.js and Vite installed and configured
- ✅ Complete file structure created with organized folders
- ✅ All 6 scenes implemented with full game logic:
  - **BootScene.js** - Audio unlock and splash screen
  - **PreloadScene.js** - Asset loading with progress bar
  - **TitleScene.js** - Animated title screen with particles
  - **CampusWalkScene.js** - Full platformer with physics, collectibles, progress tracking
  - **MeetingScene.js** - Cinematic sequence with dialogue and hug animation
  - **RevealScene.js** - Epic message reveal with massive celebration effects
- ✅ Support systems implemented:
  - **DialogueSystem.js** - Typewriter effect and thought bubbles
  - **AudioManager.js** - Music and SFX management with fade in/out
- ✅ Game is **playable right now** with emoji placeholders!

### 🎮 Current Status
The game is **fully functional** and running at http://localhost:3000 (dev server is active).

You can play through the entire experience:
1. Tap to start (unlocks audio)
2. Watch loading screen
3. Title screen with animations
4. Campus walk platformer (arrow keys to move, space to jump)
5. Meeting scene with romantic dialogue
6. Epic reveal with celebration

**However:** It currently uses emoji characters and placeholders instead of sprite graphics, music, and sound effects.

---

## 📥 Next Steps: Download Assets

To transform this into the **professional, beautiful experience** from the plan, you need to download free assets and integrate them. Here's exactly what to do:

### Step 1: Download Character Sprites

**Primary Source: Kenney Platformer Characters** (CC0 - Free)
- URL: https://www.kenney.nl/assets/platformer-characters
- What you need:
  - Female character sprite sheet (for girlfriend)
  - Male character sprite sheet (for boyfriend)
  - Look for sprite sheets with **idle**, **walk**, and **jump** animations
- Save to: `assets/sprites/characters/girl/` and `assets/sprites/characters/boy/`
- File format: PNG sprite sheets
- Naming examples:
  - `girl-idle.png` (idle animation frames)
  - `girl-walk.png` (walking animation frames)
  - `girl-jump.png` (jumping animation frames)
  - `boy-idle.png`
  - `boy-walk.png`

**Note:** You may need to create or find a "couple hug" image. Options:
- Use an image editor to combine two characters close together
- Search for "couple sprite pixel art" on itch.io
- Save as: `assets/sprites/characters/couple-hug.png`

---

### Step 2: Download Environment Assets

**Primary Source: Kenney Platformer Pack Redux** (CC0 - Free)
- URL: https://kenney.nl/assets/platformer-pack-redux
- What you need:
  - Ground tile texture → `assets/tilesets/campus-ground.png`
  - Building sprites → `assets/tilesets/building.png`
  - Tree sprites → `assets/tilesets/tree.png`
  - Bench sprite → `assets/tilesets/bench.png`
  - Other decorative elements

**Parallax Backgrounds:**
- Search: "free parallax background" on itch.io or OpenGameArt.org
- What you need:
  - Sky layer → `assets/backgrounds/sky-layer.png`
  - Distant buildings layer → `assets/backgrounds/distant-buildings.png`
  - Trees layer → `assets/backgrounds/trees-layer.png`
  - Garden background → `assets/backgrounds/garden-bg.png`

---

### Step 3: Download Music

**Primary Source: Incompetech by Kevin MacLeod** (CC-BY - Free with attribution)
- URL: https://incompetech.com
- Browse: Romantic/Sentimental category

**Recommended tracks** (or similar):
1. **Title Screen**: "Wallpaper" or "Feather Waltz"
   - Save as: `assets/audio/music/title-theme.mp3`

2. **Campus Walk**: "Fluffing a Duck" (upbeat, playful)
   - Save as: `assets/audio/music/campus-walk.mp3`

3. **Meeting Scene**: "Romantic Moments" or "First Kiss"
   - Save as: `assets/audio/music/meeting-romance.mp3`

4. **Reveal Scene**: "Celebration" or "Gaslamp Funworks"
   - Save as: `assets/audio/music/celebration.mp3`

**Alternative (No attribution required):**
- URL: https://www.chosic.com/free-music/all/?sort=&attribution=no
- Filter: "No attribution required"

**Important:** If using CC-BY music from Incompetech:
- Add attribution text to the game (e.g., in footer of reveal scene)
- Example: "Music by Kevin MacLeod (incompetech.com) Licensed under CC-BY 4.0"

---

### Step 4: Download Sound Effects

**Primary Source: Freesound.org** (Various licenses - Filter by CC0)
- URL: https://freesound.org
- Filter: Creative Commons 0 (CC0) for no attribution required

**Sound effects needed:**
1. **footstep.mp3** - Search: "footstep grass" or "walk concrete"
2. **jump.mp3** - Search: "jump whoosh" or "bounce"
3. **heart-collect.mp3** - Search: "collect coin chime" (can pitch-shift in game)
4. **hug.mp3** - Search: "magic sparkle" or "heart beat"
5. **firework.mp3** - Search: "firework explosion"
6. **whoosh.mp3** - Search: "whoosh" or "swoosh"

Save all to: `assets/audio/sfx/`

**Alternative Source: Kenney Audio**
- URL: https://kenney.nl/assets?q=audio
- Packs: "Interface Sounds" and "Digital Audio"
- License: CC0 (no attribution)

---

### Step 5: Create/Download Particle Textures

**Option 1: Kenney Particle Pack** (CC0 - Free)
- URL: https://kenney.nl/assets/particle-pack
- Download star/sparkle sprites
- Save to: `assets/sprites/particles/`

**Option 2: Create Simple Particles** (5 minutes with any image editor)
You need 4 simple images:
1. **heart.png** - 16x16px white heart on transparent background
2. **sparkle.png** - 16x16px white star/sparkle on transparent background
3. **petal.png** - 8x8px white oval/petal on transparent background
4. **confetti.png** - 8x12px colored rectangle(s) on transparent background

Tools you can use:
- Photoshop / GIMP (free)
- Figma (free, web-based)
- Paint.NET (free)
- Or just search "free heart sprite transparent" and download

Save all to: `assets/sprites/particles/`

---

### Step 6: Download UI Elements (Optional)

**Source: Kenney UI Pack** (CC0 - Free)
- URL: https://kenney.nl/assets/ui-pack
- What you need:
  - Dialogue box frame (optional - game creates one programmatically)
  - Button sprites (optional - for future enhancements)

---

## 🔧 Integrating the Assets

Once you've downloaded the assets and organized them in the correct folders:

### Edit PreloadScene.js

Open: [src/scenes/PreloadScene.js](src/scenes/PreloadScene.js)

**Find this section** (around line 56):
```javascript
// TODO: Download assets from sources in plan, then uncomment and update paths:
```

**Uncomment all the asset loading code below it:**
```javascript
// Character sprites (sprite sheets with animation frames)
this.load.spritesheet('girl-idle', 'sprites/characters/girl/girl-idle.png', {
    frameWidth: 64, frameHeight: 64  // ⚠️ Adjust to match your sprite dimensions!
});
this.load.spritesheet('girl-walk', 'sprites/characters/girl/girl-walk.png', {
    frameWidth: 64, frameHeight: 64
});
// ... etc
```

**⚠️ Important:** Check the actual dimensions of your sprite sheets!
- Open the sprite image in an image editor
- Divide total width by number of frames to get `frameWidth`
- Use the height as `frameHeight`
- Kenney sprites are typically 64x64 or 128x128

**Also uncomment the animation creation code** (around line 100):
```javascript
// Girl animations
this.anims.create({
    key: 'girl-idle-anim',
    frames: this.anims.generateFrameNumbers('girl-idle', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
});
// ... etc
```

**⚠️ Adjust frame numbers** to match your sprite sheets:
- Count the number of frames in each sprite sheet
- Update `end` value accordingly (e.g., if there are 8 frames, use `end: 7` since it's 0-indexed)

---

### Update Scene Files to Use Real Assets

Once assets are loaded, you need to replace emoji placeholders with actual sprites:

#### In TitleScene.js (line 67-77):
Replace:
```javascript
const girlfriend = this.add.text(centerX - 60, centerY + 80, '👩‍🎓', {
    fontSize: '80px'
}).setOrigin(0.5);
```

With:
```javascript
const girlfriend = this.add.sprite(centerX - 60, centerY + 80, 'girl-idle')
    .setScale(2);
girlfriend.play('girl-idle-anim');
```

#### In CampusWalkScene.js (line 28):
Replace:
```javascript
this.player = this.add.text(100, groundY - 30, '👩‍🎓', {
    fontSize: '60px'
}).setOrigin(0.5);
```

With:
```javascript
this.player = this.add.sprite(100, groundY - 30, 'girl-walk').setScale(2);
this.player.play('girl-walk-anim');
```

And in the `update()` method, play appropriate animations based on movement.

#### Similar updates needed for:
- [MeetingScene.js](src/scenes/MeetingScene.js) - Replace girlfriend/boyfriend emoji with sprites
- [RevealScene.js](src/scenes/RevealScene.js) - Replace couple emoji with couple sprite

**Pro tip:** Search for "TODO" comments in all scene files - I've marked every location where you need to:
1. Replace emoji placeholders with sprites
2. Uncomment audio playback code
3. Add particle emitters with textures

---

## 🎵 Enabling Audio

Once you've downloaded music and sound effects:

**In each scene file**, find and uncomment the audio code:

Example from CampusWalkScene.js (line 83):
```javascript
// TODO: Add audio when assets are loaded
// this.campusMusic = this.sound.add('campus-walk-music', { loop: true, volume: 0.6 });
// this.campusMusic.play();
```

Becomes:
```javascript
this.campusMusic = this.sound.add('campus-walk-music', { loop: true, volume: 0.6 });
this.campusMusic.play();
```

Do this for all music and sound effect calls marked with TODO comments.

---

## ✨ Enabling Particle Systems

Once you have particle textures downloaded:

**In PreloadScene.js**, uncomment particle loading:
```javascript
this.load.image('heart', 'sprites/particles/heart.png');
this.load.image('sparkle', 'sprites/particles/sparkle.png');
this.load.image('petal', 'sprites/particles/petal.png');
this.load.image('confetti', 'sprites/particles/confetti.png');
```

**In scene files**, replace emoji particles with real particle emitters.

Example from TitleScene.js - replace the emoji heart spawner (line 16-29) with:
```javascript
// Floating hearts particle emitter
const hearts = this.add.particles(0, 0, 'heart', {
    x: { min: 0, max: width },
    y: height + 50,
    lifespan: 8000,
    speedY: { min: -100, max: -50 },
    speedX: { min: -20, max: 20 },
    scale: { start: 0.5, end: 0.3 },
    alpha: { start: 0.6, end: 0 },
    frequency: 500,
    blendMode: 'NORMAL'
});
```

---

## 🧪 Testing Your Changes

As you integrate assets:

1. **Keep the dev server running** (it auto-reloads on file changes)
2. **Open your browser to http://localhost:3000**
3. **Check the browser console** (F12) for any errors
4. **Common issues:**
   - "Failed to load texture" → Check file paths match exactly
   - "Cannot read property 'length'" → Sprite sheet dimensions are wrong
   - Audio not playing → Make sure you clicked "Tap to Start" to unlock audio
   - Animations not playing → Check frame counts and animation keys

---

## 📱 Mobile Testing

Once everything works on desktop:

1. **Find your computer's local IP address:**
   ```bash
   ipconfig getifaddr en0  # On Mac
   ```

2. **Run dev server with network access:**
   ```bash
   npm run dev -- --host
   ```

3. **Open on your phone:**
   ```
   http://[YOUR-IP]:3000
   ```

4. **Test touch controls** - swipe to move, tap to jump

---

## 🚀 Deployment to Vercel

When you're happy with everything:

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Build the production version
npm run build

# Deploy
vercel deploy --prod
```

### Option 2: Vercel Web Dashboard
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite and deploys!

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

---

## 🎯 Asset Checklist

Use this checklist as you download assets:

**Character Sprites:**
- [ ] girl-idle.png
- [ ] girl-walk.png
- [ ] girl-jump.png
- [ ] boy-idle.png
- [ ] boy-walk.png
- [ ] couple-hug.png

**Environment:**
- [ ] campus-ground.png
- [ ] building.png
- [ ] tree.png
- [ ] bench.png
- [ ] sky-layer.png
- [ ] distant-buildings.png
- [ ] trees-layer.png
- [ ] garden-bg.png

**Music:**
- [ ] title-theme.mp3
- [ ] campus-walk.mp3
- [ ] meeting-romance.mp3
- [ ] celebration.mp3

**Sound Effects:**
- [ ] footstep.mp3
- [ ] jump.mp3
- [ ] heart-collect.mp3
- [ ] hug.mp3
- [ ] firework.mp3
- [ ] whoosh.mp3

**Particles:**
- [ ] heart.png
- [ ] sparkle.png
- [ ] petal.png
- [ ] confetti.png

---

## 💡 Quick Tips

1. **Start with particles** - They're the easiest to create/download and make the biggest visual impact
2. **Test incrementally** - Add one type of asset at a time and test
3. **Use web tools** - You can find sprite sheets and test them on https://www.spriters-resource.com/
4. **Sprite sheet tools** - Use https://www.leshylabs.com/apps/sstool/ if you need to create sprite sheets from individual images
5. **Audio format** - MP3 works everywhere, OGG is smaller but less supported
6. **Compress images** - Use https://tinypng.com/ to compress PNG files before deploying

---

## 🆘 Troubleshooting

**Q: The game loads but shows a black screen**
- Check browser console for errors (F12)
- Verify Vite dev server is running (http://localhost:3000)
- Try refreshing the page

**Q: Sprite animations aren't playing**
- Check frame dimensions in sprite sheet loader
- Verify animation keys match between PreloadScene and scene files
- Check sprite sheet has multiple frames (not a single image)

**Q: Audio doesn't play**
- Make sure you clicked "Tap to Start" (required for mobile audio)
- Check audio file paths are correct
- Try playing audio in browser console: `game.sound.play('key')`

**Q: Particles don't show up**
- Verify particle texture loaded (check PreloadScene)
- Check particle emitter depth (`setDepth()`)
- Try increasing particle size or frequency

**Q: Game is laggy**
- Reduce particle frequency/quantity
- Check for console errors
- Disable some visual effects
- Test on different browser

---

## 📞 Need Help?

If you get stuck:
1. Check the **browser console** (F12) for error messages
2. Review the [plan file](/Users/jason/.claude/plans/curious-questing-dongarra.md) for detailed technical info
3. Look at Phaser examples: https://phaser.io/examples
4. Search Phaser documentation: https://docs.phaser.io/

---

## 🎉 Final Note

The game structure is **100% complete** and the code is **production-ready**. You're just replacing visual/audio placeholders with professional assets. Take your time finding assets that match your vision - the free resources available are amazing quality!

Once you have the assets integrated, this will be a truly **professional, emotionally impactful gift** that she'll absolutely love! 💖✨

Good luck, and have fun building! 🚀
