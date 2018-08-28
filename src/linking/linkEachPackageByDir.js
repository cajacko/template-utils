// @flow

import runCommand from '../runCommand';

const linkEachPackageByDir = (packagesToLinkByDir, unlink = false) => {
  const linkEachPackagePromises = [];

  Object.keys(packagesToLinkByDir).forEach((packageDir) => {
    const dirPromises = [];

    const packagesToLink = packagesToLinkByDir[packageDir];

    packagesToLink.forEach((packageName) => {
      const command = unlink ? 'unlink' : 'link';

      dirPromises.push(runCommand(`yarn ${command} ${packageName}`, packageDir));
    });

    const dirPromise = Promise.all(dirPromises).then(() => {
      if (!unlink) return Promise.resolve();

      return runCommand('yarn install', packageDir);
    });

    linkEachPackagePromises.push(dirPromise);
  });

  return Promise.all(linkEachPackagePromises);
};

export default linkEachPackageByDir;
