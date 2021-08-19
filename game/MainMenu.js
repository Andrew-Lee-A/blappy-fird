/** @type {import("../typing/phaser")} */

class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
        this.menuState = {};
    }

    preload() {
        this.load.image('title', '../assets/images/menu/title.png');
        
        //buttons
        this.load.image('play-btn', '../assets/images/menu/generic-play-btn.png');
        this.load.image('shop-btn', '../assets/images/menu/generic-shop-btn.png');
        this.load.image('settings-btn', '../assets/images/menu/generic-settings-btn.png');
        this.load.image('scores-btn', '../assets/images/menu/generic-scores-btn.png');

        //selector
        this.load.image('pipe-selector', '../assets/images/menu/pipe-sprite.png');

        //for background
        this.load.image('player-red', '../assets/images/menu/player-sprite.png');
        this.load.image('player-blue', '../assets/images/menu/player-blue-sprite.png');
        this.load.image('player-green', '../assets/images/menu/player-green-sprite.png');
    }

    create() {
        const titleSize = {width: 360, height: 67};
        const btnSize = {width: 320, height: 150}; // note height = height + spacing...

        // set up background sprite movement
        this.menuState.bgMove = [];
        this.menuState.bgMove[0] = this.add.sprite(-100, Math.random() * config.height, 'player-red');
        this.menuState.bgMove[1] = this.add.sprite(-200, Math.random() * config.height, 'player-blue');
        this.menuState.bgMove[2] = this.add.sprite(-300, Math.random() * config.height, 'player-green');

        this.menuState.title = this.add.sprite(((config.width - titleSize.width) / 2) + (titleSize.width / 2), titleSize.height, 'title');
        this.menuState.titleScale = 1; // initial scaling size
        this.menuState.scaleUp = true;

        // Place the btns
        let coord = this.calcBtnSpacing(btnSize, 3, 120);
        this.menuState.playBtn = this.add.sprite(coord.x, coord.y, 'play-btn');
        this.menuState.shopBtn = this.add.sprite(coord.x, coord.y + btnSize.height, 'shop-btn');
        this.menuState.settingBtn = this.add.sprite(coord.x, coord.y + btnSize.height * 2, 'settings-btn');
        this.menuState.scoreBtn = this.add.sprite(coord.x, coord.y + btnSize.height * 3, 'scores-btn');

        // Set up pipe & on hover animations
        this.menuState.pipe = this.add.sprite(-20, coord.y, 'pipe-selector');
        this.addBtnEventListener([this.menuState.playBtn, this.menuState.shopBtn, this.menuState.settingBtn, this.menuState.scoreBtn], btnSize, coord, this.menuState.pipe);
    }

    update() {
        // animate the title
        const scaling = {
            scalingFactor: 0.001,
            max: 1.15,
            min: 1.0,
        };
        
        if(this.menuState.titleScale >= scaling.max) {
            this.menuState.scaleUp = false;
        } else if(this.menuState.titleScale <= scaling.min) {
            this.menuState.scaleUp = true;
        }

        if(this.menuState.scaleUp) {
            this.animateTitle(scaling.scalingFactor, this.menuState.scaleUp);
        } else {
            this.animateTitle(scaling.scalingFactor, this.menuState.scaleUp);
        }

        this.moveSprites(this.menuState.bgMove);
    }

    /**
     * 
     * Takes a btnSize object where width and height must be provided and number
     * of buttons to be placed in a vertical alignment, and top spacing / padding. 
     * it then returns an object containing the x and y cordinates to place 
     * the btn (note this method assumes it is the first button placed)
     * @param {int} btnSize 
     * @param {int} numBtn 
     * @param {int} topSpacing 
     * @returns 
     */
    calcBtnSpacing(btnSize, numBtn, topSpacing) {
        const location = {
            x: -1,
            y: -1,
        }

        location.x = ((config.width - btnSize.width) / 2) + (btnSize.width / 2);
        location.y = (config.height - (topSpacing * 2)) / numBtn;

        return location;
    }

    /**
     * 
     * Takes a scale factor which dictates the rate of scaling, and a scale up which dictates
     * if to scale the title up or down 
     * @param {double} scaleFactor 
     * @param {boolean} scaleUp 
     */
    animateTitle(scaleFactor, scaleUp) {
        if(scaleUp) {
            this.menuState.titleScale += scaleFactor;
            this.menuState.title.setScale(this.menuState.titleScale);
        } else {
            this.menuState.titleScale -= scaleFactor;
            this.menuState.title.setScale(this.menuState.titleScale);
        }
    }

    /**
     * Add eevent listeners to all of the buttons in menu
     * @param {sprite[]} btns 
     * @param {Object} btnSize 
     * @param {Object} btnCoord 
     * @param {sprite} pipe 
     */
    addBtnEventListener(btns, btnSize, btnCoord, pipe) {
        btns.forEach((btn, i) => {
            btn.setInteractive();
            btn.alpha = 0.5;

            btn.on('pointerover', function() {
                //this.menuState.pipe.y += 100;
                btn.alpha = 1;
                btnCoord.y;
                pipe.y = btnCoord.y + btnSize.height * i;
            });

            btn.on('pointerout', function() {
                btn.alpha = 0.5;
            });

            btn.on('pointerdown', () => {

                this.scene.stop('MainMenu');
                switch(i) {
                    case 0: {
                     this.scene.start('Game');
                     break;   
                    }
                    case 1: {
                     this.scene.start('ShopMenu');   
                     break;
                    }
                    case 2: {
                     this.scene.start('Settings');
                     break;
                    }
                    case 3: {
                     this.scene.start('ScoreMenu');   
                     break;
                    }
                }
            })
        })
    }

    /**
     * takes an array of sprites and loops through them
     * making sure that they are not exceeding the bounds
     * if so loop them back to start
     * @param {sprite[]} playerSprites 
     */
    moveSprites(playerSprites) {
        playerSprites.forEach(s => {
            if(s.x > (config.width + s.width)) {
                s.x = Math.random() * -300;
                s.y = (Math.random() * (config.height-200)) + 100; // never at height upper / lower bounds
            } else {
                s.x += 1;
            }
        }) 
    }
}