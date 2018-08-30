// @flow

import promiseQueue from '../promiseQueue';
import runCommand from '../runCommand';

class QueuedNPMManager {
  constructor(destPath) {
    this.nodeModules = {};
    this.destPath = destPath;

    this.add = this.add.bind(this);
    this.install = this.install.bind(this);
  }

  install() {
    const nodeModulesCommands = {};

    Object.keys(this.nodeModules).forEach((key) => {
      const { type, version } = this.nodeModules[key];
      const finalType = type || 'dependency';

      if (!nodeModulesCommands[finalType]) nodeModulesCommands[finalType] = '';

      nodeModulesCommands[finalType] = `${
        nodeModulesCommands[finalType]
      } ${key}@${version}`;
    });

    const promises = [];

    Object.keys(nodeModulesCommands).forEach((key) => {
      let command = 'yarn add';

      if (key !== 'dependency') command = `${command} --${key}`;

      command = `${command} ${nodeModulesCommands[key]}`;

      promises.push(() => runCommand(command, this.destPath));
    });

    return promiseQueue(promises);
  }

  add(nodeModules) {
    this.nodeModules = { ...nodeModules, ...this.nodeModules };
  }
}

export default QueuedNPMManager;
