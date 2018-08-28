// @flow

import linkEachPackageByDir from './linkEachPackageByDir';
import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';

const unlinkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ packagesToLinkByDir }) =>
    linkEachPackageByDir(packagesToLinkByDir, true));

export default unlinkAllNameSpacedDependencies;
