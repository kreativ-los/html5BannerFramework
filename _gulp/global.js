'use strict';

import config from './config.json';
import vendors from '../source/_conf/vendors.json';

import gulp from 'gulp';
import path from 'path';
import {getDirectories} from './helpers';

/**
* Copy global files.
*/
gulp.task('copy:global', function() {
  let stream = gulp.src(config.globalFiles.source);

  for (let vendor in vendors) {
    let vendorPath = path.join(config.globalFiles.dest, vendor);

    let directories = getDirectories(vendorPath);
    for (let i = 0; i < directories.length; i++) {
      stream = stream.pipe(gulp.dest(path.join(vendorPath, directories[i])));
    }
  }

  return stream;
});
