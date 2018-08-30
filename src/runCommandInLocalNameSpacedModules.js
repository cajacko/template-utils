// @flow

import runCommand from './runCommand';
import getAllNameSpacedPackagesToLink from './linking/getAllNameSpacedPackagesToLink';
import { get } from './settings';

const runCommandInLocalNameSpacedModules = (
  nameSpace,
  startingDir,
  command,
  opts,
  onlyGetPathsFromSettings,
) => {
  const getLocalNPMPackagePaths = () => get(['localNPMPackagePaths']).then(allPackagesToLink => ({
    allPackagesToLink,
  }));

  const promise = onlyGetPathsFromSettings
    ? getLocalNPMPackagePaths()
    : getAllNameSpacedPackagesToLink(nameSpace, startingDir);

  return promise.then(({ allPackagesToLink }) => {
    const promises = [];

    Object.values(allPackagesToLink).forEach((dir) => {
      promises.push(runCommand(command, dir, opts));
    });

    return Promise.all(promises);
  });
};

export default runCommandInLocalNameSpacedModules;
