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
const { staff, channels } = require('../../../config/config');
const { addCurrency, removeCurrency } = require('../../../currency');

/** AddBalance */
class AddBalance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'addbalance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['addbal'];
    this.help = {
      message: 'Adds to the amount of crystals someone has',
      usage: 'addbalance <amount> <@user>',
      example: 'addbalance 50 @Velo',
      visible: false
    };
  }

  async runPreconditions(message, args, chariot, next) {
    if(config.staff.owner.includes(message.author.id)) {
      if(args.length < 2) {
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
        'You did not specify a user to add crystals for');
      return;
    }

    if(isNaN(parseInt(args[0]))) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'The amount you provided was not a number');
      return;
    }
    const db = (await database()).session;

    await addCurrency(recipient.id, Math.round(parseInt(args[0])))

    sendTransEmbed(message.channel,
      'GREEN',
      'Yay!',
      `Added <:crystal:769280106270687273>${args[0]} to <@${recipient.id}>'s balance`,
      `Request by ${message.author.username}`,
      message.author.avatarURL)
  }
}

module.exports = new AddBalance();
