require('babel-register');

const { registerCommand } = require('./commands');
const linkAllNameSpacedDependencies = require('./linking/linkAllNameSpacedDependencies')
  .default;

exports.registerCommand = registerCommand;
exports.linkAllNameSpacedDependencies = linkAllNameSpacedDependencies;
