'use strict';

import config from './config.json';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

/**
* Build stylesheets.
*/
export const styles = gulp.src(config.css.source)
  .pipe(sass(
    {includePaths: ['./node_modules'], noCache: true}
  ))
  .pipe(autoprefixer());
