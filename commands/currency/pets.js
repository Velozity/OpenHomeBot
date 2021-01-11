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
const { staff } = require('../../config/config');
const getUserPets = require('../../currency/getUserPets');

/** Pets */
class Pets extends Chariot.Command {
  constructor() {
    super();

    this.name = 'pets';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Show your pet inventory',
      usage: 'pets',
      example: 'pets',
      visible: false
    };
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const item = args[0];
    let isTargetted = false;

    if(message.mentions.length > 0)
      isTargetted = true;

    const db = (await database()).session;

    const inventory = await getUserPets(isTargetted ? message.mentions[0].id : message.author.id);

    if (inventory instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `<@${isTargetted ? message.mentions[0].id : message.author.id}> pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(inventory.length === 0) {
      sendTransEmbed(message.channel,
        'BLUE',
        `${isTargetted && message.mentions[0].id !== message.author.id ? message.mentions[0].username : message.author.username}'s Pets`,
        `${isTargetted && message.mentions[0].id !== message.author.id ? `<@${message.mentions[0].id}> doesn't own any` : 'You don\'t own any'} pets :(`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    function fancyRarities(rarity) {
      switch(rarity) {
        case 'Rare':
          return '\\💎';
          break;
        case 'Mythical':
          return '\\🔮'
          break;
        case 'Legendary':
          return '\\✨';
          break;
        default:
          return '';
          break;
      }
    }

    let iText = inventory.map((i) => `**${i[2]}${i[5] === '' ? '' : ` (${i[5].trim()})`} ${fancyRarities(i[4])}** *Lvl ${i[11]}*`).join('\n');
    let iDescriptions = inventory.map((i) => `${i[3]}`).join('\n');
    let iTimestamps = inventory.map((i) => `_${moment.unix(i[7]).fromNow(true)}_`).join('\n');
     
    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('BLUE')
    .setTitle(`${isTargetted ? message.mentions[0].username : message.author.username}'s Pets`)
    .addField('🐕 Pets', iText + `\r\n\r\n${isTargetted && message.mentions[0].id !== message.author.id ? message.mentions[0].username + ' owns ' : 'You own '} ${inventory.length} pet${inventory.length > 1 ? 's' : ''}\r\n\r\n`, false)
    .addField('View pet info', `\`\`!pet <pet species/nickname>\`\``, true)
    .addField('Walk your pet', `\`\`!pet walk <pet species/nickname>\`\``, true)
    .addField('Change nickname', `\`\`!pet nickname <pet species/nickname> <new nickname>\`\``, false)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString())
    );
  }
}

module.exports = new Pets();
