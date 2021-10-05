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
        this.ScorePlacement = this.physics.add.group();
        this.ScoreName = this.physics.add.group();
        this.ScoreValue = this.physics.add.group();
        this.createScores();
        this.updateScores();
        for (let i = 0; i < 10; i++) {
            this.ScorePlacement.create(this.add.text(65, 155 + (this.spacing * i), i+1 +")", { fontSize: 50, textAlign: "Right" }));
            this.ScoreName.create(this.add.text(155, 155 + (this.spacing * i), this.scores[i][0], { fontSize: 50, textAlign: "Right" }));
            this.ScoreValue.create(this.add.text(460, 155 + (this.spacing * i), this.scores[i][1], { fontSize: 50, textAlign: "Right" }));
        }



    }

    update() {
        // movement for background sprites
        this.moveSprites(this.menuState.bgMove);
    }

    createScores(){
        this.scores = [
            ['Matthew', 999],
            ['Deni', 900],
            ['Firb', 800],
            ['Rhys',700],
            ['Victor',600],
            ['Andrew',500],
            ['Gerard',400],
            ['Tyrell',300],
            ['Jambo',200],
            ['Jameson',100]
        ];
        // this.scores = [
        //     ['Jameson',100],
        //     ['Jambo',200],
        //     ['Tyrell',300],
        //     ['Gerard',400],
        //     ['Andrew',500],
        //     ['Victor',600],
        //     ['Rhys',700],
        //     ['Firb', 800],
        //     ['Deni', 900],
        //     ['Matthew', 999]
        // ];
    }

    updateScores(){
        let data = new DataStorage();
        let score = data.getScore('classic');
        let array = ['You',score]
        console.log(score);
        for (let i = 0; i <10; i++) {
            if(score > this.scores[i][1]){
                console.log(true);
                this.scores.splice(i,0,array);
                this.scores.splice(10,1);
                break;
            }
        }
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