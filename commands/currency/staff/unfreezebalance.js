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

/** UnfreezeBalance */
class UnfreezeBalance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'unfreezebalance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['unfreezebal', 'unlockbal', 'unfreezeacc'];
    this.help = {
      message: 'Unfreezes a users account',
      usage: 'unfreezebal <@user>',
      example: 'unfreezebal @Velo',
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
        'You did not specifify a user to unfreeze');
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

    const freeze = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_bank SET frozen = 0 WHERE (discord_id='${recipient.id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    db.close();
    if (freeze instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not unfreeze this users balance!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Yay!',
      `<@${recipient.id}>'s account has been unfrozen`,
      `Request by ${message.author.username}`,
      message.author.avatarURL)
  }
}

module.exports = new UnfreezeBalance();
