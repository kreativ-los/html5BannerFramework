// SETTINGS
var ITERATION_COUNT = 2;

// Variables
var iteration = 1;

/**
 * Animate objects
 */
function animation() {
  console.log('Animation');
}

/**
 * Fade out objects
 */
function fadeOut() {
  console.log('Fade Out');
}

/**
 * Start animation
 */
function animate() {
  animation();

  if (iteration === ITERATION_COUNT) {
    return;
  }

  fadeOut();

  iteration++;
  animate();
}

animate();
