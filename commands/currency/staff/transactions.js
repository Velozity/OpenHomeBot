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
class Transactions extends Chariot.Command {
  constructor() {
    super();

    this.name = 'transactions';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['transinfo', 'trans'];
    this.help = {
      message: 'View transaction info on a user',
      usage: 'transactions <@user>',
      example: 'transactions @Velo',
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
        'You did not specifify a user to view transaction info on');
      return;
    }

    const db = (await database()).session;

    const transInfo = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_transactions WHERE (sender='${recipient.id}' OR receiver='${recipient.id}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if (transInfo instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not get transaction info!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const sentCount = transInfo.filter((t) => t[2] === recipient.id).length;
    const receiveCount = transInfo.filter((t) => t[3] === recipient.id && t[2] !== 'SYSTEM-DROP').length;

    sendTransEmbed(message.channel,
      'GREEN',
      `${recipient.username}'s Transactions`,
      `${sentCount > 0 ? '**Sent:**' : '**User has not sent anything.**'}
${transInfo.filter((t) => t[2] === recipient.id).map((t) => `- Sent **${t[1]}** to <@${t[3]}> (${t[3]}) @ ${moment.unix(t[4]).format('MM/DD/YYYY hh:mma')}`).join('\r\n')}

${receiveCount > 0 ? '**Received:**' : '**User has not received anything.**'}
${transInfo.filter((t) => t[3] === recipient.id && t[2] !== 'SYSTEM-DROP').map((t) => `- Received **${t[1]}** from <@${t[2]}> (${t[2]}) @ ${moment.unix(t[4]).format('MM/DD/YYYY hh:mma')}`).join('\r\n')}

**Currency received in drops:** ${transInfo.filter((t) => t[3] === recipient.id && t[2] === 'SYSTEM-DROP').map((t) => Math.round(t[1])).reduce((a, b) => a + b, 0)}
`,
      `User ID: ${recipient.id} | Request by ${message.author.username}`,
      message.author.avatarURL)
  }
}

module.exports = new Transactions();
