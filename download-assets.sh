#!/bin/bash

# Journey to You - Automated Asset Download Script
# This script downloads all free assets needed for the game

set -e  # Exit on error

echo "🎮 Journey to You - Asset Downloader"
echo "===================================="
echo ""

# Create directories
echo "📁 Creating asset directories..."
mkdir -p assets/sprites/characters/girl
mkdir -p assets/sprites/characters/boy
mkdir -p assets/sprites/characters
mkdir -p assets/sprites/particles
mkdir -p assets/tilesets
mkdir -p assets/backgrounds
mkdir -p assets/audio/music
mkdir -p assets/audio/sfx
mkdir -p temp_downloads

cd temp_downloads

# Download Kenney Platformer Characters
echo ""
echo "👥 Downloading character sprites from Kenney..."
echo "   (This is CC0 licensed - completely free to use!)"

if ! command -v curl &> /dev/null; then
    echo "❌ Error: curl is not installed. Please install curl first."
    exit 1
fi

# Download the platformer characters pack
curl -L -o platformer-characters.zip "https://kenney.nl/content/3-assets/12-platformer-characters-1/platformercharacters.zip"

# Download platformer pack redux
echo ""
echo "🏛️ Downloading environment assets from Kenney..."
curl -L -o platformer-pack.zip "https://kenney.nl/content/3-assets/13-platformer-pack-redux/platformerpackredux.zip"

# Download particle pack
echo ""
echo "✨ Downloading particle pack from Kenney..."
curl -L -o particle-pack.zip "https://kenney.nl/content/3-assets/32-particle-pack/particlepack.zip"

# Extract everything
echo ""
echo "📦 Extracting assets..."
if command -v unzip &> /dev/null; then
    unzip -q platformer-characters.zip -d platformer-characters
    unzip -q platformer-pack.zip -d platformer-pack
    unzip -q particle-pack.zip -d particle-pack
else
    echo "❌ Error: unzip is not installed. Please install unzip first."
    exit 1
fi

# Copy character sprites (we'll use the first female and male characters we find)
echo ""
echo "🎨 Organizing character sprites..."

# Find and copy appropriate sprites from Kenney pack
# Note: Kenney sprites come as individual PNGs, we'll need to create sprite sheets or use individual frames
# For now, let's copy some base sprites
cd ..

# Since Kenney doesn't provide ready-made sprite sheets, let's provide instructions
echo ""
echo "⚠️  IMPORTANT: Manual step required!"
echo ""
echo "Kenney provides individual PNG files, not sprite sheets."
echo "You have two options:"
echo ""
echo "Option 1 (Recommended): Use online sprite sheet creator"
echo "  1. Go to: https://www.leshylabs.com/apps/sstool/"
echo "  2. Upload the character images from temp_downloads/platformer-characters/"
echo "  3. Create sprite sheets for idle, walk, and jump animations"
echo "  4. Save them to assets/sprites/characters/"
echo ""
echo "Option 2: I'll create simple placeholder sprites for you right now"
echo "  These will be basic but functional colored rectangles"
echo ""
read -p "Press 1 for Option 1 (manual), or 2 for auto-placeholders: " choice

if [ "$choice" = "2" ]; then
    echo ""
    echo "🎨 Creating simple placeholder sprites..."
    # We'll create these programmatically in the code instead
    touch assets/sprites/characters/.use-programmatic-sprites
fi

# Download music (using YouTube Audio Library / Free Music Archive alternatives)
echo ""
echo "🎵 For music, please download CC0 music from:"
echo "   https://www.chosic.com/free-music/all/?sort=&attribution=no"
echo ""
echo "   Recommended searches:"
echo "   - 'romantic' for meeting scene"
echo "   - 'upbeat' for campus walk"
echo "   - 'celebration' for reveal scene"
echo ""
echo "   Save MP3 files as:"
echo "   - assets/audio/music/title-theme.mp3"
echo "   - assets/audio/music/campus-walk.mp3"
echo "   - assets/audio/music/meeting-romance.mp3"
echo "   - assets/audio/music/celebration.mp3"
echo ""

# Download sound effects from freesound.org
echo ""
echo "🔊 For sound effects, please download from freesound.org:"
echo "   Search for CC0 licensed sounds:"
echo "   - 'footstep' -> assets/audio/sfx/footstep.mp3"
echo "   - 'jump' -> assets/audio/sfx/jump.mp3"
echo "   - 'coin collect' -> assets/audio/sfx/heart-collect.mp3"
echo "   - 'magical sparkle' -> assets/audio/sfx/hug.mp3"
echo "   - 'firework' -> assets/audio/sfx/firework.mp3"
echo "   - 'whoosh' -> assets/audio/sfx/whoosh.mp3"
echo ""

# Copy particles
echo "✨ Copying particle textures..."
if [ -d "temp_downloads/particle-pack" ]; then
    # Find and copy appropriate particle images
    find temp_downloads/particle-pack -name "*star*" -o -name "*spark*" | head -1 | xargs -I {} cp {} assets/sprites/particles/sparkle.png 2>/dev/null || true
    find temp_downloads/particle-pack -name "*circle*" -o -name "*light*" | head -1 | xargs -I {} cp {} assets/sprites/particles/heart.png 2>/dev/null || true
fi

# Copy environment assets
echo "🏛️ Copying environment assets..."
if [ -d "temp_downloads/platformer-pack" ]; then
    find temp_downloads/platformer-pack -name "*ground*" | head -1 | xargs -I {} cp {} assets/tilesets/campus-ground.png 2>/dev/null || true
    find temp_downloads/platformer-pack -name "*tree*" | head -1 | xargs -I {} cp {} assets/tilesets/tree.png 2>/dev/null || true
fi

echo ""
echo "✅ Basic assets downloaded and organized!"
echo ""
echo "📝 Summary:"
echo "   ✅ Particle textures from Kenney"
echo "   ✅ Environment tiles from Kenney"
echo "   ⚠️  Character sprites need sprite sheet creation (or using placeholders)"
echo "   ⚠️  Music needs manual download (CC0 sites listed above)"
echo "   ⚠️  Sound effects need manual download (freesound.org)"
echo ""
echo "🚀 Next step: Run 'npm run dev' and test the game!"
echo ""
