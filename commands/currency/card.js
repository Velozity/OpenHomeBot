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
const { createBalance, getBalance, removeCurrency } = require('../../currency');
const Canvas = require('canvas')
const nodeHtmlToImage = require('node-html-to-image');

/** Card */
class Card extends Chariot.Command {
  constructor() {
    super();

    this.name = 'card';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['cc', 'christmascard']
    this.help = {
      message: 'Buy a christmas card to send to a member',
      usage: 'card <@user> <message>',
      example: 'card @Velo Hi! I love you a lot uwu',
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
    let cost = 25;
    if(args.length === 0 || message.mentions.length === 0) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `The command was entered wrong.
\`\`!card <@user> <a message under 130 characters>\`\``)
      return;
    }

    const target = message.mentions[0];
    const targetMember = message.guild.members.filter((m) => m.id === target.id)[0];

    if(target.id === message.author.id)
      cost = 0;

    if(targetMember === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong',
        'We could not find that user in the server');
      return;
    }

    const msg = args.splice(1).join(' ');

    await createBalance(message.author.id);

    const balance = await getBalance(message.author.id);

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
      return;
    }

    if(parseInt(balance[0]) < cost) {
      sendEmbed(message.channel,
        'RED',
        'Something wront wrong',
        `You can\'t afford a christmas card, you need <:crystal:769280106270687273>${cost}`)
      return;
    }

    if(msg.length > 140) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'Message cannot be over 140 characters')
      return;
    }

    var r = new RegExp('/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g');
    if(r.test(msg)) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'Illegal characters were found in the message, please use basic keyboard letters and symbols.')
      return;
    }

    const dmChannel = await target.getDMChannel().catch((e) => e);

    if(dmChannel instanceof Error) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'This user has their DMs turned off.')
        return;
    }

    const res = await removeCurrency.removeCurrency(message.author.id, cost);
    if(res instanceof Error) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'Please try again')
      return;
    }

      const canvas = Canvas.createCanvas(626, 419);
      const ctx = canvas.getContext('2d');
  
      const background = await Canvas.loadImage('./assets/img/cards/card1.jpg');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const textImage = await nodeHtmlToImage({
        html: ` 
    <html>
      <head>
      <link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet">
        <style>
          body {
            
            font-size: 14px;
            color: #ffffff;
            font-weight: normal;
            font-family: 'Indie Flower', cursive;
            text-align: center;
          }

          .head {
            font-size: 20px;
            font-weight: bold;
            margin-left: 165px;
            padding-top: 50px;
            color: #16264c;
            transform: rotate(-5deg);
            position: absolute;
            max-width: 210px;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: clip; 
          }

          .footer {
            font-size: 20px;
            
            margin-left: 280px;
            margin-top: 290px;
            color: #16264c;
            transform: rotate(-5deg);
            position: absolute;

            max-width: 234px;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: clip; 
          }

          p {
            color: #16264c;
            transform: rotate(-5deg);
            
            font-size: 20px;
            text-align: start;
          }

          #pBorder {
            position: absolute;
            margin-top: 80px;
            margin-left: 170px;
            max-width: 250px;
          }
        </style>
      </head>
      <body>
      <h1 class="head">Dear ${targetMember.nick === null ? target.username : targetMember.nick },</h1>

      <div id="pBorder">
        <p>${msg}</p>
      </div>

      <h1 class="footer">❤️ ${message.member.nick === null ? message.member.username : message.member.nick }.</h1>
      </body>
    </html>`,
        transparent: true
        });

        ctx.drawImage((await Canvas.loadImage(textImage)), 0, 0)

    sendEmbed(message.channel,
      'GREEN',
      'Success',
      `You have purchased a Christmas card for <:crystal:769280106270687273>${cost} and it has been sent to <@` + target.id + '>')
    
      await dmChannel.createMessage(`<@${message.author.id}> (${message.author.username}#${message.author.discriminator}) sent you a Christmas Card!
_(Type \`\`!help card\`\` to send a card)_`, {
        file: canvas.toBuffer(),
        name: `OpenHomeCard-${message.author.id}.jpg`
      });
  }
}

module.exports = new Card();
