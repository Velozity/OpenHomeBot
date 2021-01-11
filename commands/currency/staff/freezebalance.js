/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, discord, config
} = require('../../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../../utils');
const moment = require('moment');
const { freezeBalance } = require('../../../currency');

/** FreezeBalance */
class FreezeBalance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'freezebalance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['freezebal', 'lockbal', 'freezeacc'];
    this.help = {
      message: 'Freezes the amount of crystals someone has',
      usage: 'freezebal <@user>',
      example: 'freezebal @Velo',
      visible: false
    };
  }

  async runPreconditions(message, args, chariot, next) {
    if(config.staff.owner.includes(message.author.id) || config.staff.admin.includes(message.author.id)) {
      if(args.length < 1) {
        sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You are missing some fields for this action');
        return;
      }

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
    let recipient = message.mentions[0]

    if(typeof(recipient) === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You did not specifify a user to freeze');
      return;
    }

    const result = await freezeBalance(recipient.id);

    if(result)
      sendTransEmbed(message.channel,
        'GREEN',
        'Success',
        `<@${recipient.id}>'s account has been frozen`,
        `Request by ${message.author.username}`,
        message.author.avatarURL)
    else
      sendTransEmbed(message.channel,
        'RED',
        'Error',
        `<@${recipient.id}>'s account could not be frozen, try again?`,
        `Request by ${message.author.username}`,
        message.author.avatarURL)
  }
}

module.exports = new FreezeBalance();
