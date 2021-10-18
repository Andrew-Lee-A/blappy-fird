const SettingController = require('../game/Controller/SettingController');

test('X value being too big or negative return null', () => {
    const settingController = new SettingController();
    expect(settingController.difficultyBtnSpacing(700,400,150)).toBe(null);
})

test('Y value being too big or negative return null', () => {
    const settingController = new SettingController();
    expect(settingController.difficultyBtnSpacing(500,1000,150)).toBe(null);
})

test('When value are not integers return null', () => {
    const settingController = new SettingController();
    expect(settingController.difficultyBtnSpacing('a','b','c')).toBe(null);
})

test('Test all Values return null', () => {
    const settingController = new SettingController();
    expect(settingController.difficultyBtnSpacing(900,1100,"a")).toBe(null);
})

