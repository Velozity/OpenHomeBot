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

/** UserInfo */
class UserInfo extends Chariot.Command {
  constructor() {
    super();

    this.name = 'userinfo';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'userinfo',
      usage: 'userinfo <@user>',
      example: 'userinfo @Velo',
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

    if(typeof(target) === undefined || typeof(target) === null) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'A problem occured retrieving that information')
      return;
    }

    const serverLevels = message.guild.roles.filter((role2) => role2.name.toLowerCase().includes('level')).map((role) => role.id);

    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('#1e3a4c')
    .setTitle(`${target.username}#${target.discriminator}`)
    .setThumbnail(target.avatarURL)
    .addField('📝 Nickname', `${target.nickname === undefined ? 'None' : target.nickname}`, true)
    .addField('📘 Account Created', `${moment.unix(target.createdAt / 1000).format('MM/DD/YYYY')}\n_(${moment.unix(target.createdAt / 1000).fromNow()})_`, true)
    .addField('⭐ Is Boosting?', `${target.premiumSince === null ? 'No' : 'Yes'}`, true)
    .addField('🚪 Joined On', `${moment.unix(target.joinedAt / 1000).format('MM/DD/YYYY')}\n_(${moment.unix(target.joinedAt / 1000).fromNow()})_`, true)
    .addField('🏆 Open Home Level', target.roles.filter((role) => serverLevels.includes(role))[0] === undefined ? 'None' : `<@&${target.roles.filter((role) => serverLevels.includes(role))[0]}>`, true)
    .addField('🎮 State', `${target.game === null ? 'None' : target.game.name}`, true)
    .addBlankField(false)
    .addField('🧍 Roles', target.roles.length === 0 ? 'None' : target.roles.map((role) => `<@&${role}>`).join(' '), false)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString())
    );
  }
}

module.exports = new UserInfo();
