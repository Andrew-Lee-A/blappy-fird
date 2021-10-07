/** @type {import("../typing/phaser")} */

class Unlockable {
    constructor() {
        // 0 = default skin
        // 1 = skin 1
        // 2 = skin 2
        this.unlocked = ['true', localStorage.getItem('skin1') || 'false', localStorage.getItem('skin2') || 'false']

        this.currentSkin = parseInt(localStorage.getItem("currentSkin")) || 0; 
    }
}