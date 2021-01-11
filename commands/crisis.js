/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  redis, config, logger, database,
} = require('../config');
const { sendTransEmbed, sendEmbed, sendReply, crisisData } = require('../utils');
const fs = require('fs');

/** Crisis */
class Crisis extends Chariot.Command {
  constructor() {
    super();

    this.name = 'crisis';
    this.allowDMs = true;
    this.cooldown = 5;
    this.aliases = ['hotlines', 'ci'];
    this.help = {
      message: 'Resources for crisis/suicide hotlines',
      usage: 'crisis',
      example: ['crisis'],
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
    next();
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    if(args.length === 0) {
      await sendEmbed(message.channel,
        'RED',
        'Crisis Information',
        `You can find crisis information based on country by providing a country name or country code with this command.
        
[View crisis information and hotlines worldwide](https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines)`);
      return;
    }

    const data = crisisData(args.join(' '))

    if(data.country === undefined) {
      await sendEmbed(message.channel,
        'RED',
        'Error',
        data.text);
      return;
    }

    await sendEmbed(message.channel,
      'RED',
      'Crisis Information for ' + data.country.split(',')[0].replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
      data.text);
  }
}

module.exports = new Crisis();
