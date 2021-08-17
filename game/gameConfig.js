/** @type {import("../typing/phaser")} */

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: '#6C3FDD',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: false

        }
    },
    scene: [Game, MainMenu, ShopMenu],
};

var player;
var buff;

const game = new Phaser.Game(config);

