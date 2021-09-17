/** @type {import("../typing/phaser")} */
import Score from './Score';
import Unlockable from './Unlockable';

class Player {
    constructor() {
        this._numCoins = parseInt(localStorage.getItem('coin')) || 0;;
        this._unlocks = new Unlockable();
        this._score = new Score();
    }
}

function updateCoin(type, coin) {
    switch (type) {
        case '+':
            Player.coin = Player.coin + coin;
            localStorage.setItem('coin', Player.coin)
            break;
        case '-':
            Player.coin = Player.coin - coin;
            localStorage.setItem('coin', Player.coin)
            break;
        default:
            break;
    }
}