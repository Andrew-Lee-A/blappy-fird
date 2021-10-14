class Settings extends Phaser.Scene {
    constructor() {
        super({ key: 'Settings' });
        this.menuState = {};
        this.spacing = 50;
    }

    preload() {
        //for background
        this.load.image('player-red', '../assets/images/menu/player-sprite.png');
        this.load.image('player-blue', '../assets/images/menu/player-blue-sprite.png');
        this.load.image('player-green', '../assets/images/menu/player-green-sprite.png');

        this.load.image('easy', '../assets/buttons/easy.png');
        this.load.image('medium', '../assets/buttons/medium.png');
        this.load.image('hard', '../assets/buttons/hard.png');
        this.load.image('exit', '../assets/game-over/exit.png');

        this.load.image('default', '../assets/buttons/default.png');
        this.load.image('gravity', '../assets/buttons/gravity.png');
        this.load.image('flip', '../assets/buttons/flip.png');
        this.load.image('random', '../assets/buttons/random.png');
    }

    create() {
        // set up background sprite movement
        this.menuState.bgMove = [];
        this.menuState.bgMove[0] = this.add.sprite(-100, Math.random() * config.height, 'player-red');
        this.menuState.bgMove[1] = this.add.sprite(-200, Math.random() * config.height, 'player-blue');
        this.menuState.bgMove[2] = this.add.sprite(-300, Math.random() * config.height, 'player-green');

        // transaprent background
        this.r1 = this.add.rectangle(300, 400, 540, 520, 0x000000);
        this.r1.alpha = 0.3;

        // Exit button
        this.exitBtn = this.add.image(300, 730, 'exit');
        // button functions
        this.exitBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.scene.start('MainMenu');
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.exitBtn.setTint(0x808080)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.exitBtn.setTint(0xffffff)
            });

        this.add.text(50, 165, "Audio", { fontSize: 55, textAlign: "Right" });
        this.add.text(50, 235, "difficulty", { fontSize: 55, textAlign: "Right" });
        this.add.text(50, 440, "Event", { fontSize: 55, textAlign: "Right" });
        this.add.text(60, 30, "Settings", { fontSize: 95, textAlign: "Right" });
        // buttons
        let data = new DataStorage();
        // difficulty
        // easy
        this.easyBtn = this.add.image(130, 350, "easy");
        this.easyBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.easyBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.easyBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.easyBtn.setTint(0x8afbff)
                data.setDifficulty(0);
                console.log('Difficulty ' + data.getDifficulty());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.easyBtn.setTint(0xffffff)
            })

        this.mediumBtn = this.add.image(300, 350, "medium");
        this.mediumBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.mediumBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.mediumBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.mediumBtn.setTint(0x8afbff)
                data.setDifficulty(1);
                console.log('Difficulty ' + data.getDifficulty());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.mediumBtn.setTint(0xffffff)
            })

        this.hardBtn = this.add.image(470, 350, "hard");
        this.hardBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.hardBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.hardBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.hardBtn.setTint(0x8afbff)
                data.setDifficulty(2);
                console.log('Difficulty ' + data.getDifficulty());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.hardBtn.setTint(0xffffff)
            })
        // event
        // Default
        this.defaultBtn = this.add.image(130, 570, "default");
        this.defaultBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.defaultBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.defaultBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.defaultBtn.setTint(0x8afbff)
                data.setEvent(1);
                console.log('Event ' + data.getEvent());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.defaultBtn.setTint(0xffffff)
            })
        // Gravity
        this.gravityBtn = this.add.image(300, 570, "gravity");
        this.gravityBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.gravityBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.gravityBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.gravityBtn.setTint(0x8afbff)
                data.setEvent(2);
                console.log('Event ' + data.getEvent());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.gravityBtn.setTint(0xffffff)
            })
        // Flip
        this.flipBtn = this.add.image(470, 570, "flip");
        this.flipBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.flipBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.flipBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.flipBtn.setTint(0x8afbff)
                data.setEvent(3);
                console.log('Event ' + data.getEvent());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.flipBtn.setTint(0xffffff)
            })
        // Random
        this.randomBtn = this.add.image(470, 470, "random");
        this.randomBtn.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.randomBtn.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.randomBtn.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.randomBtn.setTint(0x8afbff)
                data.setEvent(0);
                console.log('Event ' + data.getEvent());
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.gravityBtn.setTint(0xffffff)
            })
    }

    update() {
        // movement for background sprites
        this.moveSprites(this.menuState.bgMove);
    }

    /**
     * takes an array of sprites and loops through them
     * making sure that they are not exceeding the bounds
     * if so loop them back to start
     * @param {sprite[]} playerSprites 
     */
    moveSprites(playerSprites) {
        playerSprites.forEach(s => {
            if (s.x > (config.width + s.width)) {
                s.x = Math.random() * -300;
                s.y = (Math.random() * (config.height - 200)) + 100; // never at height upper / lower bounds
            } else {
                s.x += 1;
            }
        })
    }
}