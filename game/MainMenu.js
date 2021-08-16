/** @type {import("../typing/phaser")} */

class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
        this.menuState = {};
    }

    preload() {
        this.load.image('title', '../assets/images/menu/title.png');
        this.load.image('play-btn', '../assets/images/menu/generic-play-btn.png');
        this.load.image('shop-btn', '../assets/images/menu/generic-shop-btn.png');
        this.load.image('settings-btn', '../assets/images/menu/generic-settings-btn.png');
        this.load.image('scores-btn', '../assets/images/menu/generic-scores-btn.png');
    }

    create() {
        const titleSize = {width: 360, height: 67};
        const btnSize = {width: 320, height: 150}; // note height = height + spacing...

        this.menuState.title = this.add.sprite(((config.width - titleSize.width) / 2) + (titleSize.width / 2), titleSize.height, 'title');
        this.menuState.titleScale = 1; // initial scaling size
        this.menuState.scaleUp = true;

        // Place the btns
        let coord = this.calcBtnSpacing(btnSize, 3, 120);
        this.menuState.playBtn = this.add.sprite(coord.x, coord.y, 'play-btn');
        this.menuState.shopBtn = this.add.sprite(coord.x, coord.y + btnSize.height, 'shop-btn');
        this.menuState.settingBtn = this.add.sprite(coord.x, coord.y + btnSize.height * 2, 'settings-btn');
        this.menuState.scoreBtn = this.add.sprite(coord.x, coord.y + btnSize.height * 3, 'scores-btn');
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
    }

    /*
     Takes a btnSize object where width and height must be provided and number
     of buttons to be placed in a vertical alignment, and top spacing / padding. 
     it then returns an object containing the x and y cordinates to place 
     the btn (note this method assumes it is the first button placed)
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

    /*
     Takes a scale factor which dictates the rate of scaling, and a scale up which dictates
     if to scale the title up or down 
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
}