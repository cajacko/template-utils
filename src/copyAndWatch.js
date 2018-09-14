// @flow

import watch from 'watch';
import { copy, remove } from 'fs-extra';
import logger from './logger';

const withExitOnErrorWrap = exitOnError => (callback) => {
  try {
    callback();
  } catch (e) {
    if (exitOnError) {
      logger.error(e);
      process.exit(1);
    }
  }
};

const files = {};

class File {
  constructor(file, src, dest) {
    this.src = file;
    this.dest = file.replace(src, dest);
    this.next = null;
    this.current = null;

    this.doNext = this.doNext.bind(this);
  }

  doNext() {
    this.current = null;

    switch (this.next) {
      case 'copy':
        this.copy();
        break;
      case 'delete':
        this.delete();
        break;
      default:
        break;
    }

    this.next = null;
  }

  copy() {
    if (this.current) {
      this.next = 'copy';
    } else {
      this.current = 'copy';
      copy(this.src, this.dest)
        .catch()
        .then(this.doNext);
    }
  }

  remove() {
    if (this.current) {
      this.next = 'delete';
    } else {
      this.current = 'delete';
      remove(this.dest)
        .catch()
        .then(this.doNext);
    }
  }
}

const initFile = (file, src, dest) => {
  if (!files[file]) files[file] = new File(file, src, dest);
};

const copyFile = (file, src, dest) => {
  initFile(file, src, dest);

  files[file].copy();
};

const removeFile = (file, src, dest) => {
  initFile(file, src, dest);

  files[file].remove();
};

const copyAndWatch = (src, dest, options = {}) => {
  const { skipCopy, ignore, exitOnError } = options;

  const withExitOnError = withExitOnErrorWrap(exitOnError);

  const ifNotIgnore = (f, callback) => {
    let shouldIgnore = false;

    if (ignore) {
      ignore.forEach((ignorePattern) => {
        if (f.includes(ignorePattern)) shouldIgnore = true;
      });
    }

    if (shouldIgnore) return;

    callback();
  };

  const watchFunc = () => {
    logger.debug(`@sync "${src}" with "${dest}"`);

    withExitOnError(() => {
      watch.createMonitor(src, (monitor) => {
        withExitOnError(() => {
          monitor.on('created', (f) => {
            ifNotIgnore(f, () => {
              withExitOnError(() => {
                logger.debug(`@sync - created: ${f}`);
                copyFile(f, src, dest);
              });
            });
          });

          monitor.on('changed', (f) => {
            ifNotIgnore(f, () => {
              withExitOnError(() => {
                logger.debug(`@sync - changed: ${f}`);
                copyFile(f, src, dest);
              });
            });
          });

          monitor.on('removed', (f) => {
            ifNotIgnore(f, () => {
              withExitOnError(() => {
                logger.debug(`@sync - removed: ${f}`);
                removeFile(f, src, dest);
              });
            });
          });
        });
      });
    });

    return Promise.resolve();
  };

  if (skipCopy) return watchFunc();

  return copy(src, dest).then(watchFunc);
};

export default copyAndWatch;
