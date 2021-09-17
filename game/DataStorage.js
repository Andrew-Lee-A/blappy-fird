/** @type {import("../typing/phaser")} */

/** @type {import("../typing/phaser")} */

class DataStorage {

    constructor() {
        this.score = new Score();
    }
    getCoin() {
        return parseInt(localStorage.getItem('coin')) || 0;
    }

    setCoin(coin) {
        let totalCoin = parseInt(localStorage.getItem('coin')) || 0;
        totalCoin = parseInt(totalCoin) + parseInt(coin);
        localStorage.setItem("coin", totalCoin);
    }

    setScore(gameType, score) {
        switch (gameType) {
            case 'laser':
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
