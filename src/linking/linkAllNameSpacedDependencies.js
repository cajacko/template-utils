// @flow

import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';
import linkEachPackageByDir from './linkEachPackageByDir';
import globallyLinkPackages from './globallyLinkPackages';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ allPackagesToLink, packagesToLinkByDir }) =>
    globallyLinkPackages(allPackagesToLink).then(() =>
      linkEachPackageByDir(packagesToLinkByDir)));

export default linkAllNameSpacedDependencies;
