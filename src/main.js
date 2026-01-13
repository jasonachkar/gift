import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import TitleScene from './scenes/TitleScene.js';
import CampusWalkScene from './scenes/CampusWalkScene.js';
import MeetingScene from './scenes/MeetingScene.js';
import RevealScene from './scenes/RevealScene.js';
import CheesecakeScene from './scenes/CheesecakeScene.js';

const Phaser = window.Phaser;
if (!Phaser) {
    throw new Error('Phaser not loaded. Make sure the Phaser script is included before main.js.');
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        PreloadScene,
        TitleScene,
        CampusWalkScene,
        MeetingScene,
        RevealScene,
        CheesecakeScene
    ]
};

const game = new Phaser.Game(config);
