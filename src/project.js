// @flow

let projectDir = process.cwd();

export const setProjectDir = (dir) => {
  projectDir = dir;
  return Promise.resolve();
};

export const getProjectDir = () => Promise.resolve(projectDir);
