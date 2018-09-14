// @flow

import { join } from 'path';
import { readFile } from 'fs-extra';

export const get = (dir, env) => {
  const envObj = Object.assign({}, process.env);
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
        const match = line.match(/(.*?)=(.*)/);

        if (!match) return;

        const [full, key, value] = match;

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
    .catch(() => {
      envObj.NO_ENV_FILE = true;
    })
    .then(() => envObj);
};

export const parseEnvFromJSON = (obj) => {
  let contents = '';

  Object.keys(obj).forEach((key) => {
    const val = obj[key];

    contents = `${contents}${key}=${String(val)}\n`;
  });

  return contents;
};
