const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');

/** Get DM channel id and send MSG to user */
module.exports = async function sendReply(channel, msg) {
  return channel.createMessage(msg);
};
