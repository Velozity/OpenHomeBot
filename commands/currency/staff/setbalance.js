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
const { staff } = require('../../../config/config');

/** SetCrystals */
class SetBalance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'setbalance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['setbal'];
    this.help = {
      message: 'Sets the amount of crystals someone has',
      usage: 'setbalance <@user> <amount>',
      example: 'setbalance @Velo 50',
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
        'You did not specify a user to set crystals for');
      return;
    }

    if(isNaN(parseInt(args[1]))) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'The amount you provided was not a number');
      return;
    }
    const db = (await database()).session;

    // Create bank if not exists
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${recipient.id}', '${config.currency.startAmount}', '0');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    const setBalance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_bank SET balance = ${args[1]} WHERE (discord_id='${recipient.id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    db.close();
    if (setBalance instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not set this users balance!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `Set <@${recipient.id}>'s balance to <:crystal:769280106270687273>${args[1]}`,
      `Request by ${message.author.username}`,
      message.author.avatarURL)
  }
}

module.exports = new SetBalance();
