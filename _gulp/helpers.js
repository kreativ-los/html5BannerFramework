import path from 'path';
import fs from 'fs';

/**
 * Get directories in folder.
 * @param  {String} srcpath The path to look in.
 * @return {Array}          An array of directories (strings).
 */
export function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

export function getBannerType(file) {
  return path.basename(file.path, path.extname(file.path)).split('--')[0];
}
