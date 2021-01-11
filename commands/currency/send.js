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

/** Send */
class Send extends Chariot.Command {
  constructor() {
    super();

    this.name = 'send';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Send Crystals to another member',
      usage: 'send <amount> <@user>',
      example: 'send 20 @Velo',
      visible: true
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
       if(args.length < 2) {
         sendEmbed(message.channel,
          'RED',
          'Error',
          `You are missing some fields for this action

\`\`!send <amount of crystals> <@user>\`\` - Sends a specified amount of crystals to another user`);
          return;
       }

       if(message.mentions.length === 0) {
        sendEmbed(message.channel,
          'RED',
          'Error',
          'You must specify a member to send crystals to');
        return;
       }

       let reg = new RegExp('^[0-9]+$');
       if(!reg.test(args[0])) {
         sendEmbed(message.channel,
          'RED',
          'Error',
          'The amount you specified is not a number');
          return;
       }

       next();
    }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const target = message.mentions[0];
    const amount = args[0];

    if(target.id === message.author.id) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You cannot send <:crystal:769280106270687273>crystals to yourself');
        return;
    }

    if(target.bot) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'Bots do not have accounts');
        return;
    }

    if(parseInt(amount) < 0 || parseInt(amount) === 0) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You can\'t send that amount');
        return;
    }

    const db = (await database()).session;

    // Create bank if not exists
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${message.author.id}', '${config.currency.startAmount}', '0');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    // Create bank if not exists
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${target.id}', '${config.currency.startAmount}', '0');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    const balance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT balance,frozen FROM openhome.currency_bank WHERE discord_id='${message.author.id}'`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if(balance instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We were unable to retrieve your balance`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(balance[1] === 1) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Your account is frozen and you can't send or recieve <:crystal:769280106270687273>crystals`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const frozenCheck = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT frozen FROM openhome.currency_bank WHERE discord_id='${target.id}'`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if(frozenCheck instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We were unable to retrieve the recipients balance`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(frozenCheck[0] === 1) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The recipients account is frozen and can't send or recieve <:crystal:769280106270687273>crystals`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(Math.round(balance[0]) < 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have enough <:crystal:769280106270687273>crystals!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(Math.round(balance[0]) < amount || (Math.round(balance[0]) - amount) < 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have enough <:crystal:769280106270687273>crystals!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    // Start Transaction
    db.startTransaction();

    const removeBalance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_bank SET balance = balance - ${amount} WHERE (discord_id='${message.author.id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if (removeBalance instanceof Error) {
      db.rollback();
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The transaction failed, but we managed to save your crystals!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const addBalance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_bank SET balance = balance + ${amount} WHERE (discord_id='${target.id}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if (addBalance instanceof Error) {
      db.rollback();
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The transaction failed, but we managed to save your crystals!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const uid = uuidv4().substr(0, 18).replace(/-/g, '');

    const transLog = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT INTO \`openhome\`.\`currency_transactions\` (\`id\`, \`amount\`, \`sender\`, \`receiver\`, \`timestamp\`) VALUES ('${uid}', '${amount}', '${message.author.id}', '${target.id}', '${Math.round(moment.now() / 1000)}');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if(transLog instanceof Error) {
      return;
    }
    /** Commit queries */
    db.commit();
    db.close();

    sendTransEmbed(message.channel,
      'GREEN',
      'Yay!',
      `<@${message.author.id}> has transferred<:crystal:769280106270687273>**` + amount + ` Crystal(s)** to <@${target.id}>`,
      `Transaction ID: ${uid}`,
      message.author.avatarURL
    );

    const logsChannel = message.guild.channels.filter((ch) => ch.id === channels.logs)[0];
    sendTransEmbed(logsChannel,
      'GREEN',
      '',
      `<@${message.author.id}> has transferred<:crystal:769280106270687273>**` + amount + ` Crystal(s)** to <@${target.id}>`,
      `Transaction ID: ${uid}`,
      message.author.avatarURL
    );

    const channel = await target.getDMChannel().catch((e) => e);
    if(channel instanceof Error) {
      console.log(channel);
      return;
    }

    sendTransEmbed(channel,
      '#009ef2',
      `You have a present!`,
      `You were given<:crystal:769280106270687273>**${amount} Crystal(s)** from ${message.author.username}#${message.author.discriminator}`,
      `Transaction ID: ${uid}`)
  }
}

module.exports = new Send();
