/** @type {import("../typing/phaser")} */

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: "#6C3FDD",
  scene: [GameOver, Game],
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
  pipeDistance: [220, 280],
  pipeHole: [100, 130],
};

const game = new Phaser.Game(config);
