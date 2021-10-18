const GameController = require("../game/Controller/GameController")

test("return null if input is not integer", () => {
  const game = new GameController();
  expect(game.extraLife("lives", "increment")).toBe(null);
});
test("return null if lives or increment is less than 0", () => {
  const game = new GameController();
  expect(game.extraLife(-1, -1)).toBe(null);
});
test("return max lives if lives + increment is more than max lives", () => {
  const game = new GameController();
  expect(game.extraLife(3, 1)).toBe(3);
});
test("return input lives + increment provided input valid", () => {
  const game = new GameController();
  expect(game.extraLife(2, 1)).toBe(3);
});