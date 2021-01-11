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
const getBalance = require('../../currency/getBalance');

/** ShopItem */
class Shop extends Chariot.Command {
  constructor() {
    super();

    this.name = 'shop';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['si', 'shop'];
    this.subcommands = ['add', 'remove', 'hide', 'show', 'stats'];
    this.help = {
      message: 'Shop item staff commands',
      usage: [
        'shop add <item_name> <cost> <img> <rarity> <color> <limited_edition> <description>'
      ],
      example: [
        'shop add Donkey 500 https://imgur.com/afaf Common #ffffff 0 This donkey is a cool donkey'
      ],
      visible: false
    };
  }

  async runPreconditions(message, args, chariot, next) {
    if(args.length === 0) {
      next();
      return;
    }

    let reg = new RegExp('^[0-9]+$');
    if(reg.test(args[0])) {
      next();
      return;
    }

    if(config.staff.owner.includes(message.author.id) || config.staff.admin.includes(message.author.id)) {
      next();
    }
  }

  async hide(message, args) {
    const db = (await database()).session;

    const hideItem = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE \`openhome\`.\`currency_shop\` SET \`hidden\` = '1' WHERE (\`item\` = '${args.join(' ')}');`)
    .execute()
    .then((res) => res.getAffectedItemsCount())
    .catch((e) => e);

    db.close();
    if (hideItem instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Could not hide that item from the shop`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(hideItem === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `That item doesn't exist`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `Hid \`\`${args.join(' ')}\`\` from the shop`)
  }

  async show(message, args) {
    const db = (await database()).session;

    const hideItem = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE \`openhome\`.\`currency_shop\` SET \`hidden\` = '0' WHERE (\`item\` = '${args.join(' ')}');`)
    .execute()
    .then((res) => res.getAffectedItemsCount())
    .catch((e) => e);

    db.close();
    if (hideItem instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Could not show that item in the shop`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(hideItem === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `That item doesn't exist`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `Revealed \`\`${args.join(' ')}\`\` in the shop`)
  }

