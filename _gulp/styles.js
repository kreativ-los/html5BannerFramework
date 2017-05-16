'use strict';

import config from './config.json';

import gulp from 'gulp';
import path from 'path';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

/**
* Build stylesheets.
*/
export const styles = gulp.src(config.css.source)
   .pipe(sass(
     {includePaths: ['./node_modules'], noCache: true}
   ))
   .pipe(cleanCSS({compatibility: 'ie8'}))
   .pipe(autoprefixer());
