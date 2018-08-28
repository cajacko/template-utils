// @flow

import program from 'commander';

export const registerCommand = (command, callback) =>
  program.command(command).action(callback);

export const processCommands = argv => program.parse(argv);