  async stats(message, args) {
    const db = (await database()).session;

    let inventory = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_ownedpets;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (inventory instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Users pets couldn't be retrieved`,
        `Request by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const getItems = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_shop;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if (getItems instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not get the shop items`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    const ownedPetsCount = inventory.length;
    let ownedPetsText = '';
  
    const shopItemsCount = getItems.length;
    const shopCrystalsSpent = inventory.map((i) => parseInt(i[9])).reduce((a, b) => a + b, 0);

    while(inventory.length !== 0) {
      ownedPetsText += `_${inventory[0][2]}'s_ owned: ${inventory.filter((s) => s[2] === inventory[0][2]).length}\r\n`;
      inventory = _.remove(inventory, (val) => val[2] !== inventory[0][2]);
    }

    sendTransEmbed(message.channel,
      'BLUE',
      `Statistics`,
      `**Shop Stats**
Pets in-store: ${shopItemsCount}
Total crystals spent:<:crystal:769280106270687273>${shopCrystalsSpent}
      
**Owned Pets (${ownedPetsCount} Total)**
${ownedPetsText}`)
  }

  async add(message, args) {
    const itemName = args.join(' ').match(/"([^"]+)"/) !== null ? args.join(' ').match(/"([^"]+)"/)[1] : args[0];
    args = args.join(' ').replace(itemName, '').replace(/"/g, '').split(' ');
    const cost = parseInt(args[1]);
    const img = args[2];
    const rarity = args[3];
    const color = args[4];
    const limitedEdition = args[5];
    const description = args.slice(6).join(' ');

    if(itemName === '' || itemName === undefined || isNaN(cost) || img === '' || img === undefined) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'One or more fields are missing or wrong !help shopitem');
      return;
    }

    const db = (await database()).session;

    const createItem = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`
    INSERT INTO \`openhome\`.\`currency_shop\` 
    (\`item\`, \`description\`, \`cost\`, \`img\`, \`rarity\`, \`color\`, \`limited_edition\`, \`hidden\`) 
    VALUES ('${itemName}', '${description}', '${cost}', '${img}', '${rarity}', '${color}', '${limitedEdition}', '0');
    `)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    db.close();
    if (createItem instanceof Error) {
      console.log(createItem)
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not add this item, maybe an item with this name exists?`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `\`\`${itemName}\`\` has been added to the shop`,
      `Requested by ${message.author.username}`,
      message.author.avatarURL
    );
  }

  async remove(message, args) {
    //DELETE FROM `openhome`.`currency_inventoryitems` WHERE (`id` = '123');
    const db = (await database()).session;

    const deleteItem = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`DELETE FROM \`openhome\`.\`currency_shop\` WHERE (\`item\` = '${args.join(' ')}');`)
    .execute()
    .then((res) => res.getAffectedItemsCount())
    .catch((e) => e);

    db.close();
    if (deleteItem instanceof Error) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `Could not delete that item from the shop`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    if(deleteItem === 0) {
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `That item doesn't exist`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    sendTransEmbed(message.channel,
      'GREEN',
      'Success',
      `Removed \`\`${args.join(' ')}\`\` from the shop`)
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const db = (await database()).session;
    let pageNum = 1;

    if(args.length > 0) {
      let reg = new RegExp('^[0-9]+$');
      if(reg.test(args[0])) {
        pageNum = parseInt(args[0]);
      }
    }

    let getItems = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT * FROM openhome.currency_shop WHERE hidden='0' ORDER BY cost ASC;`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    if (getItems instanceof Error) {
      db.close();
      sendTransEmbed(message.channel,
        'RED',
        'Something went wrong :(',
        `We could not get the shop items`,
        `Requested by ${message.author.username}`,
        message.author.avatarURL
      );
      return;
    }

    // Create bank if not exists
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${message.author.id}', '${config.currency.startAmount}', '0');`)
    .execute()
    .then((res) => res.fetchOne())
    .catch((e) => e);

    const balance = await getBalance(message.author.id);

    db.close();
    if(balance instanceof Error) {
      balance[0] = 'Unknown';
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

    const itemCount = getItems.length;
    const limitedEditionItemsCount = getItems.filter((i) => i[7] === 1).length;
    const limitedEditionItems = getItems.filter((i) => i[7] === 1).map((i) => `**${i[1]} ${i[2] === 'Common' ? '' : ` ${fancyRarities(i[2])}`}**\r\nCost: <:crystal:769280106270687273>${i[4]}\r\nDescription: _${i[3]}_ \r\n ‎`).join('\n');;

    if(pageNum > Math.ceil(itemCount / 5)) { 
      pageNum = 1;
    }
      
    const items = getItems.filter((i) => i[7] === 0).splice(5 * (pageNum - 1), 5 * (pageNum))
      .map((i) => `**${i[1]} ${i[2] === 'Common' ? '' : ` ${fancyRarities(i[2])}`}**\r\nCost: <:crystal:769280106270687273>${i[4]}\r\nDescription: _${i[3]}_ \r\n`).join('\n');
    
    const shopEmbed = new Chariot.RichEmbed()
    .setColor('BLUE')
    .setTitle(`Open Home Pet Shop (Page ${pageNum})`)
    .addField('Your balance', (balance[1] === 1 ? '❌ Frozen' : `<:crystal:769280106270687273>${Math.round(balance[0])} Crystals`) + '\r\n‎‎‎‎‎‎‎‏‏‎ ‎', true);

    if(limitedEditionItems.length > 0)
      shopEmbed.addField(`⏳ Limited Edition (${limitedEditionItemsCount})`, limitedEditionItems, false);

    shopEmbed.addField(`:shopping_cart: Available Pets (${itemCount - limitedEditionItemsCount})`, (items.length === 0 ? 'There are no pets available to purchase :(' : items) + '\r\n‏‏‎ ‎', false)
    .addField('🐕 How to buy a pet', `\`\`\`!buy <pet>
Example: !buy Dog \`\`\``, true)
    .addBlankField(true)
    .addField('❓ How to get Crystals', `\`\`\`Events, walking your pets every 10 hours or random drops in #general.\`\`\``, true)
    .addField('‏‏‎ ‎', `${pageNum === Math.ceil(itemCount / 5) ? 'This is the last page.' : `!shop ${pageNum + 1} to view the next page`}`, false)
    .setFooter(`Page ${pageNum}/${Math.ceil(itemCount / 5)} | Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp(new Date().toISOString());


    message.channel.createEmbed(shopEmbed);
  }
}

module.exports = new Shop();
