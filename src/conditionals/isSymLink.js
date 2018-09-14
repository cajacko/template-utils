import { lstat } from 'fs';
import path from 'path';

const isSymlink = filepath =>
  new Promise((resolve, reject) => {
    if (typeof filepath !== 'string') {
      reject(new TypeError('expected filepath to be a string'));
      return;
    }

    lstat(path.resolve(filepath), (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stats.isSymbolicLink());
    });
  });

export default isSymlink;
