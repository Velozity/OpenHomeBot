/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const {
  database, discord, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const moment = require('moment');
const { channels } = require('../../config/config');
const { getShopItems } = require('../../currency')
/** Economy */
class Economy extends Chariot.Command {
  constructor() {
    super();

    this.name = 'economy';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['eco', 'stats', 'leaderboard'];
    this.help = {
      message: 'View Crystals economy information',
      usage: 'economy',
      example: 'economy',
      visible: true
    };
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const db = (await database()).session;

    const balances = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_bank WHERE frozen='0' ORDER BY balance DESC LIMIT 10;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if(balances instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We were unable to retrieve balances`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const inventoryCount = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT COUNT(*) FROM openhome.currency_ownedpets;`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if (inventoryCount instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Users pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const inventoryLeaders = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets ORDER BY level DESC, xp DESC LIMIT 10;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if (inventoryLeaders instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Users pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }
    
    let count = 1;
    let count2 = 1;
    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('BLUE')
    .setTitle(`Open Home | Pets Statistics`)
    .addField('📈 Economy', `<:crystal:769280106270687273>${balances.map((b) => b[1]).reduce((a, b) => a + b, 0)}\r\n‏‏‎ ‎`, true)
    .addField('🐕 Pets Homed', inventoryCount, true)
    .addField('🏆 Crystals Leaderboard', `${balances.map((b) => {
      return `**${count++}.** <@${b[0]}> <:crystal:769280106270687273>${Math.round(b[1])}\r\n`;
    }).join(' ')}\r\n‏‏‎ ‎`, false)
    .addField('🏆 Pets Leaderboard', `${inventoryLeaders.map((b) => {
      return `**${count2++}.** <@${b[1]}> **${b[2]} ${b[5] === '' ? '' : ` (${b[5]})`}** *Level ${b[11]}*\r\n`;
    }).join(' ')}`, true)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString()));

  }
}

module.exports = new Economy();
