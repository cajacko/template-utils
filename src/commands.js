// @flow

import program from 'commander';

export const registerCommand = (
  command,
  callback,
  { options } = {},
  errorCallback,
) => {
  const programCommand = program.command(command);

  if (options) {
    options.forEach((option) => {
      programCommand.option(...option);
    });
  }

  return programCommand.action((...args) =>
    callback(...args).catch((e) => {
      if (errorCallback) return errorCallback(e);

      throw e;
    }));
};

export const processCommands = argv => program.parse(argv);
