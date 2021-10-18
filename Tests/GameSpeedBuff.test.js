const GameController = require("../game/Controller/GameController")

test("return null if current speed given is 0", () => {
  const game = new GameController();
  expect(game.getDebuffSpeed(0,1.4)).toBe(null);
});

test("return null if speed multiplier is 0", () => {
    const game = new GameController();
    expect(game.getDebuffSpeed(200,0)).toBe(null);
});

  test("return correct output speed (positive)", () => {
    const game = new GameController();
    expect(game.getDebuffSpeed(200,1.4)).toBe(280);
});

test("return correct output speed (negativee)", () => {
    const game = new GameController();
    expect(game.getDebuffSpeed(-200,1.4)).toBe(-280);
});
