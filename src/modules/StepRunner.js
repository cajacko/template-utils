// @flow

import logger from '../logger';

class StepRunner {
  constructor(steps) {
    this.steps = steps;
    this.funcsByStep = {};
    this.completedSteps = [];
  }

  addToStep(step, callback) {
    if (this.completedSteps.includes(step)) {
      throw new Error(`Cannot add callback to step "${step}" as we have already completed that step`);
    }

    if (!this.funcsByStep[step]) this.funcsByStep[step] = [];

    this.funcsByStep[step].push(callback);
  }

  addAllMatchingMethodsToSteps(obj) {
    this.steps.forEach((step) => {
      if (typeof obj[step] === 'function') {
        this.addToStep(step, (...args) => obj[step](...args));
      }
    });
  }

  runSteps() {
    const loop = (i = 0) => {
      const step = this.steps[i];

      if (!step) return Promise.resolve();

      return this.runStep(step).then(() => {
        this.completedSteps.push(step);

        return loop(i + 1);
      });
    };

    return loop();
  }

  runStep(step) {
    logger.debug(`Step - ${step}`);

    const loop = (i = 0) => {
      const funcs = this.funcsByStep[step];

      if (!funcs || !funcs.length) return Promise.resolve();

      const func = funcs[i];

      if (!func) return Promise.resolve();

      return Promise.resolve(func()).then(() => loop(i + 1));
    };

    return loop();
  }
}

export default StepRunner;
