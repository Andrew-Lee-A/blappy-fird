class ScoreMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoreMenu' });
        this.menuState = {};
        this.spacing = 50;
    }

    preload() {
        //for background
        this.load.image('player-red', '../assets/images/menu/player-sprite.png');
        this.load.image('player-blue', '../assets/images/menu/player-blue-sprite.png');
        this.load.image('player-green', '../assets/images/menu/player-green-sprite.png');

        this.load.image('leaderboard', '../assets/images/menu/leaderboard.png');
        this.load.image('exit', '../assets/game-over/exit.png');
    }

    create() {
        // set up background sprite movement
        this.menuState.bgMove = [];
        this.menuState.bgMove[0] = this.add.sprite(-100, Math.random() * config.height, 'player-red');
        this.menuState.bgMove[1] = this.add.sprite(-200, Math.random() * config.height, 'player-blue');
        this.menuState.bgMove[2] = this.add.sprite(-300, Math.random() * config.height, 'player-green');

        const titleSize = { width: 420, height: 62 };
        this.menuState.title = this.add.sprite(((config.width - titleSize.width) / 2) + (titleSize.width / 2), titleSize.height, 'leaderboard');

        // transaprent background
        this.r1 = this.add.rectangle(300, 400, 520, 520, 0x000000);
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

        // create all score
        // currently made just to check the layout
        this.ScoreGroup = this.physics.add.group();
        for (let i = 1; i < 11; i++) {
            this.ScoreGroup.create(this.add.text(70, 105 + (this.spacing * i), i, { fontSize: 50, textAlign: "Right" }));
        }

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