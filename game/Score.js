/** @type {import("../typing/phaser")} */

class Score {
    constructor() {
        // find local storage of game type
        // if not found then it is set to 0
        this._laserScore = parseInt(localStorage.getItem('laserScore')) || 0;
        this._classicScore = parseInt(localStorage.getItem('classicScore')) || 0;
        this._gunScore = parseInt(localStorage.getItem('gunScore')) || 0;
    }
}
