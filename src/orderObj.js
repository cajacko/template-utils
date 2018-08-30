// @flow

const orderObj = (obj, priority = [], endPriority = []) => {
  if (!priority || !priority.length) return obj;

  const newObj = {};

  Object.keys(obj)
    .sort((a, b) => {
      const aInPriority = priority.includes(a);
      const bInPriority = priority.includes(b);
      const aInEndPriority = endPriority.includes(a);
      const bInEndPriority = endPriority.includes(b);

      if (aInPriority && !bInPriority) return -1;
      if (bInPriority && !aInPriority) return 1;
      if (aInEndPriority && !bInEndPriority) return 1;
      if (!aInEndPriority && bInEndPriority) return -1;

      if (aInPriority && bInPriority) {
        return priority.indexOf(a) - priority.indexOf(b);
      }

      if (aInEndPriority && bInEndPriority) {
        return endPriority.indexOf(b) - endPriority.indexOf(a);
      }

      return 0;
    })
    .forEach((key) => {
      newObj[key] = obj[key];
    });

  return newObj;
};

export default orderObj;
