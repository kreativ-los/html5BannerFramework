'use strict';

import config from './config.json';
import vendors from '../source/_conf/vendors.json';

import gulp from 'gulp';
import uglify from 'gulp-uglify';
import {prependFile as prepend} from 'gulp-append-prepend';
import path from 'path';

/**
* Build scripts.
*/
export default function(vendor) {
  return gulp.src(config.js.source)
    .pipe(prepend(path.resolve('source/_conf', vendors[vendor].clicktag.js)))
    .pipe(uglify());
}
