const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');

/** Get DM channel id and send MSG to user */
module.exports = function restrictedChannel(channelId) {
  var channelIds = [
    '717163162029523064', 
    '717448444180037642',
    '744529715880001547',

    '761084574490034177',
    '761084574490034179'
  ];

  return channelIds.includes(channelId);
};
