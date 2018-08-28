// @flow

import { readJSON } from 'fs-extra';
import { join } from 'path';

export const getPackageJSONFromDir = dir => readJSON(join(dir, 'package.json'));

export const getNamespacedPackagesFromObj = (obj, namespace) => {
  if (!obj) return {};

  const packages = [];

  Object.keys(obj).forEach((packageName) => {
    if (!packageName.startsWith(`@${namespace}`)) return;

    if (!packages.includes(packageName)) packages.push(packageName);
  });

  return packages;
};

export const getAllPackagesWithNameSpace = (
  { dependencies, devDependencies },
  namespace,
) => {
  const packages = [];

  const addTo = (obj) => {
    getNamespacedPackagesFromObj(obj, namespace).forEach((packageName) => {
      if (!packages.includes(packageName)) packages.push(packageName);
    });
  };

  addTo(dependencies);
  addTo(devDependencies);

  return packages;
};
