// @flow

import { join } from 'path';
import { tmpdir } from 'os';
import {
  copy,
  readJSON,
  writeJSON,
  writeFile,
  remove,
  readFile,
} from 'fs-extra';
import * as git from '../git';

class CertStorage {
  constructor(key: string, gitPath: string, subKey, opts) {
    this.opts = opts || {};
    this.key = key;
    this.gitPath = gitPath;
    this.subKey = subKey;
    this.subs = {};
    this.certs = {};
    this.gitDir = join(tmpdir(), '@cajacko/template/CertStorage', key);
    this.certValuesPath = join(this.gitDir, 'values.json');

    this.git = {
      commit: message => git.commit(this.gitDir, message, true),
      pull: () =>
        git
          .doesBranchExist(this.gitDir, 'master')
          .then(branchExists => branchExists && git.pull(this.gitDir)),
      push: () => git.push(this.gitDir),
    };

    this.commit = this.commit.bind(this);
  }

  registerSub(key) {
    this.subs[key] = new CertStorage(this.key, this.gitPath, key, this.opts);

    return this.subs[key];
  }

  add(...certs) {
    certs.forEach(({ key, ...cert }) => {
      this.certs[key] = { key, ...cert };
    });

    return Promise.resolve();
  }

  get(getKey, preventDelete) {
    return this.ensureRepo()
      .then(() => this.git.pull())
      .then(() => readJSON(this.certValuesPath))
      .then((data) => {
        const finalData = {};

        const promises = [];

        Object.keys(data).forEach((key) => {
          const { value, path } = data[key];

          if (path) {
            promises.push(readFile(join(this.gitDir, path)).then(contents => ({
              key,
              value: contents,
            })));
          } else {
            finalData[key] = value;
          }
        });

        return Promise.all(promises).then((certs) => {
          certs.forEach(({ key, value }) => {
            finalData[key] = value;
          });

          return finalData;
        });
      })
      .then(data => this.deleteLocalRepo(preventDelete).then(() => data))
      .then((data) => {
        if (getKey) return data[getKey];

        return data;
      });
  }

  commit(preventDelete) {
    const subKeys = Object.keys(this.subs);

    const loop = (i = 0) => {
      const subKey = subKeys[i];

      if (!subKey) return Promise.resolve();

      return this.subs[subKey].commit().then(() => loop(i + 1));
    };

    return loop().then(() =>
      this.ensureRepo()
        .then(() => this.git.pull())
        .then(() => this.copyCerts())
        .then(() => this.git.commit('Updated certs'))
        .then(() => this.git.push())
        .then(() => this.deleteLocalRepo(preventDelete)));
  }

  ensureRepo() {
    return git.isGitRepo(this.gitDir).catch(() =>
      git.clone(this.gitPath, this.gitDir).catch(() => {
        throw new Error(`Could not clone repo at:\n${
          this.gitPath
        }\nEnsure you have created a PRIVATE repo there`);
      }));
  }

  copyCerts() {
    const promises = [];
    const newVals = {};

    Object.values(this.certs).forEach(({
      key, title, value, filePath,
    }) => {
      if (filePath) {
        promises.push(copy(filePath, this.getCertFile(key)));

        newVals[key] = {
          title,
          path: `certs/${key}.txt`,
        };
      } else {
        newVals[key] = {
          title,
          value,
        };
      }
    });

    promises.push(readJSON(this.certValuesPath)
      .catch(() => null)
      .then((values) => {
        const finalVals = Object.assign({}, values || {}, newVals);

        let readme = `# Certificates and secrets for ${this.key}\n\n`;

        Object.keys(finalVals).forEach((key) => {
          const { title, value, path } = finalVals[key];

          if (title) {
            readme = `${readme}## ${title}\n`;
          }

          readme = `${readme}key: \`${key}\`\n\n`;

          if (path) {
            readme = `${readme}path: \`${path}\`\n`;
          } else {
            readme = `${readme}value:\n\`\`\`\n${value}\n\`\`\``;
          }

          readme = `${readme}\n---\n`;
        });

        return Promise.all([
          writeJSON(this.certValuesPath, finalVals, { spaces: 2 }),
          writeFile(join(this.gitDir, 'README.md'), readme),
          writeFile(join(this.gitDir, '.gitignore'), '.DS_Store'),
        ]);
      }));

    return Promise.all(promises);
  }

  deleteLocalRepo(preventDelete) {
    if (preventDelete === true) return Promise.resolve();

    if (preventDelete !== false && this.opts.preventDelete) {
      return Promise.resolve();
    }

    return remove(this.gitDir);
  }

  getCertFile(key) {
    return join(this.gitDir, 'certs', `${key}.txt`);
  }
}

export default CertStorage;
