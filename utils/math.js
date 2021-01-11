const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const { config } = require('../config')

function levelToXP(level) {
    return Math.round(Math.pow(((level) / config.currency.xpLevelConstant1), config.currency.xpLevelConstant2))
};
  
module.exports = {
    levelToXP
}
