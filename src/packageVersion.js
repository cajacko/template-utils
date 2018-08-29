// @flow

import { join } from 'path';
import { writeJSON } from 'fs-extra';
import { getPackageJSONFromDir } from './packageJSON';
import ask from './ask';

export const askForNewPackageVersion = dir =>
  getPackageJSONFromDir(dir).then(({ version, name }) =>
    ask({
      type: 'input',
      message: `Enter the new version for ${name}. Last version: ${version}`,
      validate: () => true,
    }));

export const setPackageVersion = (dir, version) =>
  getPackageJSONFromDir(dir).then((packageJSON) => {
    const newPackageJSON = Object.assign({}, packageJSON);

    newPackageJSON.version = version;

    return writeJSON(join(dir, 'package.json'), newPackageJSON, { spaces: 2 });
  });
