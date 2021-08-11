/** @types {import("../typing/phaser")} */

class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
    }

    preload() {

    }

    create() {
        this.add.text(config.width/ 4, config.height / 2, 'Welcome!', {fill: 'FFFFFF', fontSize: '60px'});
    }

    update() {
        
    }
}