/* eslint-disable global-require */

module.exports = {
  config: require('./config'), // MUST HAVE A DIFFERENT PRODUCTION CONFIG
  logger: require('./winston'),
  //redis: require('./redis'),
  discord: require('./discord'),
  //bv: require('./bvAPI'),
  database: require('./database'),
};
