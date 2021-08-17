/** @type {import("../typing/phaser")} */
class Game extends Phaser.Scene {
    constructor() {
        super({key: 'Game'});
    }


    preload() {
        this.load.image('player-sprite', '../assets/images/game/sprite.png');
        this.load.image('buff', '../assets/images/game/buff.png');
        this.load.image('blue-sprite', '../assets/images/game/blue-sprite.png');

    }

    create() {
        player = this.physics.add.image(100,450 , 'player-sprite');
        buff = this.physics.add.image(550,450 , 'buff');

        buff.setCollideWorldBounds(true);
        buff.setVelocityX(-150);

        this.physics.add.overlap(player, buff, collectBuff, null, this);

        
    }

    update() {
        
    }

    getEvents() {
        // create all event obj
    }

    pickEvent() {
        // pick a random event from event objs
    }

    
}

function collectBuff(player, buff){
    buff.disableBody(true, true);
    player = this.physics.add.image(100,450, 'blue-sprite');

}