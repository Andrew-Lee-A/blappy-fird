/** @type {import("../typing/phaser")} */

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.currentHeart = 3;
    this.score = 0;
    this.coinNum = 0;
  }

  preload() {
    // load character skins
    this.load.image("cat", "assets/images/player-spriteS.png");
    this.load.image("bear", "assets/images/bear-skin.png");
    this.load.image("frog", "assets/images/frog-skin.png");

    this.load.image("pipe", "assets/images/default-pipe-sprite.png");
    this.load.image("coin", "assets/images/ticket-sprite.png");
    this.load.image("boosted-cat", "assets/images/boosted-player.png")
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

    this.gameSpeed = gameOptions.catSpeed;

    //add and play the back ground music
    this.backgroundMusic = this.sound.add("background audio");
    this.backgroundMusic.play();

    const NUM_HEARTS = 3;

    this.cat = this.physics.add.sprite(80, game.config.height / 2, this.getCharacterSkin());
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
    this.pipeGroup.setVelocityX(-this.gameSpeed);
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
    this.coinImg = this.physics.add.sprite(50, 50, "coin");
    this.coinNumText = this.add.text(75, 43, 'X ' + this.coinNum);

    // reset local storage
    localStorage.setItem("currentCoin", 0);
    localStorage.setItem("currentScore", 0);

    // add coin when true
    this.addNewCoin = false;

    // create first coin 
    this.coinGroup = this.physics.add.group();

    // given random y value 
    this.coinGroup.create(1100, Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75), "coin")
    this.coinGroup.setVelocityX(-this.gameSpeed);

    this.coinSound = this.sound.add("coinSound", {loop: false}); 

    //this.scene.launch(UIScene);


    //pause button
    this.isPauseflag = false;
    this.pauseButton = this.add.image(game.config.width-80, game.config.height-30, "pauseButton");
    this.pauseButton.setInteractive()
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.pauseButton.setTint(0xdedede)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      this.pauseButton.setTint(0xffffff)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.pauseButton.setTint(0x8afbff)
      if (this.isPauseflag == false){
        this.pauseButton.setTexture("pauseButton");
        this.isPauseflag = true;
        this.timedEvent.paused = true;
        this.cat.body.moves = false;
        this.pipeGroup.setVelocityX(0);
        this.coinGroup.setVelocityX(0);
        this.muteAll();
      }else if (this.isPauseflag == true){
        this.pauseButton.setTexture("resumeButton");
        this.isPauseflag = false;
        this.timedEvent.paused = false;
        this.cat.body.moves = true;
        this.pipeGroup.setVelocityX(-this.gameSpeed);
        this.coinGroup.setVelocityX(-this.gameSpeed);
        this.unmuteAll();
      }
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.pauseButton.setTint(0xffffff)
    })

    //mute button
    this.isMuteflag = false;
    this.muteButton = this.add.image(game.config.width-130, game.config.height-30, "muteButton");
    this.muteButton.setInteractive()
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.muteButton.setTint(0xdedede)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      this.muteButton.setTint(0xffffff)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.muteButton.setTint(0x8afbff)
      if (this.isMuteflag == false){
        this.muteButton.setTexture("unmuteButton");
        this.isMuteflag = true;
        this.muteAll();
      }else if (this.isMuteflag == true){
        this.muteButton.setTexture("muteButton");
        this.isMuteflag = false;
        this.unmuteAll();
      }
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.muteButton.setTint(0xffffff)
    })


    //home button
    this.homeButton = this.add.image(game.config.width-30, game.config.height-30, "homeButton");
    this.homeButton.setInteractive()
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.homeButton.setTint(0xdedede)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      this.homeButton.setTint(0xffffff)
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.homeButton.setTint(0x8afbff);
      this.backgroundMusic.stop();
      this.scene.stop("Game");
      this.scene.start("MainMenu")
      
    })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.homeButton.setTint(0xffffff)
    })
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
    //if (this.score %10 == 0) {
    //this.increaseCatSpeed();
    //}

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
    this.increaseCatSpeed();
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
    localStorage.setItem("currentCoin", this.coinNum);
  }

  addCoin() {
    this.coinGroup.create(
      900,
      Phaser.Math.Between(game.config.height * 0.25, game.config.height * 0.75),
      "coin"
    );
    this.coinGroup.setVelocityX(-this.gameSpeed);
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
      localStorage.setItem("currentCoin", this.coinNum);
      this.scene.stop("Game");
      this.scene.start("GameOver");
      this.score = 0;
      this.coinNum = 0;
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
    if (this.gameSpeed < 200) {
      this.gameSpeed += 5;
    }
    this.coinGroup.setVelocityX(-this.gameSpeed);
    this.pipeGroup.setVelocityX(-this.gameSpeed);
  }

  muteAll(){
    this.backgroundMusic.mute = true;
    this.coinSound.mute = true;
  }

  unmuteAll(){
    this.backgroundMusic.mute = false;
    this.coinSound.mute = false;
  }

  /**
   * returns the character string to set the 
   * avatar of the character to...
   */
  getCharacterSkin(){
    const data = new DataStorage();
    let skinIndex = data.getCurrentSkin();

    let skinKey = "";
    switch(skinIndex) {
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
    
    if(skinKey === "") {
      throw "ERROR skin key not found...";
    }

    return skinKey;
  }
}
