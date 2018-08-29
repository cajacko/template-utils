import linkAllNameSpacedDependencies from './linking/linkAllNameSpacedDependencies';
import unlinkAllNameSpacedDependencies from './linking/unlinkAllNameSpacedDependencies';
import runCommandInLocalNameSpacedModules from './runCommandInLocalNameSpacedModules';
import runCommand from './runCommand';
import { set as setSettings, get as getSettings } from './settings';

export { registerCommand, processCommands } from './commands';
export { getProjectDir, getProjectConfig, getProjectEnv } from './project';
export {
  linkAllNameSpacedDependencies,
  unlinkAllNameSpacedDependencies,
  runCommandInLocalNameSpacedModules,
  runCommand,
  setSettings,
  getSettings,
};
