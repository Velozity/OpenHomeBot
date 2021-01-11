/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database,
  discord
} = require('../config');
const { sendEmbed, sendReply } = require('../utils');

/** Crisis */
class Test extends Chariot.Command {
  constructor() {
    super();

    this.name = 'test';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'test',
      usage: 'test',
      example: ['test'],
      visible: false
    };
    this.allowedUsers = ['224379198255529984']
  }

  /**
      * Precondition testing method. This method will run BEFORE the main command logic.
      * Once every test passed, next() MUST be called, in order to run the main command logic!
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      * @param {Function} next Marking testing as done, invoking the main command executor
      */
  async runPreconditions(message, args, chariot, next) {
    if(this.allowedUsers.includes(message.author.id))
        next();
    else
        return;
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    let membersCount = message.guild.memberCount;

    sendEmbed(message.channel,
        'RANDOM',
        '🎉 Milestone Reached',
        `Thank you for **${membersCount} Members!!**`,
        null,
        '',
        null,
        new Date().toISOString(),
        message.guild.iconURL)

    message.delete();
  }
}

module.exports = new Test();
