/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const moment = require('moment');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
/** Transcript */
class Transcript extends Chariot.Command {
  constructor() {
    super();

    this.name = 'transcript';
    this.allowDMs = false;
    this.cooldown = 5;
    this.help = {
      message: 'Uploads a transcript to pastebin',
      usage: 'transcript',
      example: 'transcript',
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

    if(config.staff.owner.includes(message.author.id) || config.staff.admin.includes(message.author.id) || message.member.roles.includes('765540033330806814') || message.member.roles.includes('764430215031160842')) {
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
    let reg = new RegExp('^[0-9]+$');
    if(args.length > 0 && !reg.test(args[0])) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'You didn\'t specify a valid maximum message limit')
    }

    sendReply(message.channel, `<@${message.author.id}> Processing...`);
    let messagesData = await message.channel.getMessages(args[0] !== undefined ? args[0] : 500, message.id);
    messagesData = _.reverse(messagesData);
    const messages = messagesData.map((msg) => { 
      return {
        id: msg.author.id,
        content: msg.content,
        username: msg.author.username,
        tag: msg.author.discriminator,
        bot: msg.author.bot,
        timestamp: msg.timestamp,
        editedTimestamp: msg.editedTimestamp === undefined ? false : msg.editedTimestamp
      };
    });

    let previousUser = '';
    let transcript = `-- Start Transcript ${moment.unix(messages[0].timestamp / 1000).format('MM/DD/YY hh:mm:ssa UTCZ')} --` + messages.map((data) => {
      let tempPrevUser = previousUser;
      previousUser = data.id;
      return `${tempPrevUser === data.id ? '' : `\r\n\r\n${data.username}#${data.tag}${data.bot ? ' (Bot)' : ''}${data.editedTimestamp ? ' - Edited' : ''}:`}
${data.content === '' ? '[EMBED OR IMAGE]' : data.content}`;
    }).join('') + `\r\n\r\n-- End Transcript ${moment.unix(messages[messages.length - 1].timestamp / 1000).format('MM/DD/YY hh:mm:ssa UTCZ')} --`
    
    transcript = `https://discord.me/openhome\r\n\r\nChannel: #${message.channel.name}\r\nUsers in transcript:\r\n${_.uniq(messagesData.filter((msg) => msg.content !== '').map((msg) => `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`)).join('\r\n')}\r\n\r\n` + transcript;
    
    const pasteUrl = await axios({
      method: 'POST',
      url: 'https://api.paste.ee/v1/pastes',
      headers: { 'X-Auth-Token': 'aB7unfJIf56P8YblYIRw8vAtH61DkGsoCwAC4WAOO' },
      data: {
        sections: [{
          name: `Open Home Transcript | ${uuidv4().substring(0, 10)}`,
          contents: transcript
        }]
      }
    }).catch((e) => e);

    if(pasteUrl instanceof Error) {
      console.log(pasteUrl);
      sendEmbed(message.channel,
        'RED',
        'Failed to setup transcript',
        'The transcript could not be uploaded')
        return;
    }
    
    console.log(pasteUrl);
    sendEmbed(message.channel,
      '#1e3a4c',
      `Transcript Ready (${messages.length} messages)`,
      `[Click here to view the transcript](${pasteUrl.data.link})`,
      null,
      `Expires in 4 weeks | Requested by ${message.author.username}`, 
      message.author.avatarURL,
      new Date(Date.now()).toISOString())
  }
}

module.exports = new Transcript();
