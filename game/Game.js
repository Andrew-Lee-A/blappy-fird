/** @type {import("../typing/phaser")} */

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.currentHeart = 3;
    this.score = 0;
  }

  preload() {
    this.load.image("cat", "assets/images/player-spriteS.png");
    this.load.image("pipe", "assets/images/default-pipe-sprite.png");
    this.load.image("coin", "assets/images/ticket-sprite.png");
    this.load.image("pipeInverse", "assets/images/inverse-pipe-sprite.png");
    this.load.spritesheet("heart", "assets/images/heart-container-sheet.png", {
      frameWidth: 28,
      frameHeight: 21,
    });
    this.load.audio("background audio", "assets/audio/Child's Nightmare.wav");
    this.load.audio("coinSound", "assets/audio/coin-pickup.wav");
  }

  create() {
    //add and play the back ground music
    this.backgroundMusic = this.sound.add("background audio");
    this.backgroundMusic.play();

    const NUM_HEARTS = 3;

    this.cat = this.physics.add.sprite(80, game.config.height / 2, "cat");
    this.cat.body.gravity.y = gameOptions.catGravity;
    this.input.on("pointerdown", this.flap, this);
   
    this.pipeGroup = this.physics.add.group();
    this.coinGroup = this.physics.add.group();

    this.pipePool = [];

    // add pipes on screen
    for (let i = 0; i < 4; i++) {
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipeInverse"));
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.placePipes();
    }
    // pipe speed according to player
    this.pipeGroup.setVelocityX(-gameOptions.catSpeed);
    // setting score
    this.timedEvent = this.time.addEvent({
      delay: 1500,
      callback: this.scoreIncrease,
      callbackScope: this,
      loop: true,
      paused: false,
    }); 
    this.scoreText = this.add.text(0, 0);
    // add hearts
    const heartsArray = this.initializeHearts(NUM_HEARTS, 30, 30);
    this.setHearts(this.currentHeart, heartsArray); // test line

    // coin score counter
    this.coinNum = 0;
    this.coinImg = this.physics.add.sprite(50, 50,"coin");
    this.coinNumText = this.add.text(75,43,'X '+this.coinNum);
    
    // add coin when true
    this.addNewCoin = false;

    // create first coin 
    this.coinGroup = this.physics.add.group();

    // given random y value 
    this.coinGroup.create(1100, Phaser.Math.Between(game.config.height*0.25,game.config.height*0.75),"coin")
    this.coinGroup.setVelocityX(-gameOptions.catSpeed);

    this.coinSound = this.sound.add("coinSound", {loop: false}); 
    
  }

  update() {
    this.scoreText.setText("Score: " + this.score);
    this.physics.world.collide(
      this.cat,
      this.pipeGroup,
      function () {
        this.die();
      },
      null,
      this
    );

    this.hitBounds();
    this.pipeGroup.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right < 0) {
        this.pipePool.push(pipe);
        if (this.pipePool.length == 2) {
          this.placePipes(true);
        }
        // when pipes are being pushed
        // check if addnewcoin is true new coin will be made
        if (this.addNewCoin) {
          // add new coin
          this.addCoin();
          this.addNewCoin = false;
        }
      }
    }, this);

    //Everytime the score increases by 10, increase the cat speed
    if (this.score % 10 == 0) {
      this.increaseCatSpeed();
    }

    // coin collision on pickup
    this.physics.add.overlap(
      this.cat,
      this.coinGroup,
      this.hitCoin,
      null,
      this
    );

    // create next coin when missed ones go out of bounds
    this.coinGroup.getChildren().forEach(function (coin) {
      if (coin.getBounds().right < 0) {
        // delete coin and add new coin
        this.addNewCoin = true;
        this.coinGroup.clear(this.coinGroup);
      }
    }, this);
  }
  scoreIncrease() {
    this.score += 10;
  }
  getEvents() {
    // create all event obj
  }

  pickEvent() {
    // pick a random event from event objs
  }
  hitCoin() {
    this.coinSound.play();

    // update coin score text
    this.coinNum++;
    this.coinNumText.setText("X " + this.coinNum);

    // delete coin
    this.coinGroup.clear(this.coinGroup);

    // add next coin
    this.addNewCoin = true;

    // update coin in localStorage
    var coinCount = this.coinNum;
    localStorage.setItem("currentCoin", coinCount);
  }

  addCoin() {
    this.coinGroup.create(
      900,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "coin"
    );
    this.coinGroup.setVelocityX(-gameOptions.catSpeed);
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
      localStorage.setItem("currentScore", this.score);
      this.scene.stop("Game");
      this.scene.start("GameOver");
      this.score = 0;
      this.backgroundMusic.stop();
    } else {
      this.scene.start("Game");
      this.backgroundMusic.stop();
      setTimeout(() => {
        this.cameras.main.shake(200, 0.01);
      }, 25);
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
