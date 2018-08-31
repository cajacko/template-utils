// @flow

import simpleGit from 'simple-git/promise';
import getIsGit from 'is-git-repository';

export const isGitRepo = (dir) => {
  const isGit = getIsGit(dir);

  if (isGit) return Promise.resolve();

  return Promise.reject(new Error(`Supplied directory is not a git repo: ${dir}`));
};

export const getLastVersionTag = dir =>
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
    });

export const getAllCommitsSinceTag = (dir, tag) =>
  simpleGit(dir)
    .log({
      from: tag,
      to: 'HEAD',
    })
    // .log(`${tag}..HEAD`)
    .then(logs => logs.all);

export const commit = (dir, message) => {
  const g = simpleGit(dir);

  return g.add('-A').then(() => g.commit(message));
};

export const push = (dir, remote = 'origin') => {
  const g = simpleGit(dir);

  return g.push(remote).then(() => g.pushTags(remote));
};

export const tag = (dir, tag, message) =>
  simpleGit(dir).addAnnotatedTag(tag, message);

export const hasUncommitedChanges = dir =>
  simpleGit(dir)
    .status()
    .then(({ files }) => !!files.length);
