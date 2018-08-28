// @flow

import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';
import runCommandOnEachPackageToLink from './runCommandOnEachPackageToLink';
import globallyLinkPackages from './globallyLinkPackages';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ allPackagesToLink, packagesToLinkByDir }) =>
    globallyLinkPackages(allPackagesToLink).then(() =>
      runCommandOnEachPackageToLink(
        packagesToLinkByDir,
        packageName => `yarn link ${packageName}`,
      )));

export default linkAllNameSpacedDependencies;
