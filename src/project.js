// @flow

import { readJSON } from 'fs-extra';
import { join } from 'path';
import { get as getEnv } from './env';

let projectDir = process.cwd();

export const setProjectDir = (dir) => {
  projectDir = dir;
  return Promise.resolve();
};

export const getProjectDir = () => Promise.resolve(projectDir);

export const getProjectConfig = () =>
  getProjectDir()
    .then(dir => readJSON(join(dir, 'project.json')))
    .catch(() => null);

export const getProjectEnv = env =>
  getProjectDir().then(dir => getEnv(dir, env));
