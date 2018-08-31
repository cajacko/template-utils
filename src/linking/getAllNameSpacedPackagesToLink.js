// @flow

import { get as getLocalSettings } from '../settings';
import {
  getPackageJSONFromDir,
  getAllPackagesWithNameSpace,
} from '../packageJSON';
import ensureLocalNPMPackagePath from './ensureLocalNPMPackagePath';

const getAllNameSpacedPackagesToLink = (nameSpace, startingDir) => {
  const packagesToLinkByDir = {};

  return getLocalSettings('localNPMPackagePaths')
    .then((localNPMPackagePathsArg) => {
      const localNPMPackagePaths = localNPMPackagePathsArg || {};
      const allPackagesToLink = {};
      const addedLinkPackagesFrom = [];

      const addPackagesToLinkFromDir = dir =>
        getPackageJSONFromDir(dir)
          .then(packageJSON =>
            getAllPackagesWithNameSpace(packageJSON, nameSpace))
          .then((packagesToLink) => {
            packagesToLinkByDir[dir] = packagesToLink;

            const getPackageToLinkPath = (packageName) => {
              const packagePath = allPackagesToLink[packageName];

              if (packagePath) return Promise.resolve(packagePath);

              return ensureLocalNPMPackagePath(
                packageName,
                localNPMPackagePaths,
              ).then((finalPackagePath) => {
                allPackagesToLink[packageName] = finalPackagePath;
              });
            };

            const loop = (i = 0) => {
              const packageName = packagesToLink[i];

              if (!packageName) return Promise.resolve();

              return getPackageToLinkPath(packageName).then(() => loop(i + 1));
            };

            return loop();
          })
          .then(() => {
            addedLinkPackagesFrom.push(dir);

            const nextDirToAdd = Object.values(allPackagesToLink).find((packageDir) => {
              if (addedLinkPackagesFrom.includes(packageDir)) return false;

              return true;
            });

            if (!nextDirToAdd) return Promise.resolve();

            return addPackagesToLinkFromDir(nextDirToAdd);
          });

      return addPackagesToLinkFromDir(startingDir).then(() => allPackagesToLink);
    })
    .then(allPackagesToLink => ({
      allPackagesToLink,
      packagesToLinkByDir,
    }));
};

export default getAllNameSpacedPackagesToLink;
