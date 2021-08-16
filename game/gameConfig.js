/** @type {import("../typing/phaser")} */

const gameState = {}; // gameState object for other scenes...

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: '#6C3FDD',
    scene: [MainMenu, Game, ShopMenu],
};

const game = new Phaser.Game(config);

