// @flow

import runCommand from '../runCommand';
import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ allPackagesToLink, packagesToLinkByDir }) => {
    const linkPackageGlobally = (packageName) => {
      const packageDir = allPackagesToLink[packageName];

      return runCommand('yarn link', packageDir);
    };

    const linkGloballyPromises = [];

    Object.keys(allPackagesToLink).forEach((packageName) => {
      linkGloballyPromises.push(linkPackageGlobally(packageName));
    });

    return Promise.all(linkGloballyPromises).then(() => {
      const linkEachPackagePromises = [];

      Object.keys(packagesToLinkByDir).forEach((packageDir) => {
        const packagesToLink = packagesToLinkByDir[packageDir];

        packagesToLink.forEach((packageName) => {
          linkEachPackagePromises.push(runCommand(`yarn link ${packageName}`, packageDir));
        });
      });

      return Promise.all(linkEachPackagePromises);
    });
  });

export default linkAllNameSpacedDependencies;
