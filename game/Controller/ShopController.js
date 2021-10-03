class ShopController {
    constructor() {
        this.data = new DataStorage();
    }

    shopMenuSpacing(width, height, arrowDimensions, spriteSpace) {
        if(width < 400 || height < 400) {
            return null;
        } else if (!(Number.isInteger(width) && Number.isInteger(height))) {
            return null;
        } else if (!this.validShopDimension(arrowDimensions)) {
            return null;
        } else if (!(Number.isInteger(spriteSpace)) || spriteSpace <= 0) {
            return null;
        }

        let spacing = {
            titleLocation: {
                x: 0,
                y: 0,
            },
            rightArrowStart: {
                x: 0,
                y: 0,
            },
            leftArrowStart: {
                x: 0,
                y: 0,
            },
            costLocation: {
                x: 0,
                y: 0,
            },
        };

        const OFFSET_X = 80;   
        const VERTICAL_OFFSET = 100;   
        const TITLE_PADDING = 50;

        spacing.titleLocation.x = TITLE_PADDING;
        spacing.titleLocation.y = TITLE_PADDING;

        // set arrow spacing
        spacing.leftArrowStart.x = (width / 2) - arrowDimensions.width - OFFSET_X;
        spacing.rightArrowStart.x = spacing.leftArrowStart.x + spriteSpace;
        spacing.leftArrowStart.y = (height / 2) - arrowDimensions.height + VERTICAL_OFFSET;
        spacing.rightArrowStart.y = spacing.leftArrowStart.y;

        const TEXT_LENGTH = 60; 
        const VERTICAL_PADDING = 150;
        spacing.costLocation.x = (width / 2) - TEXT_LENGTH;
        spacing.costLocation.y = (height/ 2) + VERTICAL_PADDING + VERTICAL_OFFSET;

        return spacing;
    }

    validShopDimension(dimension) {
        let valid = true;
        if(!(Number.isInteger(dimension.width) && Number.isInteger(dimension.height))) {
            valid = false;
        } else if (dimension.width <= 0 || dimension.height <= 0) {
            valid = false;
        }
        return valid;
    }

    /**
     * takes a height of the window to allocate a home buttons coordinates
     * note assumes that the width must be exponetially greater than 50px...
     * @param {*} height 
     * @returns 
     */
    getHomePos(height) {
        if(Number.isInteger(height) && height >= 50) {
            return {x: 50, y: height - 50};
        } 
        return null;
    }

    /**
     * set the skin based on input index
     * @param {} skinIndex 
     */
    setSkin(skinIndex) {
        this.data.setCurrentSkin(skinIndex);
    }

    /**
     * takes a positive number representing a skin cost and
     * deducts the coin for the storage, and unlocks the skin 
     * @param {} skinIndex 
     * @param {*} skinCost 
     */
    unlockSkin(skinIndex, skinCost) {
        if(skinCost < 0) {
            throw "Skins cost should be a positive value";
        }
        this.data.setCoin(-skinCost);
        this.data.unlockSkin(skinIndex);
    }
}

try {
    module.exports = ShopController;
} catch(e) {
    // do nothing module.exports is only used for testing
}