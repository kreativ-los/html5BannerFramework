'use strict';

import config from './config.json';
import vendors from '../source/_conf/vendors.json';

import gulp from 'gulp';
import sass from 'gulp-sass';
import path from 'path';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import through2 from 'through2';

function getBannerType(file) {
  return path.basename(path.dirname(file.path)).split('--')[0];
}

function buildVarString(fileName, vendor) {
  let variables = {};
  variables.vendor = vendor;
  variables['banner--width'] = vendors[vendor].sizes[fileName].width + 'px';
  variables['banner--height'] = vendors[vendor].sizes[fileName].height + 'px';

  let varString = '';
  for (let variable in variables) {
    varString += `$${variable}: ${variables[variable]};\n`;
  }

  return varString;
}

function injectSassVars(vendor) {
  return through2.obj(function(file, enc, done) {
    const fileName = getBannerType(file);
    const variablesBuffer = new Buffer(buildVarString(fileName, vendor), file);
    file.contents = Buffer.concat([variablesBuffer, file.contents], variablesBuffer.length + file.contents.length);
    this.push(file);
    done();
  });
}

/**
* Build stylesheets.
*/
export default function(vendor) {
  return gulp.src(config.css.source)
    .pipe(injectSassVars(vendor))
    .pipe(sass(
      {
        includePaths: ['./node_modules'],
        noCache: true,
      }
    ))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer());
}
