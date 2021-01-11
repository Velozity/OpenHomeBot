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

/** RemoveBalance */
class RemoveBalance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'removebalance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['removebal'];
    this.help = {
      message: 'Subtracts from the amount of crystals someone has',
      usage: 'removebalance <amount> <@user>',
      example: 'removebalance 50 @Velo',
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
        'You did not specify a user to subtract crystals for');
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
    .sql(`UPDATE openhome.currency_bank SET balance = balance - ${args[0]} WHERE (discord_id='${recipient.id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    db.close();
    if (setBalance instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not subtract from this users balance!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `Removed <:crystal:769280106270687273>${args[0]} from <@${recipient.id}>'s balance`,
      `Request by ${message.author.username}`,
      message.author.avatarURL)
  }
}

module.exports = new RemoveBalance();
