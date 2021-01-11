/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  redis, config, logger, database,
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const fs = require('fs');
const moment = require('moment');

/** Donation */
class Donation extends Chariot.Command {
  constructor() {
    super();

    this.name = 'donation';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['dono'];
    this.subcommands = ['add']
    this.help = {
      message: 'Updates donation info',
      usage: 'donation',
      example: ['donation add 20 @Velo'],
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
    if(config.staff.owner.includes(message.member.id))
        next();
    else
      return;
  }

  async add(message, args) {
    const db = (await database()).session;

    // create entry
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`donations\` (\`discord_id\`, \`username\`, \`amount\`, \`timestamp\`) VALUES ('${message.mentions[0].id}', '${message.mentions[0].username}', '0', '${Math.round(Date.now() / 1000)}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    const addDonation = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.donations SET amount = amount + ${parseFloat(args[0])} WHERE (discord_id='${message.mentions[0].id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if (addDonation instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `That donation couldn't be added!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    await sendEmbed(message.channel,
      'GREEN',
      'Success',
      `Added the donation of $${args[0]} USD from ${message.mentions[0].username}`);

    const donations = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT discord_id,username,amount FROM \`openhome\`.\`donations\` ORDER BY amount DESC;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if (donations instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The donations couldn't be retrieved!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    let donationString = '';

    donations.forEach((dono) => {
      donationString += `<@${dono[0]}> (${dono[1]}): **$${Math.round(parseFloat(dono[2]) * 100) / 100} USD**\n`;
    });

    const date = moment(Date.now()).format('L');
    const msg = await message.guild.channels.filter((ch) => ch.id === '768611202322399263')[0].getMessage('769508974667235349');

    msg.edit({
        embed: {
            type: 'rich',
            title: 'Donators',
            description: donationString,
            color: 1981004,
            footer: { text: 'Last updated ' + date }
        }
    });

    // Message general
    const general = await message.guild.channels.filter((ch) => ch.id === '764405152224378883')[0];

    sendEmbed(general,
      'RANDOM',
      'Thank you for donating!',
      `<@${message.mentions[0].id}> (${message.mentions[0].username}) donated **$${args[0]} USD** <:pandalove:768113012082737163> `,
      null,
      'You\'re amazing <3',
      null,
      '',
      message.mentions[0].avatarURL)
  }
  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const db = (await database()).session;

    const donations = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT discord_id,username,amount FROM \`openhome\`.\`donations\` ORDER BY amount DESC;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if (donations instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The donations couldn't be retrieved!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    let donationString = '';

    donations.forEach((dono) => {
      donationString += `<@${dono[0]}> (${dono[1]}): **$${Math.round(parseFloat(dono[2]) * 100) / 100} USD**\n`;
    });

    const date = moment(Date.now()).format('L');
    const msg = await message.guild.channels.filter((ch) => ch.id === '768611202322399263')[0].getMessage('769508974667235349');

    msg.edit({
        embed: {
            type: 'rich',
            title: 'Donators',
            description: donationString,
            color: 1981004,
            footer: { text: 'Last updated ' + date }
        }
    });
  }
}

module.exports = new Donation();
