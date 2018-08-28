// @flow

import runCommandOnEachPackageToLink from './runCommandOnEachPackageToLink';
import getAllNameSpacedPackagesToLink from './getAllNameSpacedPackagesToLink';

const linkAllNameSpacedDependencies = (nameSpace, startingDir) =>
  getAllNameSpacedPackagesToLink(nameSpace, startingDir).then(({ packagesToLinkByDir }) =>
    runCommandOnEachPackageToLink(
      packagesToLinkByDir,
      packageName => `yarn unlink ${packageName}`,
    ));

export default linkAllNameSpacedDependencies;
