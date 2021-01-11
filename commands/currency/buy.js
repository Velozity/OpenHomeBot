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
const { createBalance, getBalance, getShopItem } = require('../../currency');
const getUserPets = require('../../currency/getUserPets');

/** Buy */
class Buy extends Chariot.Command {
  constructor() {
    super();

    this.name = 'buy';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Purchase an pet from the shop',
      usage: 'buy <pet>',
      example: 'buy Dog',
      visible: true
    };
  }

  async runPreconditions(message, args, chariot, next) {
    if(args.length < 1) {
      sendEmbed(message.channel,
      'RED',
      'Something went wrong :(',
      `You are missing some fields for this action

\`\`!buy <pet>\`\` - Purchase a pet from the shop`);
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
    const item = args.join(' ')

    const db = (await database()).session;

    const shopItem = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_shop WHERE item='${item}' AND hidden='0';`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    if (shopItem instanceof Error) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Shop items couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(shopItem === undefined) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Pet not found',
        `That pet is not in the shop`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    await createBalance(message.author.id);
    const balance = await getBalance(message.author.id);

     if(balance instanceof Error) {
      db.close();
       sendTransEmbed(message.channel,
         'RED',
         'Something went wrong :(',
         `We couldn't retrieve your balance`,
         `Request by ${message.author.username}`,
         message.author.avatarURL
       );
       return;
     }

     const userPets = await getUserPets(message.author.id);

     if(userPets instanceof Error) {
      db.close();
       sendTransEmbed(message.channel,
         'RED',
         'Something went wrong :(',
         `We couldn't retrieve some data`,
         `Request by ${message.author.username}`,
         message.author.avatarURL
       );
       return;
     }
console.log(userPets);
     if(userPets.filter((t) => t[2] === shopItem[1] && t[4] !== 'Mythical').length >= 5 || userPets.filter((t) => t[2] === shopItem[1] && t[4] === 'Mythical').length >= 8) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `You already own the maximum amount of this pet`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
     }

    //[ 2, 'Dog', 'A fluffy pup uwu', '250', 'img', '0' ]
     if(balance[0] < shopItem[4]) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Not enough Crystals',
        `You need <:crystal:769280106270687273>${Math.round(shopItem[4])} to buy this but you only have <:crystal:769280106270687273>${Math.round(balance[0])}`,
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
     .sql(`UPDATE openhome.currency_bank SET balance = balance - ${Math.round(shopItem[4])} WHERE (discord_id='${message.author.id}');`)
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
 
     // Add the pet item
     const addItem = await db
     .getSchema('openhome')
     .getSession(async (session) => await session.getSession())
     .sql(`INSERT INTO \`openhome\`.\`currency_ownedpets\` (\`discord_id\`, \`item\`, \`rarity\`, \`img\`, \`description\`, \`nickname\`, \`timestamp\`, \`last_walked\`, \`cost\`, \`color\`, \`level\`, \`xp\`, \`last_trained\`) 
     VALUES ('${message.author.id}', '${shopItem[1]}', '${shopItem[2]}', '${shopItem[5]}', '${shopItem[3]}', '', '${Math.round(Date.now() / 1000)}', '', '${shopItem[4]}', '${shopItem[6]}', '0', '0', '');`)
     .execute()
     .then((res) => res.fetchOne())
     .catch((e) => e);

     if (addItem instanceof Error) {
       db.rollback();
       db.close();
       console.log(addItem)
       sendTransEmbed(message.channel,
         'RED',
         'Something went wrong :(',
         `The transaction failed, but we managed to save your crystals!`,
         `Request by ${message.author.username}`,
         message.author.avatarURL
       );
       return;
     }
 
     /** Commit queries */
     db.commit();
     db.close();

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

 //[ 2, 'Dog', 'A fluffy pup uwu', '250', 'img', '0' ]
     sendTransEmbed(message.channel,
      'GREEN',
      'Purchase successful',
      `You have bought a ${shopItem[1]} ${fancyRarities(shopItem[2])} for <:crystal:769280106270687273>${Math.round(shopItem[4])} Crystals
_Use !pets to see your new pet_`,
      `Transaction by ${message.author.username}`,
      message.author.avatarURL
    );
  }
}

module.exports = new Buy();
