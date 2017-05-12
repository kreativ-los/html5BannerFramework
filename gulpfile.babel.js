'use strict';

import config from './gulp/config.json';

import gulp from 'gulp';
import inject from 'gulp-inject';
import es from 'event-stream';
import path from 'path';

import {scripts} from './gulp/scripts';
import {styles} from './gulp/styles';
import './gulp/images';
import './gulp/global';

/**
* Build html files.
*/
gulp.task('build:html', function() {
  return gulp.src(config.html.source)
    .pipe(
      inject(es.merge(scripts, styles), {
        starttag: '<!-- inject:{{ext}} -->',
        transform: function(filePath, file, i, len, target) {
          if (!config.multyBanner || file.dirname.split(path.sep).pop() === target.stem) {
            // return file contents as string
            return file.contents.toString('utf8');
          }
        },
        removeTags: true,
      })
    )
    .pipe(gulp.dest((file) => {
      return config.multyBanner ? path.join(config.html.dest, file.stem) : config.html.dest;
    }));
});

function watch(done) {
  gulp.watch(config.html.source).on('change', gulp.series('build:html'));
  gulp.watch(config.css.source).on('change', gulp.series('build:html'));
  gulp.watch(config.js.source).on('change', gulp.series('build:html'));
  gulp.watch(config.images.source).on('change', gulp.series('copy:images'));
  gulp.watch(config.rootFiles.source).on('change', gulp.series('copy:global'));
  done();
}

/**
* Build all.
*/
gulp.task('build', gulp.series('build:html', 'copy:images', 'copy:global'));

/**
* Build all and start watch task.
*/
gulp.task('watch', gulp.series('build', watch));
