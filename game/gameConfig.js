/** @type {import("../typing/phaser")} */

const gameState = {};

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: "#6C3FDD",
  scene: [Game, GameOver],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
    },
  },
};
const gameOptions = {
  catSpeed: 125,
  catGravity: 800,
  catFlapPower: 300,
  minPipeHeight: 50,
  pipeDistance: [250, 300],
  pipeHole: [150, 170],
};

const game = new Phaser.Game(config);
