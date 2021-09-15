/** @type {import("../typing/phaser")} */

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.currentHeart = 3;
    this.score = 0;
    this.gameRunning = true;
    this.total = 0;
   
  }

  preload() {
    this.load.image("cat", "assets/images/player-spriteS.png");
    this.load.image("pipe", "assets/images/default-pipe-sprite.png");
    this.load.image("pipeInverse", "assets/images/inverse-pipe-sprite.png");
    this.load.spritesheet("heart", "assets/images/heart-container-sheet.png", {
      frameWidth: 28,
      frameHeight: 21,
    });

    this.load.audio("background audio", "assets/audio/Child's Nightmare.ogg");
  }

  create() {
    //add and play the back ground music
    // this.backgroundMusic = this.sound.add("background audio");
    // this.backgroundMusic.play();

    const NUM_HEARTS = 3;

    this.cat = this.physics.add.sprite(80, game.config.height / 2, "cat");
    this.cat.body.gravity.y = gameOptions.catGravity;
    this.input.on("pointerdown", this.flap, this);
    this.scoreText = this.add.text(0,0,"Score: ");
    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];
    // add pipes on screen
    for (let i = 0; i < 4; i++) {
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipeInverse"));
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.placePipes();
    }
    // pipe speed according to player
    this.pipeGroup.setVelocityX(-gameOptions.catSpeed);
    this.collides = true;
    // setting score
    this.timedEvent = this.time.addEvent({
     delay: 2000,
     callback: this.onEvent,
     callbackScope: this,
     loop: true,
     paused: false
   });
    // add hearts
    const heartsArray = this.initializeHearts(NUM_HEARTS, 30, 30);
    this.setHearts(this.currentHeart, heartsArray); // test line
  }

  update() {
    if (this.collides) {
      this.physics.world.collide(
        this.cat,
        this.pipeGroup,
        function () {
          this.die();
        },
        null,
        this
      );
    }
    this.hitBounds();
    this.pipeGroup.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right < 0) {
        this.pipePool.push(pipe);
        if (this.pipePool.length == 2) {
          this.placePipes(true);
        }
      }
    }, this);

    //Everytime the score increases by 10, increase the cat speed
    if (this.score % 10 == 0) {
      this.increaseCatSpeed();
    }
  }
  onEvent(){
    this.score+= 10;
    console.log(this.score);
  }
  getEvents() {
    // create all event obj
  }

  pickEvent() {
    // pick a random event from event objs
  }
  flap() {
    this.cat.body.velocity.y = -gameOptions.catFlapPower;
  }
  placePipes() {
    let rightmost = this.getRightMostPipe();
    let pipeHoleHeight = Phaser.Math.Between(
      gameOptions.pipeHole[0],
      gameOptions.pipeHole[1]
    );
    let pipeHolePosition = Phaser.Math.Between(
      gameOptions.minPipeHeight + pipeHoleHeight / 2,
      game.config.height - gameOptions.minPipeHeight - pipeHoleHeight / 2
    );
    this.pipePool[0].x =
      rightmost +
      this.pipePool[0].getBounds().width +
      Phaser.Math.Between(
        gameOptions.pipeDistance[0],
        gameOptions.pipeDistance[1]
      );
    this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
    this.pipePool[0].setOrigin(0, 1);
    this.pipePool[0].setImmovable(true);
    this.pipePool[1].x = this.pipePool[0].x;
    this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;
    this.pipePool[1].setOrigin(0, 0);
    this.pipePool[1].setImmovable(true);
    this.pipePool = [];
  }
  getRightMostPipe() {
    let rightmostPipe = 0;
    this.pipeGroup.getChildren().forEach(function (pipe) {
      rightmostPipe = Math.max(rightmostPipe, pipe.x);
    });
    return rightmostPipe;
  }

  hitBounds() {
    if (this.cat.y > game.config.height || this.cat.y < 0) {
      this.die();
    }
  }
  die() {
    this.currentHeart--;
    if (this.currentHeart == 0) {
      this.currentHeart = 3;
      this.score = 0;
      this.scene.stop("Game");
      this.scene.start("GameOver");
      // this.backgroundMusic.stop();
    } else {
      this.scene.start("Game");
    }
  }

  initializeHearts(numHearts, rightPadding, spacing) {
    const heartsArray = [];
    for (let i = 0; i < numHearts; i++) {
      if (i == 0) {
        heartsArray[i] = this.add.sprite(
          config.width - rightPadding,
          30,
          "heart"
        );
      } else {
        heartsArray[i] = this.add.sprite(
          config.width - i * spacing - rightPadding,
          30,
          "heart"
        );
      }
    }

    return heartsArray;
  }

  setHearts(activeHearts, heartsArray) {
    for (let i = heartsArray.length - 1; i >= 0; i--) {
      if (i >= activeHearts) {
        heartsArray[i].setFrame(1);
      } else {
        heartsArray[i].setFrame(0);
      }
    }
  }

  increaseCatSpeed() {
    this.catSpeed += 2;
  }

  
}
