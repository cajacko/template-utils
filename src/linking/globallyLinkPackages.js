// @flow

import runCommand from '../runCommand';

const globallLinkPackages = (allPackagesToLink) => {
  const linkPackageGlobally = (packageName) => {
    const packageDir = allPackagesToLink[packageName];

    return runCommand('yarn link', packageDir);
  };

  const linkGloballyPromises = [];

  Object.keys(allPackagesToLink).forEach((packageName) => {
    linkGloballyPromises.push(linkPackageGlobally(packageName));
  });

  return Promise.all(linkGloballyPromises);
};

export default globallLinkPackages;
