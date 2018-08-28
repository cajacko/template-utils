require('babel-register');

const { registerCommand, processCommands } = require('./commands');
const linkAllNameSpacedDependencies = require('./linking/linkAllNameSpacedDependencies')
  .default;
const unlinkAllNameSpacedDependencies = require('./linking/unlinkAllNameSpacedDependencies')
  .default;
const { getProjectDir } = require('./project');

exports.processCommands = processCommands;
exports.registerCommand = registerCommand;
exports.linkAllNameSpacedDependencies = linkAllNameSpacedDependencies;
exports.getProjectDir = getProjectDir;
exports.unlinkAllNameSpacedDependencies = unlinkAllNameSpacedDependencies;
