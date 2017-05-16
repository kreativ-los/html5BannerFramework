'use strict';

import config from './config.json';

import gulp from 'gulp';
import path from 'path';
import {getDirectories} from './helpers';

/**
* Copy global files.
*/
gulp.task('copy:global', function() {
  let stream = gulp.src(config.globalFiles.source);
  let directories = getDirectories(config.globalFiles.dest);
  for (let i = 0; i < directories.length; i++) {
    stream.pipe(gulp.dest(path.join(config.globalFiles.dest, directories[i])));
  }

  return stream;
});
