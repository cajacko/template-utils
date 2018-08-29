// @flow

import { pathExists } from 'fs-extra';
import { get as getLocalSettings, set as setLocalSettings } from '../settings';
import {
  getPackageJSONFromDir,
  getAllPackagesWithNameSpace,
} from '../packageJSON';
import ask from '../ask';
import git from '../git';
import isDirNPMPackage from '../conditionals/isDirNPMPackage';

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
              let packagePath = allPackagesToLink[packageName];

              if (packagePath) return Promise.resolve(packagePath);

              packagePath = localNPMPackagePaths[packageName];

              let promise;

              if (packagePath) {
                promise = Promise.resolve(packagePath);
              } else {
                promise = ask({
                  type: 'path',
                  message: `Enter the absolute path to the local version of ${packageName}`,
                  validate: path =>
                    pathExists(path)
                      .then(() =>
                        Promise.all([
                          git.isGitRepo(path),
                          isDirNPMPackage(path, packageName),
                        ]))
                      .then(() => true)
                      .catch(({ message }) => message),
                }).then(newPackagePath =>
                  setLocalSettings(newPackagePath, [
                    'localNPMPackagePaths',
                    packageName,
                  ]).then(() => newPackagePath));
              }

              return promise.then((finalPackagePath) => {
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
