'use strict';

import config from './config.json';

import gulp from 'gulp';
// import jspm from 'gulp-jspm';
// import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

/**
* Build scripts.
*/
export const scripts = gulp.src(config.js.source)
  // .pipe(jspm({selfExecutingBundle: true}))
  // .pipe(rename(path => {
  //   path.basename = path.basename.replace('.bundle', '');
  // }))
  .pipe(uglify());
