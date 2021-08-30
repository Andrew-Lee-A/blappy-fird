const { test } = require('@jest/globals');
const GameOverController = require('../game/controllers/GameController');

test('spacing returned correct y padding value', () => {
    const gameOver = new GameOverController();
    expect(gameOver.gameOverSpacing(1000, 200, 50, 2)).toBe(350);
});

test('returns null with invalid height input', () => {
    const gameOver = new GameOverController();
    expect(gameOver.gameOverSpacing(-1, 200, 200, 4)).toBe(null);
});

test('returns null with invalid total button height', ()=> {
    const gameOver = new GameOverController();
    expect(gameOver.gameOverSpacing(1000, -1, 0, 4)).toBe(null);
})

test('returns null with invalid number of buttons input', () => {
    const gameOver = new GameOverController();
    expect(gameOver.gameOverSpacing(1000, 400, 0, -1)).toBe(null);
});

test('returns null with invalid top padding specified', () => {
    const gameOver = new GameOverController();
    expect(gameOver.gameOverSpacing(1000, 300, -1, 3)).toBe(null);
});