/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  config, database,
} = require('../config');
const { sendEmbed, sendReply, badWords } = require('../utils');

const Canvas = require('canvas')
const nodeHtmlToImage = require('node-html-to-image');
const discord = require('../config/discord');

/** Say */
class Text extends Chariot.Command {
  constructor() {
    super();

    this.name = 'text';
    this.allowDMs = false;
    this.cooldown = 1;
    this.help = {
      message: 'I\'ll repeat after you!',
      usage: 'say <text>',
      example: ['say Hello!'],
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
    if(config.staff.owner.includes(message.member.id) || config.staff.admin.includes(message.member.id))
      next();
    else
      return;
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {

//       const msg = await sendEmbed(message.channel,
//         'RED',
//         '🎄 Vote for 3 Christmas movies ❄️',
//         `Three of the top voted movies will be streamed on Open Home throughout the month for Christmas!
// :one: Elf
// :two: Home Alone
// :three: The Polar Express 
// :four: The Grinch 
// :five: Frosty the Snowman 
// :six: Muppet Christmas Carol 
// :seven: Prancer 
// :eight: Nightmare Before Christmas 
// :nine: It's A Wonderful Life
// :keycap_ten: The Santa Clause`);

// message.delete();
// var reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

//         await reactions.forEach(async (reaction) => {
//           await msg.addReaction(reaction)
//         });

        // const target = message.mentions[0];

        // const isBad = badWords().some(v => target.username.toLowerCase().includes(v));

        // if(isBad) {
        //     const changeNick = await target.edit({nick: 'Change me'}).catch((e) => e);
        //     if(changeNick instanceof Error) {
        //         return;
        //     }
        // }

        // Set a new canvas to the dimensions of 700x250 pixels
        const canvas = Canvas.createCanvas(626, 419);
        // ctx (context) will be used to modify a lot of the canvas
    
        const ctx = canvas.getContext('2d');
    
        // Since the image takes time to load, you should await it
        const background = await Canvas.loadImage('./assets/img/cards/card1.jpg');
        // This uses the canvas dimensions to stretch the image onto the entire canvas
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
              margin-right: 340px;
              padding-top: 65px;
              color: #16264c;
              transform: rotate(-5deg);
            }

            .footer {
              font-size: 20px;
              
              margin-left: 310px;
              margin-top: -10px;
              color: #16264c;
              transform: rotate(-5deg);
              position: absolute;
            }

            p {
              color: #16264c;
              transform: rotate(-5deg);
              
              font-size: 20px;
              text-align: start;
              word-break: break-all;
            }

            #pBorder {
              margin-left: 180px;
              max-width: 250px;
            }
          </style>
        </head>
        <body>
        <h1 class="head">Dear Atlas,</h1>

        <div id="pBorder">
          <p>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</p>
        </div>

        <h1 class="footer">❤️ Velozity.</h1>
        </body>
      </html>`,
          transparent: true
          });

          ctx.drawImage((await Canvas.loadImage(textImage)), 0, 0)

          await message.channel.createMessage(``, {
            file: canvas.toBuffer(),
            name: 'card.jpg'
          });
//     const data = fs.readFileSync('./donate.png');
//     await message.channel.createMessage('', {
//       file: data,
//       name: 'donate.png'
//     });

//     await sendEmbed(message.channel,
//             '#1e3a4c',
//             'If you wish to greatly support the server',
//       `A part of what made the old server successful was its advertisements and its effectiveness of bringing new friendly faces to the server each day.

// I am unable to personally invest in the server at the moment, and I would like to open up donations for anyone that wishes to contribute to keeping our main source of new faces up and running.

// **100% of the donations go into server advertisement**
// $40 USD/month is the goal

// [If you wish to donate, click here](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=AFC242N5PURGL&item_name=Open+Home+Advertisements&currency_code=USD)
// _Please DM Velo or @ him so he can add you to the donators list_`);

    // const data = fs.readFileSync('./introductions.png');
    // await message.channel.createMessage('', {
    //   file: data,
    //   name: 'introductions.png'
    // });

//     const data = fs.readFileSync('./supportapps.png');
//     await message.channel.createMessage('', {
//       file: data,
//       name: 'supportapps.png'
//     });

//     await sendEmbed(message.channel,
//       '#1e3a4c',
//       '',
// `**Please make sure you meet the following requirements before submitting an application:**
// - You have been in the server for more than 2 weeks and are actively participating in the community (carries over from second home).
// - You are at least 15 years old.
// - You have the right mindset to be dealing with other peoples issues.
// - You enjoy helping others and give good advice.
// - You are a good listener.
// - You know how to improve other peoples happiness.

// [Click here to begin your application](https://forms.gle/YXr6yTvnXJYT5R716)`);

//     const data = fs.readFileSync('./about.png');
//     await message.channel.createMessage('', {
//       file: data,
//       name: 'about.png'
//     });

//     await sendEmbed(message.channel,
//       '#1e3a4c',
//       'Welcome to Open Home',
// `A warm and friendly community focused on improving mental health.

// **Getting Started**
// Please read through the <#764743028295467010> 
// Obtain some <#764743382954016788> that help you express yourself
// Say hello in <#764405152224378883>, we have welcomed you!

// Remember that general chat is positive vibes only.`);

// await sendEmbed(message.channel,
//   '#1e3a4c',
//   'Need some support?',
// `There are many ways you can get support in Open Home.

// **Community Support**
// The <#765879673548308520> channel lets you talk about issues that others may find uncomfortable to talk about
// You can vent about these uncomfortable topics also in <#765522526965071892> 

// **Private Support**
// You can make a support request and talk to one of our dedicated support members 1 on 1 in <#765538549042774016>
// Voice chat may also be available, just ask!

// _For crisis hotline resources, use the !crisis command_
// `);

// await sendEmbed(message.channel,
//   '#1e3a4c',
//   'Things to do',
// `We have implemented some fun things to do that you can participate in.

// **Pet Shop/Pet System**
// Earn<:crystal:769280106270687273> Crystals and buy cute pets in the server that you can
// take for walks and train them to level up and earn more Crystals!
// _Learn more by clicking pinned messages in_ <#779914713621331998>

// **Events**
// Frequently, we love to host <#767265118911332383> to keep the server busy.
// We will often give out prizes such as nitro, exclusive roles or xp.

// **Level System**
// Increase your level by talking in the server text & voice chats, participating in events 
// or boosting the server and unlock new roles.
// `);
// Rules:
//     const data = fs.readFileSync('./rules.png');
//     await message.channel.createMessage('', {
//       file: data,
//       name: 'rules.png'
//     });

//     await sendEmbed(message.channel,
//       '#1e3a4c',
//       '',
//       `
// **General Rules**
// **1.** General chat should be kept positive and free of triggering topics.

// **2.** Harassment, sexism, racism or discrimination are not tolerated at all.

// **3.** Please use proper channels for topics and pictures. 

// **4.** Be respectful to all members of the community.

// **5.** No NSFW anywhere in the server. 

// **6.** No advertising of any form.

// **7.** No spam unless in the <#765825229187842059> channel.

// **8.** No casual sexually explicit discussions (unless it is for support) 

// **9.** No blank, triggering, offensive or inappropriate nicknames.

// **10.** No offensive or inappropriate statuses.

// **11.** No blank, offensive, inappropriate or sexually explicit profile pictures.

// **12.** No offensive, inappropriate or triggering pictures/memes.

// **13.** No DMing members without permission.

// **14.** Do not challenge a mod with a decision.

// **15.** No backseat moderating.

// **16.** No posting of personal information about yourself or others.

// **17.** No excessive use of languages other than English. (Common short phrases are fine, we need to monitor chat to ensure safety)

// **18.** No political discussion.

// **19.** No alt/multiple accounts on the server.

// **20.** Staff's decision is final.

// **21.** No discussion of bans throughout the server, you can dm a staff member.

// **22.** No religious topics or discussions.

// **23.** Abide by the [Discord TOS](https://discord.com/terms)

// **Voice Channel Rules**
// **1.** No mic spam.
// **2.** Do not interrupt an ongoing conversation.
// **3.** No annoying, loud, or high pitch noises.
// **4.** Do not have 2 music bots in the same voice channel.
// **5.** Music bots are allowed in any voice channel as long as everyone is okay with it.
// **6.** Do not sit alone AFK in a channel to XP farm.
// `);
  }
}

module.exports = new Text();
