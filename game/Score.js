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
// need to check if right
// takes either 'laser', 'classic' and 'gun' for gameType
function updateScore(gameType, score) {
    switch (gameType) {
        case 'laser':
            if (Score._laserScore < score) {
                Score._laserScore = score;
                // value of score is binding to the local storage key 'laserScore'
                localStorage.setItem('laserScore',score)
            }
            break;

        case 'classic':
            if (Score._classicScore < score) {
                Score._classicScore = score;
                localStorage.setItem('classicScore',score)
            }
            break;

        case 'gun':
            if (Score._gunScore < score) {
                Score._gunScore = score;
                localStorage.setItem('gunScore',score)
            }
            break;
        default:
            break;
    }
}