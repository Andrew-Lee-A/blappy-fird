/** @type {import("../typing/phaser")} */
class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.currentHeart = 3;
    this.score = 0;
    this.coinNum = 0;
    this.TileMsg = true;
    this.gameController = new GameController();
    this.heartsArray;
  }

  preload() {
    // load character skins
    this.load.image("cat", "assets/images/player-spriteS.png");
    this.load.spritesheet("bear", "assets/images/bear-skin.png", {
      frameWidth: 49,
      frameHeight: 44,
    });
    this.load.spritesheet("frog", "assets/images/frog-skin.png", {
      frameWidth: 49,
      frameHeight: 44,
    });
    this.load.image("pipe", "assets/images/default-pipe-sprite.png");
    this.load.image("coin", "assets/images/ticket-sprite.png");
    this.load.image("powerUp", "assets/images/generic-buff-sprite.png");
    this.load.image("boosted-cat", "assets/images/boosted-player.png");
    this.load.image("pipeInverse", "assets/images/inverse-pipe-sprite.png");
    this.load.spritesheet("heart", "assets/images/heart-container-sheet.png", {
      frameWidth: 28,
      frameHeight: 21,
    });
    this.load.audio("background audio", "assets/audio/Child's Nightmare.wav");
    this.load.audio("coinSound", "assets/audio/coin-pickup.wav");

    //UI Buttons
    this.load.image("resumeButton", "assets/buttons/resume.png");
    this.load.image("pauseButton", "assets/buttons/pause.png");
    this.load.image("homeButton", "assets/buttons/home.png");
    this.load.image("muteButton", "assets/buttons/audio_on.png");
    this.load.image("unmuteButton", "assets/buttons/audio_off.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#FFFFFF");
    this.playerAnimation = false; // must be set here for scene rebuild
    this.gameSpeed = gameOptions.catSpeed;

    //add and play the back ground music
    this.backgroundMusic = this.sound.add("background audio");
    this.backgroundMusic.play();

    const NUM_HEARTS = 3;
    const ANIMATION_DURATION = 250;

    this.skinKey = this.getCharacterSkin();
    this.cat = this.physics.add.sprite(
      80,
      game.config.height / 2,
      this.skinKey
    );
    this.cat.body.gravity.y = gameOptions.catGravity;

    // add animations
    this.addUniqueCharacterAnimation(2000);
    this.input.on("pointerdown", () => {
      this.flap();
      this.addCharacterAnimation(ANIMATION_DURATION);
    });

    this.pipePool = [];

    this.pipeGroup = this.physics.add.group();
    // add pipes on screen
    this.addPipesToScreen();
    // pipe speed according to player
    this.pipeGroup.setVelocityX(-this.gameSpeed);
    // setting score
    this.createTimedEventForScore();
    this.scoreText = this.add.text(0, 0);
    // add hearts
    this.heartsArray = this.initializeHearts(NUM_HEARTS, 30, 30);
    this.setHearts(this.currentHeart, this.heartsArray); // test line

    // coin score counter
    this.coinImg = this.physics.add.sprite(50, 50, "coin");
    this.coinNumText = this.add.text(75, 43, "X " + this.coinNum);

    // reset local storage
    localStorage.setItem("currentCoin", 0);
    localStorage.setItem("currentScore", 0);

    // add powerUp when true
    this.addNewPowerUp = false;
    // create first powerUpSpawn
    this.powerUpGroup = this.physics.add.group();
    this.powerUpGroup.create(
      2000,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "powerUp"
    );
    this.powerUpGroup.setVelocityX(-this.gameSpeed);
    // add coin when true
    this.addNewCoin = false;

    // create first coin
    this.coinGroup = this.physics.add.group();

    // given random y value
    this.coinGroup.create(
      1100,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "coin"
    );
    this.coinGroup.setVelocityX(-this.gameSpeed);

    this.coinSound = this.sound.add("coinSound", { loop: false });

    this.Title = this.add.text(150, 100, "Classic").setFontSize(70);

    //this.scene.launch(UIScene);

    //pause button
    this.isPauseflag = false;
    this.pauseButton = this.add.image(
      game.config.width - 80,
      game.config.height - 30,
      "pauseButton"
    );

    //mute button
    let data = new DataStorage();
    if (data.getAudio()) {
      this.muteButton = this.add.image(
        game.config.width - 130,
        game.config.height - 30,
        "muteButton"
      );
    } else {
      this.muteAll();
      this.muteButton = this.add.image(
        game.config.width - 130,
        game.config.height - 30,
        "unmuteButton"
      );
    }

    //home button
    this.homeButton = this.add.image(
      game.config.width - 30,
      game.config.height - 30,
      "homeButton"
    );
    this.setHomeButtonInteractive();
    this.setMuteButtonInteractive();
    this.setPauseButtonInteractive();
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
        if (this.addNewPowerUp) {
          this.addPowerUp();
          this.addNewPowerUp = false;
        }
      }
    }, this);

    // powerup collision
    this.physics.add.overlap(
      this.cat,
      this.powerUpGroup,
      this.hitPowerUp,
      null,
      this
    );
    // cat collision on pickup
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
    this.powerUpGroup.getChildren().forEach(function (powerUp) {
      if (powerUp.getBounds().right < 0) {
        this.addNewPowerUp = true;
        this.powerUpGroup.clear(this.powerUpGroup);
      }
    }, this);
    // show Game type
    if ((this.TitleMsg = true)) {
      this.timer = this.time.addEvent({
        delay: 1500,
        callback: () => {
          (this.TitleMsg = false), this.killTitle(this.Title);
        },
        loop: true,
      });
    }
  }
  killTitle(title) {
    title.destroy();
  }
  scoreIncrease() {
    this.score += 10;
    this.increaseCatSpeed();
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
    localStorage.setItem("currentCoin", this.coinNum);
  }

  hitPowerUp() {
    this.powerUpGroup.clear(this.powerUpGroup);
    this.addNewPowerUp = true;
    let powerUp = Phaser.Math.Between(0, 2);

    switch (powerUp) {
      case 0:
        this.applyShrinkAvatarPowerUp();
        break;

      case 1:
        this.currentHeart = this.gameController.extraLife(this.currentHeart, 1);
        this.updateHeartVisuals();
        break;

      case 2:
        this.applyIncreaseSpeedDebuff();
        break;
    }
  }
  updateHeartVisuals() {
    this.setHearts(this.currentHeart, this.heartsArray);
  }
  addCoin() {
    this.coinGroup.create(
      1000,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "coin"
    );
    this.coinGroup.setVelocityX(-this.gameSpeed);
  }

  addPowerUp() {
    this.powerUpGroup.create(
      1000,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "powerUp"
    );
    this.powerUpGroup.setVelocityX(-this.gameSpeed);
  }

  flap() {
    this.cat.body.velocity.y = -gameOptions.catFlapPower;
  }
  addPipesToScreen() {
    //adds pipes to screen
    console.log("adds pipes");
    for (let i = 0; i < 4; i++) {
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipeInverse"));
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.placePipes();
    }
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
  createTimedEventForScore() {
    this.timedEvent = this.time.addEvent({
      delay: 1500,
      callback: this.scoreIncrease,
      callbackScope: this,
      loop: true,
      paused: false,
    });
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
      localStorage.setItem("currentCoin", this.coinNum);
      this.scene.stop("Game");
      this.scene.start("GameOver");
      this.score = 0;
      this.coinNum = 0;
      this.backgroundMusic.stop();

      // update score
      // gametype must be specify in single quotation
      let data = new DataStorage();

      console.log("current classic score:" + data.getScore("classic"));
      data.setScore("classic", this.score);
      console.log("now score:" + data.getScore("classic"));
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
    const EASY_MAX_SPEED = 200;
    const EASY_SPEED_INCREASE = 5;
    const MEDIUM_MAX_SPEED = 300;
    const MEDIUM_SPEED_INCREASE = 6;
    const HARD_MAX_SPEED = 400;
    const HARD_SPEED_INCREASE = 8;

    let data = new DataStorage();
    let difficultyLevel = data.getDifficulty();

    let maxSpeed = EASY_MAX_SPEED;
    let incrementSpeed = EASY_SPEED_INCREASE;
    switch (difficultyLevel) {
      case 1:
        {
          maxSpeed = MEDIUM_MAX_SPEED;
          incrementSpeed = MEDIUM_SPEED_INCREASE;
        }
        break;
      case 2:
        {
          maxSpeed = HARD_MAX_SPEED;
          incrementSpeed = HARD_SPEED_INCREASE;
        }
        break;
    }

    if (this.gameSpeed < maxSpeed) {
      this.gameSpeed += incrementSpeed;
    }
    this.coinGroup.setVelocityX(-this.gameSpeed);
    this.pipeGroup.setVelocityX(-this.gameSpeed);
    this.powerUpGroup.setVelocityX(-this.gameSpeed);
  }

  muteAll() {
    this.backgroundMusic.mute = true;
    this.coinSound.mute = true;
  }

  unmuteAll() {
    this.backgroundMusic.mute = false;
    this.coinSound.mute = false;
  }

  applyIncreaseSpeedDebuff() {
    this.currentGameSpeed = this.gameSpeed;
    this.gameSpeed = this.currentGameSpeed * 1.4;
    this.speedTime = this.time.delayedCall(
      5000,
      this.unapplyIncreaseSpeedDebuff,
      [this.currentGameSpeed],
      this
    );
  }

  unapplyIncreaseSpeedDebuff(CurrentGameSpeed) {
    this.gameSpeed = CurrentGameSpeed;
  }

  applyShrinkAvatarPowerUp() {
    this.cat.setScale(0.5);

    this.shrinkTime = this.time.delayedCall(
      5000,
      this.unapplyShrinkAvatarPowerUp,
      [],
      this
    );
  }

  unapplyShrinkAvatarPowerUp(speed) {
    this.cat.setScale(1);
  }
  /**
   * returns the character string to set the
   * avatar of the character to...
   */
  getCharacterSkin() {
    const data = new DataStorage();
    let skinIndex = data.getCurrentSkin();

    let skinKey = "";
    switch (skinIndex) {
      case 0:
        skinKey = "cat";
        break;
      case 1:
        skinKey = "bear";
        break;
      case 2:
        skinKey = "frog";
        break;
    }

    if (skinKey === "") {
      throw "ERROR skin key not found...";
    }

    return skinKey;
  }

  /**
   * add the generic character animation that is for
   * all character skins
   * @param {*} animeDuration
   */
  addCharacterAnimation(animeDuration) {
    if (this.playerAnimation == false) {
      // basic rotation animation
      this.playerAnimation = true; // lock animation
      setTimeout(() => {
        this.playerAnimation = false;
      }, animeDuration * 2);
      this.tweens.add({
        targets: this.cat,
        angle: -60,
        ease: "linear",
        duration: animeDuration,
        repeat: 0,
        yoyo: true,

        onRepeat: function () {
          this.cat.angle += 1;
        },
      });
    }
  }

  /**
   * add the unique character animation depending on the selected skin
   */
  addUniqueCharacterAnimation() {
    if (this.skinKey === "bear") {
      this.anims.create({
        key: "bear-anime",
        frames: this.anims.generateFrameNames("bear"),
        frameRate: 2,
        repeat: -1,
      });
      this.cat.play("bear-anime");
    } else if (this.skinKey === "frog") {
      this.anims.create({
        key: "frog-anime",
        frames: this.anims.generateFrameNames("frog"),
        frameRate: 2,
        repeat: -1,
      });
      this.cat.play("frog-anime");
    } // else default skin... has no animation
  }

  setHomeButtonInteractive() {
    this.homeButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.homeButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.homeButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.homeButton.setTint(0x8afbff);
        this.backgroundMusic.stop();
        this.scene.stop("Game");
        this.scene.start("MainMenu");
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.homeButton.setTint(0xffffff);
      });
  }

  setMuteButtonInteractive(){
    let data = new DataStorage();
    this.muteButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.muteButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.muteButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.muteButton.setTint(0x8afbff);
        if (data.getAudio()) {
          this.muteButton.setTexture("unmuteButton");
          this.muteAll();
        } else if (!data.getAudio()) {
          this.muteButton.setTexture("muteButton");
          this.unmuteAll();
        }
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.muteButton.setTint(0xffffff);
      });
  }

  setPauseButtonInteractive() {
    this.pauseButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.pauseButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.pauseButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.pauseButton.setTint(0x8afbff);
        if (this.isPauseflag == false) {
          this.pauseButton.setTexture("pauseButton");
          this.isPauseflag = true;
          this.timedEvent.paused = true;
          this.cat.body.moves = false;
          this.pipeGroup.setVelocityX(0);
          this.coinGroup.setVelocityX(0);
          this.powerUpGroup.setVelocityX(0);

          this.muteAll();
        } else if (this.isPauseflag == true) {
          this.pauseButton.setTexture("resumeButton");
          this.isPauseflag = false;
          this.timedEvent.paused = false;
          this.cat.body.moves = true;
          this.pipeGroup.setVelocityX(-this.gameSpeed);
          this.coinGroup.setVelocityX(-this.gameSpeed);
          this.powerUpGroup.setVelocityX(-this.gameSpeed);
          this.unmuteAll();
        }
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.pauseButton.setTint(0xffffff);
      });
  }
}
