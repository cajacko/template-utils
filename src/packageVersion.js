// @flow

import { join } from 'path';
import { writeJSON } from 'fs-extra';
import semver from 'semver';
import { getPackageJSONFromDir } from './packageJSON';
import ask from './ask';

export const askForNewPackageVersion = dir =>
  getPackageJSONFromDir(dir).then(({ version, name }) =>
    ask({
      type: 'input',
      message: `Enter the new version for ${name}. Last version: ${version}`,
      validate: (input) => {
        if (!semver.valid(input)) return 'Value is not a valid semver';

        if (version === input || semver.gt(version, input)) {
          return 'New version must be higher than the previous';
        }

        return true;
      },
    }));

export const setPackageVersion = (dir, version) =>
  getPackageJSONFromDir(dir).then((packageJSON) => {
    const newPackageJSON = Object.assign({}, packageJSON);

    newPackageJSON.version = version;

    return writeJSON(join(dir, 'package.json'), newPackageJSON, { spaces: 2 });
  });
