// @flow

import git from './git';

const getShouldUpdatePackage = dir =>
  git
    .getLastVersionTag(dir)
    .then(tag => git.getAllCommitsSinceTag(dir, tag))
    .then(commits => !!commits.length);

export default getShouldUpdatePackage;
