class UIScene extends Phaser.Scene{
    constructor(){
        super({key : "UIScene"});
    }

    preload() {
        this.load.image("resumeButton", "assets/buttons/resume.png");
        this.load.image("pauseButton", "assets/buttons/pause.png");
        this.load.image("homeButton", "assets/buttons/home.png");
        this.load.image("muteButton", "assets/buttons/audio_on.png");
        this.load.image("unmuteButton", "assets/buttons/audio_off.png");
    }

    create(){
        this.buttonMenu = new ButtonMenu(this)

        const width = this.scale;
        const pauseButton = this.add.image(width-10, 10, 'pauseButton');

    }
}