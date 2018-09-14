// @flow

import program from 'commander';

export const registerCommand = (command, callback, { options } = {}) => {
  const programCommand = program.command(command);

  if (options) {
    options.forEach((option) => {
      programCommand.option(...option);
    });
  }

  return programCommand.action((...args) => callback(...args));
};

export const processCommands = argv => program.parse(argv);
