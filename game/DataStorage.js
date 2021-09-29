/** @type {import("../typing/phaser")} */


class DataStorage {

    constructor() {
        this.score = new Score();
        this.unlockable = new Unlockable();
    }

    // return array of unlocks
    getUnlocks() {
        return this.unlockable.unlocked;
    }

    // unlocks skins
    unlockSkin(skin) {
        if (skin === 1 || skin === 2) {
            localStorage.setItem("skin" + skin, true);
        }
        else {
            console.log('error');
        }
    }

    // get current skin return int
    getCurrentSkin() {
        return this.unlockable.currentSkin;
    }

    // set current skin takes int 0-2
    setCurrentSkin(skin) {
        let array = this.getUnlocks();
        if (array[skin] === 'true') {
            this.unlockable.currentSkin = skin;
            localStorage.setItem("currentSkin" , skin);
        } else {
            console.log('Need to unlock');
        }
    }

    getCoin() {
        return parseInt(localStorage.getItem('coin')) || 0;
    }

    setCoin(coin) {
        let totalCoin = parseInt(localStorage.getItem('coin')) || 0;
        totalCoin = parseInt(totalCoin) + parseInt(coin);
        localStorage.setItem("coin", totalCoin);
    }

    // gameType specify what game score to set
    setScore(gameType, score) {
        switch (gameType) {
            case 'laser':
                // check if new score is higher then the old score
                if (this.score._laserScore < score) {
                    this.score._laserScore = score;
                    // value of score is binding to the local storage key 'laserScore'
                    localStorage.setItem('laserScore', score)
                }
                break;

            case 'classic':
                if (this.score._classicScore < score) {
                    this.score._classicScore = score;
                    localStorage.setItem('classicScore', score)
                }
                break;

            case 'gun':
                if (this.score._gunScore < score) {
                    this.score._gunScore = score;
                    localStorage.setItem('gunScore', score)
                }
                break;
            default:
                break;
        }
    }

    // gameType specify what game score to get
    getScore(gameType) {
        switch (gameType) {
            case 'laser':
                return this.score._laserScore;

            case 'classic':
                return this.score._classicScore;

            case 'gun':
                return this.score._gunScore;

            default:
                break;
        }
    }
}
