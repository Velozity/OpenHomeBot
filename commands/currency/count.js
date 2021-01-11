/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, discord, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const moment = require('moment');
const { createBalance, getBalance } = require('../../currency');

/** Balance */
class Count extends Chariot.Command {
  constructor() {
    super();

    this.name = 'count';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Shows a users available balance',
      usage: 'balance [@user]',
      example: ['balance', 'balance @Velo'],
      visible: true
    };
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    sendEmbed(message.channel,
      'BLUE',
      '',
      'Character Count: ' + args.join('').length)
  }
}

module.exports = new Count();
