'use strict';

import config from './config.json';
import vendors from '../source/_conf/vendors.json';

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import path from 'path';

/**
* Copy the images.
*/
gulp.task('copy:images', function() {
  let stream = gulp.src(config.images.source)
    .pipe(imagemin([pngquant({
      quality: '60-70',
    })]));

  for (let vendor in vendors) {
    stream = stream.pipe(gulp.dest(path.resolve(config.images.dest, vendor)));
  }

  return stream;
});
