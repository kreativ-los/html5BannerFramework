'use strict';

import config from './config.json';

import gulp from 'gulp';
import fs from 'fs';
import path from 'path';

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

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
