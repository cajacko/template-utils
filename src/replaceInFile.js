// @flow

import { readFile, writeFile } from 'fs-extra';

/**
 * Replace the contents of a file, given a series or regex's and replacements
 *
 * @param {String} filePath The file to replace contents in
 * @param  {...Object} replacements An array of objects, each specifying a regex and replacement
 *
 * @return {Promise} Resolves when the file has been edited
 */
const replaceInFile = (filePath, ...replacements) =>
  readFile(filePath).then((contents) => {
    const originalContents = contents.toString();
    let replacedContents = originalContents;

    replacements.forEach(({ regex, replacement }) => {
      replacedContents = replacedContents.replace(regex, replacement);
    });

    if (originalContents === replacedContents) return Promise.resolve();

    return writeFile(filePath, replacedContents);
  });

export default replaceInFile;
