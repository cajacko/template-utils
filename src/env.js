// @flow

import { join } from 'path';
import { readFile } from 'fs-extra';

export const get = (dir, env) => {
  const envObj = {};
  let envFile;

  switch (env) {
    case 'production':
      envFile = join(dir, '.env.production');
      break;
    default:
      envFile = join(dir, '.env.local');
      break;
  }

  return readFile(envFile)
    .then((contents) => {
      const envContents = contents.toString();
      const lines = envContents.split('\n');

      lines.forEach((line) => {
        const [full, key, value] = line.match(/(.*?)=(.*)/);

        switch (value) {
          case 'true':
            envObj[key] = true;
            break;
          case 'false':
            envObj[key] = false;
            break;
          default:
            envObj[key] = value;
            break;
        }
      });

      return envObj;
    })
    .catch(() => ({ NO_ENV_FILE: true, ...envObj }));
};
