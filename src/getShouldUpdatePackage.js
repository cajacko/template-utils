// @flow

import { getLastVersionTag, getAllCommitsSinceTag } from './git';

const getShouldUpdatePackage = dir =>
  getLastVersionTag(dir)
    .then(tag => getAllCommitsSinceTag(dir, tag))
    .then(commits => !!commits.length);

export default getShouldUpdatePackage;
