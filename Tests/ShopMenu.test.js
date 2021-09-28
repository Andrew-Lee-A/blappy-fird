const ShopMenuController = require('../game/Controller/ShopController');

test('width or height too small to adequately create menu where 400 is the minimum', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(399, 399, {width: 50, height: 50}, 300)).toBe(null);
})

test('when width not an integer return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing("width", 400, {width: 50, height: 50}, 300)).toBe(null);
})

test('when height not an integer return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, "height", {width: 50, height: 50}, 300)).toBe(null);
})

test('when arrow dimensions width not a number return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: "width", height: 50}, 300)).toBe(null);
})

test('when arrow dimensions height not a number return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: 50, height: "height"}, 300)).toBe(null);
})

test('when arrow dimension width is 0 or less return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: 0, height: 50}, 300)).toBe(null);
})

test('when arrow dimension height is 0 or less return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: 50, height: 0}, 300)).toBe(null);
})

test('when sprite spacing is not a number return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: 50, height: 50}, "sprite-spacing")).toBe(null);
})

test('when sprite spacing is 0 or less return null', () => {
    const shopController = new ShopMenuController();
    expect(shopController.shopMenuSpacing(400, 400, {width: 50, height: 50}, 0)).toBe(null);
})

test('valid output when all input parameters are correct', () => {
    const shopController = new ShopMenuController();
    const spacing = shopController.shopMenuSpacing(1000, 800, {width: 50, height: 50}, 300);
    // checks that when input all correctly all expected values returned...
    expect((spacing.titleLocation.x == 50 && spacing.titleLocation.y == 50) && (spacing.rightArrowStart.x == 670 && spacing.rightArrowStart.y == 450)
    && (spacing.leftArrowStart.x == 370 && spacing.leftArrowStart.y == 450) && (spacing.costLocation.x == 440 && spacing.costLocation.y == 650)).toBe(true);
})