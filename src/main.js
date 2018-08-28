require('babel-register');

const { registerCommand } = require('./commands');
const linkAllNameSpacedDependencies = require('./linking/linkAllNameSpacedDependencies')
  .default;
const unlinkAllNameSpacedDependencies = require('./linking/unlinkAllNameSpacedDependencies')
  .default;
const { getProjectDir } = require('./project');

exports.registerCommand = registerCommand;
exports.linkAllNameSpacedDependencies = linkAllNameSpacedDependencies;
exports.getProjectDir = getProjectDir;
exports.unlinkAllNameSpacedDependencies = unlinkAllNameSpacedDependencies;
