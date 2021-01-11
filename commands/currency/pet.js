/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, discord, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply, math } = require('../../utils');
const moment = require('moment');
const { staff } = require('../../config/config');
const ReactionHandler = require('eris-reactions');
const randomizedResponse = require('../../utils/randomizedResponses');
const { addCurrency, removeCurrency, addXP } = require('../../currency');

/** Pet */
class Pet extends Chariot.Command {
  constructor() {
    super();

    this.name = 'pet';
    this.allowDMs = false;
    this.cooldown = 2;
    this.subcommands = ['nickname', 'rehome', 'walk', 'train'];
    this.help = {
      message: 'Pet actions',
      usage: 'pet',
      example: 'buy',
      visible: false
    };
  }
  // !pet <pet> - Displays information about your pet
  // !pet info <pet> - Displays information about your pet
  // !pet nickname <pet> <nickname> - Changes the nickname of your pet
  // !pet rehome <pet> - Rehomes your pet
  // !pet walk <pet> - Walks your pet with chances to get rewards

  async runPreconditions(message, args, chariot, next) {
    if(args.length < 1) {
      sendEmbed(message.channel,
      'RED',
      'Something went wrong :(',
      `You are missing some fields for this action

\`\`!pets\`\` - See your pet inventory

\`\`!pet <pet>\`\` - Displays information about your pet
\`\`!pet info <pet>\`\` - Displays information about your pet
\`\`!pet nickname <pet> <nickname>\`\` - Changes the nickname of your pet
\`\`!pet rehome <pet>\`\` - Rehomes your pet
\`\`!pet walk <pet>\`\` - Walks your pet with chances to get rewards
\`\`!pet train <pet>\`\` - Train your pet to get XP`);
      return;
    }

    next();
  }

  async nickname(message, args) {
    let argsReplaced = args.join(' ').replace(/“/g, '"').replace(/”/g, '"').split(' ');
    console.log(argsReplaced)
    const pet = argsReplaced.join(' ').match(/"([^"]+)"/) !== null ? argsReplaced.join(' ').match(/"([^"]+)"/)[1] : args[0];
    const nickname = argsReplaced.join(' ').replace(pet, '').replace(/"/g, '').trim();
    
    if(nickname.split('').length > 20) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'The nickname must be less than 20 characters');
      return;
    }

    if(nickname === '' || nickname === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You must specify a nickname for your pet')
      return;
    }

    if(pet === '' || pet === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You must specify a pet you own (see your !pets)')
      return;
    }

    const db = (await database()).session;

