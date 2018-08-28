// @flow

import getIsGit from 'is-git-repository';

export const isGitRepo = (dir) => {
  const isGit = getIsGit(dir);

  if (isGit) return Promise.resolve();

  return Promise.reject(new Error(`Supplied directory is not a git repo: ${dir}`));
};
