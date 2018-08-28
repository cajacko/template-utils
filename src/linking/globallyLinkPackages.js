// @flow

import runCommand from '../runCommand';

const globallLinkPackages = (allPackagesToLink, unlink = false) => {
  const linkPackageGlobally = (packageName) => {
    const packageDir = allPackagesToLink[packageName];

    const command = unlink ? 'yarn unlink' : 'yarn link';

    return runCommand(command, packageDir);
  };

  const linkGloballyPromises = [];

  Object.keys(allPackagesToLink).forEach((packageName) => {
    linkGloballyPromises.push(linkPackageGlobally(packageName));
  });

  return Promise.all(linkGloballyPromises);
};

export default globallLinkPackages;
