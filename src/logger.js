// @flow

import chalk from 'chalk';

export class Logger {
  constructor() {
    this.levels = {
      debug: { color: chalk.gray, consoleFunc: console.log },
      log: { color: chalk.green, consoleFunc: console.log },
      warn: { color: chalk.yellow, consoleFunc: console.warn },
      error: { color: chalk.red, consoleFunc: console.error },
    };

    this.levels.info = this.levels.log;

    this._console = this._console.bind(this);

    const transports = [this._console];

    Object.keys(this.levels).forEach((level) => {
      this[level] = (message, data, options) => {
        transports.forEach((transport) => {
          transport(level, message, data, options);
        });
      };
    });
  }

  _console(level, message, data, options) {
    if (message === undefined && data === undefined) return;

    const { consoleFunc, color } = this.levels[level];

    let finalMessage = message;
    let finalData = data;

    if (message instanceof Error) {
      finalMessage = message.stack;
    } else if (typeof message === 'object') {
      finalMessage = 'Data';
      finalData = data === undefined ? message : [message, data];
    }

    const formattedMessage = color(`@CJ ${finalMessage}`);

    if (options && options.stdout) {
      process.stdout.write(formattedMessage);
      if (finalData !== undefined) consoleFunc(finalData);
    } else {
      const args = [formattedMessage];
      if (finalData !== undefined) args.push(finalData);
      consoleFunc(...args);
    }
  }
}

const logger = new Logger();

export default logger;
