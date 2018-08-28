// @flow

import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import { join } from 'path';
import { readJSON, writeJSON, ensureFile } from 'fs-extra';

const homeDir = process.env.HOME || process.env.USERPROFILE;
const settingsPath = join(homeDir, '.cajackoTemplateUtilsSettings');

let settings = {};

const getInitialSettings = ensureFile(settingsPath)
  .then(() =>
    readJSON(settingsPath).then((initialSettings) => {
      settings = initialSettings;
    }))
  .catch(() => writeJSON(settingsPath, {}, { spaces: 2 }));

const wait = callback => (...args) =>
  getInitialSettings.then(() => callback(...args));

export const get = wait((location) => {
  if (!location) return settings;

  return lodashGet(settings, location);
});

export const set = wait((value, location) => {
  if (location) {
    lodashSet(settings, location, value);
  } else {
    settings = value;
  }

  return writeJSON(settingsPath, settings, { spaces: 2 });
});
