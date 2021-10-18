

class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
        this.title = {};
        this.title.scale = 1;
        this.title.scaleUp = true;
    }
    
    preload() {
        this.load.image('game-over', '../assets/game-over/gameOver.png');
        this.load.image('small-btn', '../assets/game-over/small-btn.png');
        this.load.image('play-again', '../assets/game-over/play-again.png');
        this.load.image('exit', '../assets/game-over/exit.png');
    }

    create() {
        const gameController = new GameController();
        const exitHeight = 100;
        const playAgain = 100;
        const gameOver = 68;
        const trackers = 75;
        const padding = 50;
        const numButtons = 4;
        const spacingY = gameController.gameOverSpacing(config.height, exitHeight+playAgain+gameOver+trackers, padding, numButtons);
        
        //set backGround color to Black
        this.cameras.main.setBackgroundColor('#000000');

        let coins = localStorage.getItem("currentCoin");
        let score = localStorage.getItem("currentScore");

        let data = new DataStorage();

        // update coins
        console.log("current coin:"+data.getCoin());
        data.setCoin(coins);
        console.log("now coin:"+data.getCoin());

        // // update score
        // // gametype must be specify in single quotation
        // console.log("current score:"+data.getScore('classic'));
        // data.setScore('classic',score);
        // console.log("now score:"+data.getScore('classic'));



        this.title.gameOver = this.add.sprite(config.width/2, padding + 100, 'game-over');
        let coinText =  this.add.text(config.width/10, spacingY+padding+gameOver+spacingY, `Coins Collected: ${coins}`, {fill: '#FFFFFF', fontSize:'16px'});
        let scoreText = this.add.text(coinText.width + config.width/10 + 160,spacingY+padding+gameOver+spacingY, `Score: ${score}`, {fill: '#FFFFFF', fontSize:'16px'});
        let playAgainBtn = this.add.sprite(config.width/2, (spacingY*3)+padding+gameOver+scoreText.height+trackers, 'play-again');
        let exitBtn = this.add.sprite(config.width/2, (spacingY*4)+padding+gameOver+scoreText.height+trackers+playAgain, 'exit');
        const buttons = [playAgainBtn, exitBtn];
        this.btnEffects(buttons);
    }
    
    update() {

        // Scaling Object
        const scaling = {
            scalingFactor: 0.001,
            max: 1.15,
            min: 1.0,
        }

        if(this.title.scale >= scaling.max) {
            this.title.scaleUp = false;
        } else if(this.title.scale <= scaling.min) {
            this.title.scaleUp = true;
        }
        if(this.title.scaleUp) {
            this.scaleTitle(scaling.scalingFactor, this.title.scaleUp);
        } else {
            this.scaleTitle(scaling.scalingFactor, this.title.scaleUp);
        }
        
    }
    /**
     * Button Hover Effects for Play Again and Exit
     * @param {Array} buttons 
     */
    btnEffects(buttons) {
        buttons.forEach((btn, i) => {
            btn.setInteractive();
            btn.alpha = 0.5;

            btn.on('pointerdown', () => {
                this.scene.stop('GameOver');
                switch(i) {
                    case 0: {
                        this.scene.start('Game');
                        break;
                    }
                    case 1: {
                        this.scene.start('MainMenu');
                        break;
                    }
                }
            })

            btn.on('pointerover', function() {
                btn.alpha = 1;
            });

            btn.on('pointerout', function() {
                btn.alpha = 0.5;
            });
        });
    }
    /**
     * 
     * @param {double} scale 
     * @param {boolean} scaleUp 
     */
    scaleTitle(scale, scaleUp) {
        if(scaleUp) {
            this.title.scale += scale;
            this.title.gameOver.setScale(this.title.scale);
        } else {
            this.title.scale -= scale;
            this.title.gameOver.setScale(this.title.scale);
        }
    }
}