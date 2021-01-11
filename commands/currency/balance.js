/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, discord, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const moment = require('moment');
const { createBalance, getBalance } = require('../../currency');

/** Balance */
class Balance extends Chariot.Command {
  constructor() {
    super();

    this.name = 'balance';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['bal']
    this.help = {
      message: 'Shows a users available balance',
      usage: 'balance [@user]',
      example: ['balance', 'balance @Velo'],
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
    const target = message.mentions.length > 0 ? message.guild.members.filter((member) => member.id === message.mentions[0].id)[0] : message.member;

    if(target.bot) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'Bots do not have accounts');
        return;
    }

    await createBalance(target.id);

    const balance = await getBalance(target.id);

    if(balance instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We couldn't retrieve your account`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(balance[1] === 1) {
      message.channel.createEmbed(new Chariot.RichEmbed()
      .setColor('#009ef2')
      .setTitle(`${target.username}'s Account`)
      .addField('Account Status', '❌ Frozen', true)
      .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(new Date().toISOString())
      );
      return;
    }

    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('#009ef2')
    .setTitle(`${target.username}'s Account`)
    .addField('Balance', '<:crystal:769280106270687273>' + Math.round(balance[0]) + ' Crystals', true)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString())
    );
  }
}

module.exports = new Balance();
