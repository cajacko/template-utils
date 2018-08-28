// @flow

import { pathExists } from 'fs-extra';
import { get as getLocalSettings, set as setLocalSettings } from '../settings';
import {
  getPackageJSONFromDir,
  getAllPackagesWithNameSpace,
} from '../packageJSON';
import ask from '../ask';
import { isGitRepo } from '../git';
import runCommand from '../runCommand';
import isDirNPMPackage from '../conditionals/isDirNPMPackage';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) => {
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
                          isGitRepo(path),
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
    .then((allPackagesToLink) => {
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
};

export default linkAllNameSpacedDependencies;
