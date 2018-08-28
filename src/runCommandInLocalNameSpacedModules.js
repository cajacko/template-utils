// @flow

import runCommand from './runCommand';
import getAllNameSpacedPackagesToLink from './linking/getAllNameSpacedPackagesToLink';

const runCommandInLocalNameSpacedModules = (nameSpace, startingDir, command) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ allPackagesToLink }) => {
    const promises = [];

    Object.values(allPackagesToLink).forEach((dir) => {
      promises.push(runCommand(command, dir));
    });

    return Promise.all(promises);
  });

export default runCommandInLocalNameSpacedModules;
