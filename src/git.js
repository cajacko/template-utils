// @flow

import simpleGit from 'simple-git/promise';
import getIsGit from 'is-git-repository';
import { ensureDir, exists } from 'fs-extra';

export const isGitRepo = dir =>
  exists(dir).then((doesExist) => {
    if (!doesExist) throw new Error(`Dir does not exist: ${dir}`);

    const isGit = getIsGit(dir);

    if (isGit) return Promise.resolve();

    throw new Error(`Supplied directory is not a git repo: ${dir}`);
  });

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
    .then(logs => logs.all);

export const stageAll = dir => simpleGit(dir).add('-A');

export const commit = (dir, message, addAll = true, noVerify) => {
  const g = simpleGit(dir);

  const options = {};

  if (noVerify) {
    options['--no-verify'] = true;
  }

  if (addAll) return stageAll(dir).then(() => g.commit(message, options));

  return g.commit(message, options);
};

export const push = (dir, remote = 'origin') => {
  const g = simpleGit(dir);

  return g.push(remote).then(() => g.pushTags(remote));
};

export const tag = (dir, tagName, message) =>
  simpleGit(dir).addAnnotatedTag(tagName, message);

export const hasUncommitedChanges = dir =>
  simpleGit(dir)
    .status()
    .then(({ files }) => !!files.length);

export const hasStagedChanges = dir =>
  simpleGit(dir)
    .status()
    .then(({ staged, files }) =>
      staged.length !== 0 ||
        // eslint-disable-next-line camelcase
        files.some(({ working_dir }) => working_dir.trim() === ''));

export const getOrigin = dir =>
  simpleGit(dir)
    .listRemote(['--get-url'])
    .then(data => data.trim());

export const getRootDir = dir =>
  simpleGit(dir)
    .revparse(['--show-toplevel'])
    .then(data => data.trim());

export const getCurrentBranch = dir =>
  simpleGit(dir)
    .branch()
    .then(({ current }) => current);

export const hasUnstagedChanges = dir =>
  simpleGit(dir)
    .status()
    .then(({ files }) =>
    // eslint-disable-next-line camelcase
      files.filter(({ working_dir }) => working_dir.trim() !== '').length !==
        0);

export const clone = (origin, dir) =>
  ensureDir(dir).then(() => simpleGit().clone(origin, dir));

export const pull = dir => simpleGit(dir).pull();

export const doesBranchExist = (dir, branch) =>
  simpleGit(dir)
    .branch()
    .then(({ all }) => all.includes(branch));
