// @flow

import { getLastVersionTag } from '../git';
import ensureLocalNPMPackagePath from './ensureLocalNPMPackagePath';

const getLastLocalModuleVersion = packageName =>
  ensureLocalNPMPackagePath(packageName).then(getLastVersionTag);

export default getLastLocalModuleVersion;
