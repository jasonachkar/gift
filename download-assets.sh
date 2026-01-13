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
fetch_zip_url() {
    local page_url="$1"
    local zip_url
    zip_url=$(curl -fsSL "$page_url" | grep -Eo 'https://[^" ]+\.zip' | head -n 1)
    if [ -z "$zip_url" ]; then
        echo "❌ Error: Could not find ZIP download on $page_url"
        exit 1
    fi
    echo "$zip_url"
}

platformer_characters_url=$(fetch_zip_url "https://kenney.nl/assets/platformer-characters")
curl -L -o platformer-characters.zip "$platformer_characters_url"

# Download platformer pack redux
echo ""
echo "🏛️ Downloading environment assets from Kenney..."
platformer_pack_url=$(fetch_zip_url "https://kenney.nl/assets/platformer-pack-redux")
curl -L -o platformer-pack.zip "$platformer_pack_url"

# Download particle pack
echo ""
echo "✨ Downloading particle pack from Kenney..."
particle_pack_url=$(fetch_zip_url "https://kenney.nl/assets/particle-pack")
curl -L -o particle-pack.zip "$particle_pack_url"

# Extract everything
echo ""
echo "📦 Extracting assets..."
if command -v unzip &> /dev/null; then
    unzip -q -o platformer-characters.zip -d platformer-characters
    unzip -q -o platformer-pack.zip -d platformer-pack
    unzip -q -o particle-pack.zip -d particle-pack
else
    echo "❌ Error: unzip is not installed. Please install unzip first."
    exit 1
fi

# Copy character sprites (stand + walk + jump frames)
echo ""
echo "🎨 Organizing character sprites..."

cp -f "platformer-characters/PNG/Female/Poses/female_stand.png" "../assets/sprites/characters/girl/girl-stand.png"
cp -f "platformer-characters/PNG/Female/Poses/female_walk1.png" "../assets/sprites/characters/girl/girl-walk1.png"
cp -f "platformer-characters/PNG/Female/Poses/female_walk2.png" "../assets/sprites/characters/girl/girl-walk2.png"
cp -f "platformer-characters/PNG/Female/Poses/female_jump.png" "../assets/sprites/characters/girl/girl-jump.png"

cp -f "platformer-characters/PNG/Player/Poses/player_stand.png" "../assets/sprites/characters/boy/boy-stand.png"
cp -f "platformer-characters/PNG/Player/Poses/player_walk1.png" "../assets/sprites/characters/boy/boy-walk1.png"
cp -f "platformer-characters/PNG/Player/Poses/player_walk2.png" "../assets/sprites/characters/boy/boy-walk2.png"
cp -f "platformer-characters/PNG/Player/Poses/player_jump.png" "../assets/sprites/characters/boy/boy-jump.png"

# Copy particles (sparkle only; others stay programmatic)
cp -f "particle-pack/PNG (Transparent)/spark_05.png" "../assets/sprites/particles/sparkle.png"

# Copy a simple ground tile (optional)
cp -f "platformer-pack/PNG/Tiles/grass.png" "../assets/tilesets/campus-ground.png"

cd ..

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

echo "✨ Copied particle texture and ground tile from Kenney."

echo ""
echo "✅ Basic assets downloaded and organized!"
echo ""
echo "📝 Summary:"
echo "   ✅ Character sprites copied (stand/walk/jump frames)"
echo "   ✅ Particle textures from Kenney"
echo "   ✅ Environment tiles from Kenney"
echo "   ⚠️  Music needs manual download (CC0 sites listed above)"
echo "   ⚠️  Sound effects need manual download (freesound.org)"
echo ""
echo "🚀 Next step: Run 'npm run dev' and test the game!"
echo ""