    console.log(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${message.author.id}' AND (item='${pet}' OR nickname='${pet}');`)
    const getPets = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${message.author.id}' AND (item='${pet}' OR nickname='${pet}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getPets instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(getPets === undefined || getPets.length === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have that pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const p = await this.selectPet(message, getPets, message.author);
    if(p === undefined) 
      return;

    const setNick = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE \`openhome\`.\`currency_ownedpets\` SET \`nickname\` = '${nickname}' WHERE (\`id\` = '${p[0]}');`)
    .execute()
    .then((res) => res.getAffectedItemsCount())
    .catch((e) => e);

    db.close();
    if (setNick instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `There was a problem setting the nickname for this pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(setNick === 1) {
      sendTransEmbed(message.channel,
        'GREEN',
        'Yay!',
        `Your ${p[2]} has been nicknamed \`\`${nickname}\`\``,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    } else {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `There was a problem setting the nickname for this pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    }
  }

  async rehome(message, args, chariot) {
    const pet = args[0];

    if(pet === '' || pet === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You must specify a pet you own (see your !pets)')
      return;
    }

    const db = (await database()).session;

    const getPets = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${message.author.id}' AND (item='${pet}' OR nickname='${pet}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getPets instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(getPets === undefined || getPets.length === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have that pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const p = await this.selectPet(message, getPets, message.author);
    if(p === undefined) 
      return;

    const confirm = await sendEmbed(message.channel,
      'BLUE',
      'Confirm action',
      `Are you sure you want to rehome your ${p[2]}?`);
    
    await confirm.addReaction('✅');
    await confirm.addReaction('❌');

    const reactions = await ReactionHandler.collectReactions(
      confirm, 
      (userID) => userID === message.author.id, 
      { maxMatches: 1, time: 20000 }
    );

    if(reactions.length === 0) {
      sendEmbed(message.channel,
        'RED',
        'Action cancelled',
        `Your ${p[2]} is staying with you for a little longer!`)
      return;
    }

    const emojiReacted = reactions[0].emoji.name;
    
    if(emojiReacted === '❌') {
      sendEmbed(message.channel,
        'RED',
        'Action cancelled',
        `Your ${p[2]} is staying with you for a little longer!`)
      return;
    }

    const deletePet = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`DELETE FROM \`openhome\`.\`currency_ownedpets\` WHERE (\`id\` = '${p[0]}');`)
    .execute()
    .then((res) => res.getAffectedItemsCount())
    .catch((e) => e);

    db.close();
    if (deletePet instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `There was a problem rehoming this pet, guess you'll have to keep it for a while!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(deletePet === 1) {
      sendTransEmbed(message.channel,
        'GREEN',
        'Yay!',
        `Your ${p[2]} has been rehomed to a loving family <3`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    } else {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `There was a problem rehoming this pet, guess you'll have to keep it for a while!`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    }
  }

  async train(message, args) {
    const pet = args.splice(0).join(' ');

    if(pet === '' || pet === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You must specify a pet you own (see your !pets)')
      return;
    }

    const db = (await database()).session;

    const getPets = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${message.author.id}' AND (item='${pet}' OR nickname='${pet}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getPets instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(getPets === undefined || getPets.length === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have that pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const p = await this.selectPet(message, getPets, message.author);
    if(p === undefined) 
      return;

    if(p[13] === '' || moment.unix(p[13]).add(10, 'hours').isSameOrBefore(moment.now())) {
      // calculate xp
      const xp = Math.round((Math.random() * (150 - 50) + 50) + (p[11] * 0.02));

      // if can train
      const addTrain = await db
      .getSchema('openhome')
      .getSession(async (session) => await session.getSession())
      .sql(`UPDATE \`openhome\`.\`currency_ownedpets\` SET \`last_trained\` = '${Math.round(moment.now() / 1000)}', \`xp\` = xp + ${xp}${math.levelToXP(p[11] + 1) - (p[12] + xp) < 0 ? `,\`level\` = level + 1` : ''} WHERE (\`id\` = '${p[0]}');`)
      .execute()
      .catch((e) => e);
  
      db.close();
      if (addTrain instanceof Error) {
        sendTransEmbed(message.channel,
          'RED',
          'Something went wrong :(',
          `Please try again later`,
          `Request by ${message.author.username}`,
          message.author.avatarURL
        );
        return;
      }

      const response = randomizedResponse.trainResponses(p[2], xp);

      console.log('level: ' + p[11])
      console.log('xp: ' + xp)

      sendTransEmbed(message.channel,
        'GREEN',
        `You trained ${p[5] === '' ? `your ${p[2].toLowerCase()}` : p[5] }...`,
        `_${response.response}_`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    } else {
      // if cant
      sendTransEmbed(message.channel,
        'RED',
        'Zzzzzzz...',
        `${p[5] === '' ? `Your ${p[2].toLowerCase()}` : p[5]} is still resting... you can take train it ${moment.unix(p[13]).add(10, 'hours').fromNow()}`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    }
  }

  async walk(message, args) {
    const pet = args.splice(0).join(' ');

    if(pet === '' || pet === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        'You must specify a pet you own (see your !pets)')
      return;
    }

    const db = (await database()).session;

    const getPets = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${message.author.id}' AND (item='${pet}' OR nickname='${pet}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getPets instanceof Error) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(getPets === undefined || getPets.length === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You don't have that pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      db.close();
      return;
    }

    const p = await this.selectPet(message, getPets, message.author);
    if(p === undefined) 
      return;

    if(p[8] === '' || moment.unix(p[8]).add(10, 'hours').isSameOrBefore(moment.now())) {
      // calculate xp
      const xp = Math.round((Math.random() * (102 - 43) + 43) + (p[11] * 0.02));

      // if can walk
      const addWalk = await db
      .getSchema('openhome')
      .getSession(async (session) => await session.getSession())
      .sql(`UPDATE \`openhome\`.\`currency_ownedpets\` SET \`last_walked\` = '${Math.round(moment.now() / 1000)}', \`xp\` = xp + ${xp}${math.levelToXP(p[11] + 1) - (p[12] + xp) < 0 ? `,\`level\` = level + 1` : ''} WHERE (\`id\` = '${p[0]}');`)
      .execute()
      .then((res) => res.fetchAll())
      .catch((e) => e);
  
      if (addWalk instanceof Error) {
        db.close();
        sendTransEmbed(message.channel,
          'RED',
          'Something went wrong :(',
          `Please try again later`,
          `Request by ${message.author.username}`,
          message.author.avatarURL
        );
        return;
      }

      const response = randomizedResponse.walkResponses(p[2], p[9], xp);
      addCurrency(message.author.id, response.reward);

      console.log('level: ' + p[11])
      console.log('xp: ' + xp)

      sendTransEmbed(message.channel,
        'GREEN',
        `You took ${p[5] === '' ? `your ${p[2].toLowerCase()}` : p[5] } for a walk...`,
        `_${response.response}_`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    } else {
      // if cant
      sendTransEmbed(message.channel,
        'RED',
        'Zzzzzzz...',
        `${p[5] === '' ? `Your ${p[2].toLowerCase()}` : p[5]} is still resting... you can take it for a walk ${moment.unix(p[8]).add(10, 'hours').fromNow()}`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
    }

    db.close();
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const target = message.mentions.length > 0 ? message.mentions[0] : message.author;
    const pet = args.join(' ').replace(`<@${target.id}>`, '').replace(`<@!${target.id}>`, '').trim();

    console.log(pet);
    if(pet === '' || pet === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You must specify a pet you own (see your !pets)
``!pet <pet>`` - Displays information about your pet
``!pet info <pet>`` - Displays information about your pet
``!pet nickname <pet> <nickname>`` - Changes the nickname of your pet
``!pet rehome <pet>`` - Rehomes your pet
``!pet walk <pet>`` - Walks your pet with chances to get rewards`)
      return;
    }

    const db = (await database()).session;

    const getPets = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets WHERE discord_id='${target.id}' AND (item='${pet}' OR nickname='${pet}');`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getPets instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    db.close();
    if(getPets === undefined || getPets.length === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `That pet could not be found in <@${target.id}> inventory`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const p = await this.selectPet(message, getPets, target);
    if(p === undefined) 
      return;

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

    console.log('hi ' + p[13])
    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor(p[10])
    .setTitle(`${target.username}'s ${p[2]} ${p[5] === '' ? '' : `(${p[5]})`}`)
    .addField('🐕 Species', `${p[2]}`, true)
    .addField('🎂 Age', `*${moment.unix(moment.now() / 1000).diff(moment.unix(p[7]), 'days')} days old*`, true)
    .addField(`📘 Progression`, `Level ${p[11]} _(${p[12]} XP)_\n_${math.levelToXP(p[11] + 1) - p[12]} XP for Lvl ${p[11] + 1}_`, true)
    .addField('🚶‍♀️ Last Walked', `${p[8] === '' ? 'Never' : moment.unix(p[8]).fromNow()}`, true)
    .addField('🏋️ Last Trained', `${p[13] === '' ? 'Never' : moment.unix(p[13]).fromNow()}`, true)
    .addField('⚡ Rarity', `${p[4]} ${fancyRarities(p[4])}`, true)
    .addField('💭 Description', `\`\`\`${p[3]}\`\`\``, false)
    .setThumbnail(p[6])
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString())
    );
  }

  async selectPet(message, getPets, target) {
    if(getPets.length > 1) {
      let count = 1;

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

      const confirm = await sendEmbed(message.channel,
        'BLUE',
        `Choose one of ${target.username}'s pets`,
        `<@${target.id}> has multiple ${getPets[0][2]}'s, please select one:
${getPets.map((pet) => `${count++}) **${pet[2]}${pet[5] === '' ? '' : ` (${pet[5].trim()})`}**${pet[4] === 'Common' ? '' : ` (${pet[4]} ${fancyRarities(pet[4])})`} *${moment.unix(moment.now() / 1000).diff(moment.unix(pet[7]), 'days')} days old*`).join('\n')}`);

      for(let i = 1; i <= getPets.length; i++) {
        switch(i) {
          case 1:
            await confirm.addReaction('1️⃣')
            break;
          case 2:
            await confirm.addReaction('2️⃣')
            break;
          case 3:
            await confirm.addReaction('3️⃣')
            break;
          case 4:
            await confirm.addReaction('4️⃣')
            break;
          case 5:
            await confirm.addReaction('5️⃣')
            break;
          case 6:
            await confirm.addReaction('6️⃣')
            break;
          case 7:
            await confirm.addReaction('7️⃣')
            break;
          case 8:
            await confirm.addReaction('8️⃣')
            break;        
        }
      }

      const reactions = await ReactionHandler.collectReactions(
        confirm, 
        (userID) => userID === message.author.id, 
        { maxMatches: 1, time: 20000 }
      );

      if(reactions.length === 0) {
        sendEmbed(message.channel,
          'RED',
          'Action cancelled',
          `<@${message.author.id}> did not select a pet :(`)
        return;
      }

      const emojiReacted = reactions[0].emoji.name;
      let result = 0;
      switch(emojiReacted) {
        case '1️⃣':
            result = 0;
          break;
        case '2️⃣':
            result = 1;
          break;
        case '3️⃣':
            result = 2;
          break;
        case '4️⃣':
            result = 3;
          break;
        case '5️⃣':
            result = 4;
          break;
        case '6️⃣':
            result = 5;
          break;
        case '7️⃣':
            result = 6;
          break;
        case '8️⃣':
            result = 7;
          break;        
      }

      return getPets[result];
    } else {
      return getPets[0];
    }
  }
}

module.exports = new Pet();
