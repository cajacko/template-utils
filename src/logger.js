// @flow

const logger = Object.assign({}, console);

logger.debug = console.log;

export default logger;
