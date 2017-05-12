'use strict';

import config from './config.json';

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

/**
* Copy the images.
*/
gulp.task('copy:images', function() {
  return gulp.src(config.images.source)
    .pipe(imagemin([pngquant({
      quality: '60-70',
    })]))
    .pipe(gulp.dest(config.images.dest));
});
