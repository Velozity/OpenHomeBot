/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  redis, config, logger, database,
} = require('../../config');
const { sendEmbed, sendReply } = require('../../utils');
const crisisData = require('../../utils/crisisDatabase');
const fs = require('fs');
const moment = require('moment');

/** QOTD */
class Qotd extends Chariot.Command {
  constructor() {
    super();

    this.name = 'qotd';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['question'];
    this.help = {
      message: 'Creates a new question of the day',
      usage: 'qotd <question>',
      example: ['qotd What is your favorite color?'],
      visible: false
    };
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
    if(message.member.roles.includes('768753471704006656'))
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
    if(args.length === 0) {
      const msg = await sendEmbed(message.channel,
        'RED',
        'Error',
        `You must specify a question`,
        null,
        'This message will be deleted in 5 seconds');
      
      setTimeout(() => {
        msg.delete();
      }, 5000)
      message.delete();
      return;
    }

    const date = moment(Date.now()).format('L');

    await message.channel.createMessage('<@&768757706068197407>');
    const qotd = await sendEmbed(message.channel,
      'RANDOM',
      `Question of The Day`,
      `_${args.join(' ')}_`,
      null,
      `Question by ${message.member.username}`,
      '',
      new Date().toISOString())

      qotd.pin();
      message.delete();
  }
}

module.exports = new Qotd();
