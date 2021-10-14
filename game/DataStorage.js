/** @type {import("../typing/phaser")} */


class DataStorage {

    constructor() {
        this.score = new Score();
        this.unlockable = new Unlockable();
    }

    // the default diffulty level is 0
    getDifficulty() {
        return parseInt(localStorage.getItem("difficulty") || 0);
    }

    setDifficulty(difficltyLevel) {
        if(difficltyLevel >= 0 && difficltyLevel <= 2) { // only three possible levels 0, 1, 2
            localStorage.setItem("difficulty", difficltyLevel);
        } else {
            throw "Difficulty not in range 0 - 2";
        }
    }

    // the event 0 random
    // 1 is default
    // 2 is gravity
    // 3 is flip
    getEvent() {
        return parseInt(localStorage.getItem("eventType") || 0);
    }

    setEvent(eventType) {
        if(eventType >= 0 && eventType <= 3) {
            localStorage.setItem("eventType", eventType);
        } else {
            throw "Event not in range 0 - 3";
        }
    }

    getAudio(){
        return parseInt(localStorage.getItem("audio") || 1);
    }
    setAudio() {
        if(this.getAudio()=== 1) {
            localStorage.setItem("audio", 0);
        } else {
            localStorage.setItem("audio", 1);
        }
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

    lockAllSkins() {
        for(let i = 1; i < 3; i++) {
            localStorage.setItem("skin" + i, false);
        }
    }

    // get current skin return int
    getCurrentSkin() {
        return this.unlockable.currentSkin;
    }

    // set current skin takes int 0-2
    setCurrentSkin(skin) {
        let array = this.getUnlocks();

        if(skin < array.length && skin >= 0) {
            this.unlockable.currentSkin = skin;
            localStorage.setItem("currentSkin" , skin);
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
