class GameController {
  /**
   * @param String[] an array of strings for the event
   * @return String, the selected string
   */
  selectGameEvent(gameEvents) {
            let data = new DataStorage();
            if (data.getEvent() >= 0 && data.getEvent() <= 3) {
                if (data.getEvent() === 0) {
                    if(gameEvents instanceof Array && gameEvents.length >= 1) {
                        let selected = Math.floor(Math.random() * gameEvents.length);
                        return gameEvents[selected];
                        }throw "invalid game event array passed";
                } else if (data.getEvent() === 1) {
                    return gameEvents[0];
                } else if (data.getEvent() === 2) {
                    return gameEvents[1];
                } else if (data.getEvent() === 3) {
                    return gameEvents[2];
                }else{
                    return null;
                }
            } else{
                return null;
            }
        }
  /**
   *
   * @param {*} currentLives current lives of player
   * @param {*} increment values increment
   * @returns
   */
  extraLife(currentLives, increment) {
    if (!(Number.isInteger(currentLives) && Number.isInteger(increment))) {
      return null;
    } 
    else if (!(currentLives > 0 && increment > 0)) {
      return null;
    }

    let newLives = currentLives;
    if (currentLives + increment > 3) {
      // do nothing
    } 
    else {
      newLives += increment;
    }
    return newLives;
  }

  getDebuffSpeed(currentSpeed, speedEnchancer) {
    // if(currentSpeed == 0) {
    //   return null;
    // } else if(speedEnchancer == 0)  { // the enchancer cannot be 0
    //   return null;
    // }

    // return currentSpeed * speedEnchancer;
  }
  
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
    if (height <= 0) {
      return null;
    } else if (totalButtonHeight <= 0) {
      return null;
    } else if (topPadding < 0) {
      return null;
    } else if (buttons <= 0) {
      return null;
    }

    let remainingHeight = height - 2 * topPadding - totalButtonHeight; // top padding on bottom as well
    let spacing = remainingHeight / buttons;
    return spacing;
  }
}

try {
  module.exports = GameController;
} catch (error) {
    // Do nothing 
}
