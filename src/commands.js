// @flow

import program from 'commander';

export const registerCommand = (command, callback, { options } = {}) => {
  const programCommand = program.command(command);

  if (options) {
    options.forEach((option) => {
      programCommand.option(...option);
    });
  }

  return programCommand.action((...args) =>
    callback(...args).catch((e) => {
      console.error(e);
      process.exit(1);
    }));
};

export const processCommands = argv => program.parse(argv);
