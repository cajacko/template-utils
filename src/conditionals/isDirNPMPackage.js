// @flow

import { getPackageJSONFromDir } from '../packageJSON';

const isDirNPMPackage = (dir, packageName) =>
  getPackageJSONFromDir(dir).then(({ name }) => {
    if (!packageName) return Promise.resolve();

    if (packageName !== name) {
      throw new Error(`Expected npm package name does not match "${packageName}" received "${name}" at ${dir}`);
    }

    return Promise.resolve();
  });

export default isDirNPMPackage;
