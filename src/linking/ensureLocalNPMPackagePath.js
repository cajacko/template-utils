// @flow

import { pathExists } from 'fs-extra';
import { get as getLocalSettings, set as setLocalSettings } from '../settings';
import ask from '../ask';
import { isGitRepo } from '../git';
import isDirNPMPackage from '../conditionals/isDirNPMPackage';

const askForPath = packageName =>
  ask({
    type: 'path',
    message: `Enter the absolute path to the local version of ${packageName}`,
    validate: path =>
      pathExists(path)
        .then(() =>
          Promise.all([isGitRepo(path), isDirNPMPackage(path, packageName)]))
        .then(() => true)
        .catch(({ message }) => message),
  }).then(newPackagePath =>
    setLocalSettings(newPackagePath, [
      'localNPMPackagePaths',
      packageName,
    ]).then(() => newPackagePath));

const ensureLocalNPMPackagePath = (packageName, localNPMPackagePaths) => {
  if (localNPMPackagePaths) {
    const path = localNPMPackagePaths[packageName];

    if (path) return Promise.resolve(path);

    return askForPath(packageName);
  }

  return getLocalSettings('localNPMPackagePaths').then((localNPMPackagePathsArg) => {
    if (!localNPMPackagePathsArg) return askForPath(packageName);

    const path = localNPMPackagePathsArg[packageName];

    if (!path) return askForPath(packageName);

    return path;
  });
};

export default ensureLocalNPMPackagePath;
