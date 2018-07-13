'use strict';

import config from './config.json';
import vendors from '../source/_conf/vendors.json';

import gulp from 'gulp';
import sass from 'gulp-sass';
import path from 'path';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import through2 from 'through2';

function buildVarString(fileName) {
  let variables = {};
  variables.vendor = config.vendor;
  variables['banner--width'] = vendors[config.vendor].sizes[fileName].width + 'px';
  variables['banner--height'] = vendors[config.vendor].sizes[fileName].height + 'px';

  let varString = '';
  for (let variable in variables) {
    varString += `$${variable}: ${JSON.stringify(variables[variable])};\n`;
  }

  return varString;
}

function injectSassVars() {
  return through2.obj(function(file, enc, done) {
    const fileName = path.basename(path.dirname(file.path));
    const variablesBuffer = new Buffer(buildVarString(fileName), file);
    file.contents = Buffer.concat([variablesBuffer, file.contents], variablesBuffer.length + file.contents.length);
    this.push(file);
    done();
  });
}

/**
* Build stylesheets.
*/
export default gulp.src(config.css.source)
  .pipe(injectSassVars())
  .pipe(sass(
    {
      includePaths: ['./node_modules'],
      noCache: true,
    }
  ))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(autoprefixer());
