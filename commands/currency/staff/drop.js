/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  redis, config, logger, database, discord
} = require('../../../config');
const { sendTransEmbed, sendEmbed, sendReply, crystalsDrops } = require('../../../utils');
const fs = require('fs');
const moment = require('moment');

/** Drop */
class Drop extends Chariot.Command {
  constructor() {
    super();

    this.name = 'drop';
    this.allowDMs = false;
    this.cooldown = 2;
    this.help = {
      message: 'Spawns a crystal drop',
      usage: 'drop <amount> <maxClaim>',
      example: ['drop 50 3'],
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
    if(config.staff.owner.includes(message.member.id))
    {
       let reg = new RegExp('^[0-9]+$');
       if(!reg.test(args[0]) || !reg.test(args[1])) {
         sendEmbed(message.channel,
          'RED',
          'Error',
          'The amount/maxclaims you specified is not a number');
          return;
       }

       next();
    } else {
      return;
    }
  }

  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    let amount = parseInt(args[0]);
    let maxClaims = parseInt(args[1]);

    message.delete();
    let firstRun = true;
    var randomCrystals = async function() {

      const msg = await sendEmbed(message.channel,
        '#4BC8EF',
        'Crystals were dropped by Staff!',
        `React with<:crystal:769280106270687273> to pick up<:crystal:769280106270687273>**${amount} Crystals**`,
        '',
        `0/${maxClaims} users claimed | The drop will disappear in 5 minutes`);

      crystalsDrops.setCrystalDrop({
        msgId: msg.id,
        amount: amount,
        maxClaims: maxClaims,
        claimed: 0,
        usersClaimed: []
      });
      msg.addReaction('crystal:769280106270687273')
      setTimeout(() => {
        //msg.delete().catch((e) => e);
        if(Object.keys(crystalsDrops.getCrystalDrop()).length === 0)
          return;
      
      msg.edit({
        embed: {
        title: `Crystals were dropped by Staff! (Expired)`,
        description: `React with<:crystal:769280106270687273> to pick up<:crystal:769280106270687273>**${crystalsDrops.getCrystalDrop().amount} Crystals**

${crystalsDrops.getCrystalDrop().usersClaimed.length > 0 ? 'Lucky claimers:' : ''} ${crystalsDrops.getCrystalDrop().usersClaimed.map((u) => `<@${u}>`).join(', ')}`,
        color: '4966639',
        footer: {
            text: `${crystalsDrops.getCrystalDrop().claimed}/${crystalsDrops.getCrystalDrop().maxClaims} users claimed | The drop will disappear in 5 minutes`
        }
        }
      })
      crystalsDrops.setCrystalDrop({});
    }, config.currency.dropTimeout);
    }

    randomCrystals();
  }
}

module.exports = new Drop();
