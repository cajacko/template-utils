// @flow

import getIsGit from 'is-git-repository';

const git = {
  isGitRepo: (dir) => {
    const isGit = getIsGit(dir);

    if (isGit) return Promise.resolve();

    return Promise.reject(new Error(`Supplied directory is not a git repo: ${dir}`));
  },
  getLastVersionTag: dir => Promise.resolve('v1.0.0'),
  getAllCommitsSinceTag: (dir, tag) => Promise.resolve([{}]),
  commit: (dir, message) => Promise.resolve(),
  push: dir => Promise.resolve(),
  tag: (dir, tag, message) => Promise.resolve(),
};

export default git;
