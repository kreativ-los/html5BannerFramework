'use strict';

import config from './_gulp/config.json';
import vendors from './source/_conf/vendors.json';

import gulp from 'gulp';
import inject from 'gulp-inject';
import es from 'event-stream';
import path from 'path';
import fs from 'fs';
import folderSize from 'get-folder-size';
import rename from 'gulp-rename';
import open from 'gulp-open';
import replace from 'gulp-replace';
import archiver from 'archiver';
import {getDirectories, getBannerType} from './_gulp/helpers';

import scripts from './_gulp/scripts';
import styles from './_gulp/styles';
import './_gulp/images';
import './_gulp/global';

function getClicktag(vendor) {
  return vendors[vendor].clicktag.html;
}

function getMeta(vendor) {
  const meta = vendors[vendor].meta;
  if (!meta) return '';

  let result = '';

  for (let i = 0; i < meta.length; i++) {
    result += `<meta name="${meta[i].name}" content="${meta[i].content}">\n`;
  }

  return result;
}

function replaceBannerSpecificContent(file, vendor, p1) {
  if (p1 === 'title') return config.title;

  return vendors[vendor].sizes[getBannerType(file)][p1];
}

/**
* Build html files.
*/
gulp.task('build:html', function(done) {
  let tasks = [];
  for (let vendor in vendors) {
    tasks.push(gulp.src(config.html.source)
      .pipe(replace('<!-- vendor:meta -->', getMeta(vendor)))
      .pipe(replace('<!-- vendor:clicktag -->', getClicktag(vendor)))
      .pipe(replace('<!-- clicktag:end -->', '</a>'))
      .pipe(replace(/<!-- banner:(.*?) -->/g, function(match, p1) {
        return replaceBannerSpecificContent(this.file, vendor, p1);
      }))
      .pipe(
        inject(es.merge(scripts.call(this, vendor), styles.call(this, vendor)), {
          starttag: '/* inject:{{ext}} */',
          endtag: '/* endinject */',
          transform: function(filePath, file, i, len, target) {
            if (!config.multiBanner || path.basename(path.dirname(file.path)) === target.stem) {
              // return file contents as string
              return file.contents.toString('utf8');
            }
          },
          removeTags: true,
        })
      )
      .pipe(rename(function(file) {
        if (config.multiBanner) {
          file.dirname = path.join(file.dirname, file.basename);
          file.basename = 'index';
        }
      }))
      .pipe(gulp.dest(path.resolve(config.html.dest, vendor))));
  }

  let stream = es.merge(...tasks);
  stream.on('end', done);
  return stream;
});

function zip(vendor, banner) {
  return new Promise(function(resolve, reject) {
    let dir = path.resolve('./zip', vendor);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    let output = fs.createWriteStream(path.join(dir, banner + '.zip'));
    let archive = archiver('zip', {
      zlib: {level: 9},
    });

    archive.pipe(output);
    archive.directory(path.join('./build', vendor, banner), '');

    output.on('close', () => {
      resolve();
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.finalize();
  });
}

/**
 * Zip banners.
 */
gulp.task('zip', function(done) {
  let zipTasks = [];
  const zipDir = path.resolve('./zip');

  if (!fs.existsSync(zipDir)) fs.mkdirSync(zipDir);

  for (let vendor in vendors) {
    const basePath = path.join('./build', vendor);
    let banners = getDirectories(basePath);

    for (let banner of banners) {
      zipTasks.push(zip(vendor, banner));
    }
  }

  Promise.all(zipTasks).then(() => {
    done();
  }, (err) => {
    throw err;
  });
});


/**
 * Open build banners.
 */
gulp.task('open', function() {
  return gulp.src('./build/**/*.html')
    .pipe(open());
});

/**
 * Print size of build banners.
 * @param  {Function} done Callback function.
 * @TODO Print size on disk.
 */
function printBuildSize(done) {
  let buildPath = './build/';
  let foldersLeft = 0;

  for (let vendor in vendors) {
    let vendorBuildPath = path.join(buildPath, vendor);
    let directories = getDirectories(vendorBuildPath);
    let printVendor = true;


    for (let i = 0; i < directories.length; i++) {
      foldersLeft++;
      folderSize(path.join(vendorBuildPath, directories[i]), function(err, size) {
        if (err) { throw err; }

        if (printVendor) {
          console.log('');
          console.log(vendor.toUpperCase() + ':');
          console.log('----------');
          printVendor = false;
        }

        console.log(directories[i].replace(/\b\w/g, function(l) { return l.toUpperCase(); }) + ': ' + (size / 1024).toFixed(2) + ' kb');

        foldersLeft--;

        if (foldersLeft === 0) {
          console.log('');
          done();
        }
      });
    }
  }
}

/**
 * Watch task.
 * @param  {Function} done Callback function.
 */
function watch(done) {
  gulp.watch(config.html.source).on('change', gulp.series('build:html'));
  gulp.watch(config.css.source).on('change', gulp.series('build:html'));
  gulp.watch(config.js.source).on('change', gulp.series('build:html'));
  gulp.watch(config.images.source).on('change', gulp.series('copy:images'));
  gulp.watch(config.globalFiles.source).on('change', gulp.series('copy:global'));

  done();
}

/**
* Build all.
*/
gulp.task('build', gulp.series('build:html', 'copy:images', 'copy:global', printBuildSize));

/**
* Build all and start watch task.
*/
gulp.task('watch', gulp.series('build', watch));
