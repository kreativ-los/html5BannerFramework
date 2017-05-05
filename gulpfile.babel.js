'use strict';

import config from './gulp/config.json';

import gulp from 'gulp';
import inject from 'gulp-inject';
import es from 'event-stream';

import {scripts} from './gulp/scripts';
import {styles} from './gulp/styles';
import './gulp/images';
import './gulp/root-files';

/**
* Build html files.
*/
gulp.task('build:html', function() {
  return gulp.src(config.html.source)
    .pipe(inject(es.merge(scripts, styles), {
      starttag: '<!-- inject:{{ext}} -->',
      transform: function(filePath, file) {
        // return file contents as string
        return file.contents.toString('utf8');
      },
      removeTags: true,
    }))
    .pipe(gulp.dest(config.html.dest));
});

function watch(done) {
  gulp.watch(config.html.source).on('change', gulp.series('build:html'));
  gulp.watch(config.css.source).on('change', gulp.series('build:html'));
  gulp.watch(config.js.source).on('change', gulp.series('build:html'));
  gulp.watch(config.images.source).on('change', gulp.series('copy:images'));
  gulp.watch(config.rootFiles.source).on('change', gulp.series('copy:root'));
  done();
}

/**
* Build all.
*/
gulp.task('build', gulp.series('build:html', 'copy:images', 'copy:root'));

/**
* Build all and start watch task.
*/
gulp.task('watch', gulp.series('build', watch));
