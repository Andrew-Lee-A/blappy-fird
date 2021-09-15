class GameController {
    
    /**
     * returns the correct spacing
     * for game over buttons in the y direction if
     * invalid input provided i.e. -1 spacing returns null
     * @param int height 
     * @param int totalButtonHeight
     * @param int topPadding
     * @param int buttons the amount of buttons on the screen
     * @return int spacing for each button
     */
    gameOverSpacing(height, totalButtonHeight, topPadding, buttons) {
       
        if(height <= 0) {
            return null;
        }

        else if (totalButtonHeight <= 0) {
            return null;
        }

        else if (topPadding < 0) {
            return null;
        }

        else if (buttons <= 0) {
            return null;
        }

        let remainingHeight = height - (2 * topPadding) - totalButtonHeight; // top padding on bottom as well
        let spacing = remainingHeight / buttons;
        return spacing;
    }
}

module.exports = GameController;
