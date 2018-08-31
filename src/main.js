import linkAllNameSpacedDependencies from './linking/linkAllNameSpacedDependencies';
import unlinkAllNameSpacedDependencies from './linking/unlinkAllNameSpacedDependencies';
import runCommandInLocalNameSpacedModules from './runCommandInLocalNameSpacedModules';
import runCommand from './runCommand';
import { set as setSettings, get as getSettings } from './settings';
import getShouldUpdatePackage from './getShouldUpdatePackage';
import * as git from './git';
import logger from './logger';
import StepRunner from './modules/StepRunner';
import QueuedFileManagement from './modules/QueuedFileManagement';
import QueuedNPMManager from './modules/QueuedNPMManager';
import orderObj from './orderObj';
import copyTmpl from './copyTmpl';
import copyDependencies from './copyDependencies';
import copyAndWatch from './copyAndWatch';

export { setPackageVersion, askForNewPackageVersion } from './packageVersion';
export { registerCommand, processCommands } from './commands';
export { getProjectDir, getProjectConfig, getProjectEnv } from './project';

export {
  copyDependencies,
  copyAndWatch,
  copyTmpl,
  orderObj,
  linkAllNameSpacedDependencies,
  unlinkAllNameSpacedDependencies,
  runCommandInLocalNameSpacedModules,
  runCommand,
  setSettings,
  getSettings,
  getShouldUpdatePackage,
  git,
  logger,
  StepRunner,
  QueuedFileManagement,
  QueuedNPMManager,
};
