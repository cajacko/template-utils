// @flow

import simpleGit from 'simple-git/promise';
import getIsGit from 'is-git-repository';

const git = {
  isGitRepo: (dir) => {
    const isGit = getIsGit(dir);

    if (isGit) return Promise.resolve();

    return Promise.reject(new Error(`Supplied directory is not a git repo: ${dir}`));
  },
  getLastVersionTag: dir =>
    simpleGit(dir)
      .tags()
      .then((tags) => {
        const lastVersionTag = tags.all
          .reverse()
          .find(tag => !!tag.match(/v[0-9]+\.[0-9]+\.[0-9]+/));

        if (!lastVersionTag) {
          throw new Error(`Could not find the latest version tag in ${dir}`);
        }

        return lastVersionTag;
      }),
  getAllCommitsSinceTag: (dir, tag) =>
    simpleGit(dir)
      .log({
        from: tag,
        to: 'HEAD',
      })
      // .log(`${tag}..HEAD`)
      .then(logs => logs.all),
  commit: (dir, message) => Promise.resolve(),
  push: dir => Promise.resolve(),
  tag: (dir, tag, message) => Promise.resolve(),
};

export default git;
