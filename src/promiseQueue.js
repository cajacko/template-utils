// @flow

const promiseQueue = (promises) => {
  let i = 0;

  const runAllPromises = () => {
    if (!promises[i]) return Promise.resolve();

    return Promise.resolve(promises[i]()).then(() => {
      i += 1;
      return runAllPromises();
    });
  };

  return runAllPromises();
};

export default promiseQueue;
