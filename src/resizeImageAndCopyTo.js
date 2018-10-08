// @flow

import Jimp from 'jimp';

/**
 * Given an image, resize it multiple times and set somewhere
 *
 * @return {Promise} Resolves when the resizes have been saved
 */
const resizeImageAndCopyTo = (importPath: string, ...resizes) =>
  Jimp.read(importPath).then((image) => {
    const promises = [];

    resizes.forEach(({ height, width, outPath }) => {
      const promise = new Promise((resolve, reject) =>
        image
          .clone()
          .cover(height, width)
          .write(outPath, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }));

      promises.push(promise);
    });

    return Promise.all(promises);
  });

export default resizeImageAndCopyTo;
