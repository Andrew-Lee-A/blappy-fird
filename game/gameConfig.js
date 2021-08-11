/** @types {import("../typing/phaser")} */

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: '#6C3FDD',
    scene: [MainMenu, Game, ShopMenu],
};

const game = new Phaser.Game(config);

