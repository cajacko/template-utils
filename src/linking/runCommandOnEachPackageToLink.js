// @flow

import runCommand from '../runCommand';

const runCommandOnEachPackageToLink = (packagesToLinkByDir, getCommand) => {
  const linkEachPackagePromises = [];

  Object.keys(packagesToLinkByDir).forEach((packageDir) => {
    const packagesToLink = packagesToLinkByDir[packageDir];

    packagesToLink.forEach((packageName) => {
      linkEachPackagePromises.push(runCommand(getCommand(packageName), packageDir));
    });
  });

  return Promise.all(linkEachPackagePromises);
};

export default runCommandOnEachPackageToLink;
