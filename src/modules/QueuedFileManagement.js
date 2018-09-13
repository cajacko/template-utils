// @flow

import { copy, ensureFile, pathExists, writeJSON, writeFile } from 'fs-extra';
import { join } from 'path';
import copyTmpl from '../copyTmpl';
import promiseQueue from '../promiseQueue';

class QueuedFileManagement {
  constructor(tmplPath, destPath) {
    this.filesToWrite = {};

    if (tmplPath) this.setTmplPath(tmplPath);
    if (destPath) this.setDestPath(destPath);

    this.write = this.write.bind(this);
  }

  setTmplPath(path) {
    this.tmplPath = path;
  }

  setDestPath(path) {
    this.destPath = path;
  }

  getPath(path, base) {
    if (path.startsWith('/') || !base) return path;

    return join(base, path);
  }

  getTmplPath(tmplPath) {
    return this.getPath(tmplPath, this.tmplPath);
  }

  getDestPath(destPath, tmplPath) {
    if (!destPath && tmplPath) return this.getPath(tmplPath, this.destPath);

    return this.getPath(destPath, this.destPath);
  }

  getPaths(src, dest) {
    return {
      src: this.getTmplPath(src),
      dest: this.getDestPath(dest, src),
    };
  }

  write() {
    const promises = [];

    Object.keys(this.filesToWrite).forEach((dest) => {
      const {
        onlyIfDoesNotExist,
        path,
        variables,
        json,
        contents,
      } = this.filesToWrite[dest];

      const promise = () =>
        this.conditionallyCheckIfExists(dest, onlyIfDoesNotExist, () =>
          ensureFile(dest).then(() => {
            if (json) {
              return writeJSON(dest, json, { spaces: 2 });
            }

            if (contents) {
              return writeFile(dest, contents);
            }

            if (variables) {
              return copyTmpl(path, dest, variables);
            }

            return copy(path, dest);
          }));

      promises.push(promise);
    });

    return promiseQueue(promises, 10);
  }

  conditionallyCheckIfExists(dest, onlyIfDoesNotExist, cb) {
    if (onlyIfDoesNotExist) {
      return pathExists(dest).then((exists) => {
        if (exists) return Promise.resolve();

        return cb();
      });
    }

    return cb();
  }

  copyIfDoesNotExist(srcArg, destArg) {
    const { src, dest } = this.getPaths(srcArg, destArg);

    this.filesToWrite[dest] = {
      onlyIfDoesNotExist: true,
      path: src,
    };
  }

  copyTmpl(srcArg, destArg, options) {
    const { src, dest } = this.getPaths(srcArg, destArg);

    this.filesToWrite[dest] = {
      path: src,
      variables: options,
    };
  }

  writeJSON(json, relativeDest) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      json,
    };
  }

  writeFile(relativeDest, contents) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      contents,
    };
  }

  writeFileIfDoesNotExist(relativeDest, contents) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      contents,
      onlyIfDoesNotExist: true,
    };
  }

  copy(srcArg, destArg) {
    const { src, dest } = this.getPaths(srcArg, destArg);

    this.filesToWrite[dest] = {
      path: src,
    };
  }
}

export default QueuedFileManagement;
