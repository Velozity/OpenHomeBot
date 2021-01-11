/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const ReactionHandler = require('eris-reactions');
const GraphemeSplitter = require('grapheme-splitter');
var splitter = new GraphemeSplitter();

/** Poll */
class Poll extends Chariot.Command {
  constructor() {
    super();

    this.name = 'poll';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Create a new poll',
      usage: 'test',
      example: 'poll "<question>" <emoji 1> [emoji 2] etc...',
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
    if(config.staff.owner.includes(message.author.id) || config.staff.admin.includes(message.author.id)) {
      next();
    }
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    if(args.join(' ').split('').filter((s) => s === '"').length !== 2) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'The question must be surrounded by quotes (")')
      return;
    }

    const question = message.content.substring(6).match(/"(.*?)"/g)[0].replace('"', '').replace('"', '');
    let emojis = splitter.splitGraphemes(args.join(' ').replace(`"${question}"`, '').trim().replace(/ /g,''));
    if(emojis.length === 0) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'You didn\'t provide any emojis to add to the poll')
      return;
    }
    
    const msg = await sendEmbed(message.channel,
        'RANDOM',
        'New Poll',
        question,
        null,
        '',
        null,
        new Date().toISOString())

    await emojis.forEach(async (emoji) => {
      await msg.addReaction(emoji).catch((e) => {emojis = []});
    });

    message.delete();
  }
}

module.exports = new Poll();
