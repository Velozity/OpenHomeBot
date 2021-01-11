/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, discord
} = require('../config');
const { sendEmbed, sendReply } = require('../utils');
const moment = require('moment');

/** ServerInfo */
class ServerInfo extends Chariot.Command {
  constructor() {
    super();

    this.name = 'serverinfo';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'serverinfo',
      usage: 'serverinfo',
      example: 'serverinfo',
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
    const guild = await chariot.guilds.get(message.guild.id);

    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('#1e3a4c')
    .setTitle(guild.name)
    .setDescription(guild.description === null ? '' : guild.description)
    .setThumbnail(guild.iconURL)
    .addField('📈 Population', guild.memberCount + ' Members', true)
    .addField('🌏 Server Region', guild.region.charAt(0).toUpperCase() + guild.region.slice(1), true)
    .addField('⭐ Boosters', guild.premiumSubscriptionCount === 0 ? 'None' : guild.premiumSubscriptionCount + ` Boosters\n_(Level ${guild.premiumTier})_`, true)
    .addField('😎 Emojis', `${guild.emojis.length} Emojis`, true)
    .addField('💬 Channels', `${guild.channels.map((c) => c).length} Channels`, true)
    .addField('🧍 Roles', `${guild.roles.map((r) => r).length} Roles`, true)
    .addBlankField(false)
    .addField('🔗 Invite URL', guild.premiumSubscriptionCount !== 30 ? 'https://discord.gg/n6DVv6m' : 'https://discord.gg/openhome', false)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    );
  }
}

module.exports = new ServerInfo();
