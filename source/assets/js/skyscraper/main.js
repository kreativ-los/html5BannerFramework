/* inject:vendor */

// SETTINGS
var ITERATION_COUNT = 2;

// Variables
var iteration = 1;

// GET OBJECTS
var object = document.querySelector('.object');

/**
 * Sets start states of objects
 */
function initAnimation() {
}

/**
 * Animate objects
 */
function animation() {
  // STEP ONE

  var stepTwoDelay = 3.5;
  // STEP TWO


  var stepThreeDelay = 4;
  // STEP THREE

  var stepFourDelay = 5.8;
  // STEP FOUR
  completeAnimation(); // default run as callback of last tween
}

/**
 * Fade out objects.
 */
function fadeOut() {
  var startDelay = 2;
  // FADE OUT
  animate(); // rerun animate function. default as callback of last tween
}

/**
 * Complete animation
 */
function completeAnimation() {
  if (iteration === ITERATION_COUNT) {
    return;
  }

  iteration++;

  fadeOut();
}

/**
 * Start animation
 */
function animate() {
  initAnimation();
  animation();
}

animate();
