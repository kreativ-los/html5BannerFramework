'use strict';

import config from './config.json';

import gulp from 'gulp';
import path from 'path';
import uglify from 'gulp-uglify';

/**
* Build scripts.
*/
export const scripts = gulp.src(config.js.source)
    .pipe(uglify());
