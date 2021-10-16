class SettingController {
    constructor() {
    }

    difficultyBtnSpacing(x, y, xBtnSpacing) {
        if (0 > x || 600 < x) {
            return null;
        } else if (0 > y || 800 < y) {
            return null;
        } else if (!(Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(xBtnSpacing))) {
            return null;
        }

        let spacing = {
            easyLocation: {
                x: 0,
                y: 0,
            },
            mediumLocation: {
                x: 0,
                y: 0,
            },
            hardLocation: {
                x: 0,
                y: 0,
            }
        };

        spacing.easyLocation.x = x;
        spacing.easyLocation.y = y;

        spacing.mediumLocation.x = x + xBtnSpacing;
        spacing.mediumLocation.y = y;

        spacing.hardLocation.x = xBtnSpacing + spacing.mediumLocation.x;
        spacing.hardLocation.y = y;

        return spacing;
    }
}

try {
    module.exports = SettingController;
} catch (e) {
    // do nothing module.exports is only used for testing
}