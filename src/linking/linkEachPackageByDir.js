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
      if (unlink) {
        return runCommand('yarn install', packageDir, { noLog: true });
      }

      return Promise.resolve();
    });

    linkEachPackagePromises.push(dirPromise);
  });

  return Promise.all(linkEachPackagePromises);
};

export default linkEachPackageByDir;
