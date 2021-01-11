/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const { discord } = require('../config');
const sendEmbed = require('../utils/sendEmbed');
const sendTransEmbed = require('../utils/sendTransEmbed');
const { staff, channels } = require('../config/config');
const badWords = require('../utils/badWords')
/**
 * Fired when someone adds a reaction to a message
 */
class messageCreate extends Chariot.Event {
  /**
   * Instantiating the superclass with the appropriate event name
   */
  constructor() {
    super('messageCreate');
  }

  /**
    * @param {Object} message The message object.
    */
  async execute(message) {
    if(message.content.split(' ').filter((i) => i.startsWith('https://discord.gg/')).length > 0 || message.content.split(' ').filter((i) => i.startsWith('http://discord.gg/')).length > 0) {
      // if(staff.owner.includes(message.author.id))
      //   return;

      const url = message.content.split(' ').filter((i) => i.startsWith('https://discord.gg/')).length > 0 ? message.content.split(' ').filter((i) => i.startsWith('https://discord.gg/'))[0] : message.content.split(' ').filter((i) => i.startsWith('http://discord.gg/'))[0];

      const del = await message.delete().catch((e) => e);
      console.log(del)
      const logChannel = message.guild.channels.filter((channel) => channel.id === channels.logs)[0];
      sendTransEmbed(logChannel, 
        'RED',
        ``,
        `**<@${message.author.id}> posted a server link in <#${message.channel.id}>**
${url}

The message has been removed and warning message has been sent to the user.`,
`Author: ${message.author.id}`,
null,
`${message.author.username}#${message.author.discriminator}`,
message.author.avatarURL)

      const channel = await message.author.getDMChannel();
      sendEmbed(channel,
        'RED',
        'Warning',
        'You are not allowed to post server links in Open Home')
      return;
    }

    // owo fun
    if(message.channel.id === channels.uwu) {
      message.content = message.content.replace(/_/g, '').replace(/\*/g, '');

      if(message.content.toLowerCase().replace(/ /g, '').replace(/uwu/g, '').replace(/owo/g, '') === '') {

      } else {
        message.delete();
      }
    }

    // bot reactions
    const inputs = [
      'i love open home',
      'i love this server',
      'this server is great',
      'this server is amazing',
    ]

    if(inputs.includes(message.content.toLowerCase())) {
      message.addReaction('❤️')
    }

    const coolInputs = [
      'cool server',
      'cool open home',
      `cool <@${discord.user}>`
    ]

    
    if(coolInputs.includes(message.content.toLowerCase())) {
      message.addReaction('🤏').then(() => message.addReaction('😎'))
    }


    // const bannedWords = badWords();

    // if(bannedWords.includes(bannedWords)) {

    // }
  }
}

module.exports = new messageCreate();
