// @flow

import runCommand from '../runCommand';
import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ packagesToLinkByDir }) => {
    const linkEachPackagePromises = [];

    Object.keys(packagesToLinkByDir).forEach((packageDir) => {
      const packagesToLink = packagesToLinkByDir[packageDir];

      packagesToLink.forEach((packageName) => {
        linkEachPackagePromises.push(runCommand(`yarn unlink ${packageName}`, packageDir));
      });
    });

    return Promise.all(linkEachPackagePromises);
  });

export default linkAllNameSpacedDependencies;
