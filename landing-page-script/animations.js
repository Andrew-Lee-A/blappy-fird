/**
 * adds animation to on hover of the call
 * to action button
 */
function addCallToActionAnime() {
    const sect = document.querySelector(".call-to-action");

    // Creating all the inital conditions for the squares
    const NUM_SQUARES = 8;
    const squares = [];
    for(let i = 0; i < NUM_SQUARES; i++) {
        const square = document.createElement('div');
        square.style.position = 'absolute';
        square.style.top = '50%';
        square.style.left = '50%';
        square.style.zIndex = '-1';
        square.style.backgroundColor = '#47e482';
        square.style.width = '10%';
        square.style.height = '30%';
        square.style.borderRadius = '12px';
        sect.appendChild(square);
        squares[i] = square;
    }

    // add the event listeners for the call to action button
    sect.addEventListener('mouseenter', () => {
        const ease = 'easeOutElastic(0.5, .7)';
        const duration = 2000;

        createSquareAnimation(squares[0], anime.random(150, 250), anime.random(100, 150), anime.random(0, 180), duration, ease, anime.random(0.8, 1.6));
        createSquareAnimation(squares[1], anime.random(150, 250), anime.random(-100, -120), anime.random(0, 180), duration, ease, anime.random(1, 1.6));
        createSquareAnimation(squares[2], anime.random(-220, -250), anime.random(-50, -120), anime.random(0, 180), duration, ease, anime.random(0.5, 1));
        createSquareAnimation(squares[3], anime.random(-250, -300), anime.random(50, 120), anime.random(0, 180), duration, ease, anime.random(0.8, 1));
        createSquareAnimation(squares[4], anime.random(-50, 50), anime.random(100, 140), anime.random(0, 180), duration, ease, anime.random(1, 1.7));
        createSquareAnimation(squares[5], anime.random(-100, 100), anime.random(-140, -160), anime.random(0, 180), duration, ease, anime.random(1, 1.7));
        createSquareAnimation(squares[6], anime.random(300, 400), anime.random(0, -160), anime.random(0, 180), duration, ease, anime.random(1, 2.5));
        createSquareAnimation(squares[7], anime.random(-300, -400), anime.random(0, -160), anime.random(0, 180), duration, ease, anime.random(1, 2.5));
    });


    sect.addEventListener('mouseleave', () => {
        anime.remove(squares[0]);
        for(let i = 0; i < NUM_SQUARES; i++) {
            anime.remove(squares[i]);
            anime({
                targets: squares[i],
                translateY: 0,
                translateX: 0,
                rotate: 0,
                duration: 2000,
                scale: 1,
            })
        }
    });
}

// generic factory function for creating an anime object
function createSquareAnimation(target, translateX, translateY, rotate, duration, easing, scale) {
    anime({
        targets: target,
        translateY: translateY,
        translateX: translateX,
        rotate: rotate,
        duration: duration,
        easing: easing,
        scale: scale,
    });
}

/**
 * adds animation to title
 */
function addTitleAnime() {
    const heading = document.querySelector(".main-heading")

    // Generic animejs draw functionality... boilerplate can be found in their documentation... https://animejs.com/documentation/#lineDrawing
    anime({
        targets: ".main-heading path",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 2000,
        direction: 'alternate',
        loop: true
    });
}

// call required methods...
addCallToActionAnime();
addTitleAnime();