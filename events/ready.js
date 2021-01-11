
const Chariot = require('chariot.js');
const { discord, database } = require('../config');
const sendEmbed = require('../utils/sendEmbed');
const crystalsDrops = require('../utils/crystalsDrops.js');
const { random } = require('lodash');
const { channels, server, currency } = require('../config/config');
const moment = require('moment')
/* Fired when all shards turn ready */
class Ready extends Chariot.Event {
  /**
   * Instantiating the superclass with the appropriate event name
   */
  constructor() {
    super('ready');
  }

  /**
   * @param {error} err Error
   * @param {number} id ID of the shard
   */
  async execute() {
    Chariot.Logger.success('DISCORD STARTUP', 'Ready!');

    discord.editStatus('online', {
      name: 'Open Home ♥',
      type: 3
    });


    if(crystalsDrops.getRunning() === true)
      return;

    crystalsDrops.setRunning(true);

    let channel = discord.guilds.filter((guild) => guild.id === server)[0]
    .channels.filter((channel) => channel.id === channels.general)[0];

    const randomCrystals = async function() {
      let nextTime = Math.round(Math.random() * (currency.dropTimeMax - currency.dropTimeMin) + currency.dropTimeMin);
      const maxClaims = Math.round(Math.random() * (currency.dropMaxClaims - currency.dropMinClaims) + currency.dropMinClaims);
      
      setTimeout(randomCrystals, nextTime);

      console.log(`Next drop: ${Math.round((moment.now() + nextTime) / 1000)}`);

      let ranCrystal = Math.round(Math.random() * (currency.dropMaxPayout - currency.dropMinPayout) + currency.dropMinPayout);

      const msg = await sendEmbed(channel,
        'GOLD',
        'Crystals were dropped!',
        `React with<:crystal:769280106270687273> to pick up<:crystal:769280106270687273>**${ranCrystal} Crystals**`,
        '',
        `0/${maxClaims} users claimed | The drop will disappear in 5 minutes`);

      crystalsDrops.setCrystalDrop({});
      crystalsDrops.setCrystalDrop({
        msgId: msg.id,
        amount: ranCrystal,
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
        title: `Crystals were dropped! (Expired)`,
        description: `React with<:crystal:769280106270687273> to pick up<:crystal:769280106270687273>**${crystalsDrops.getCrystalDrop().amount} Crystals**

${crystalsDrops.getCrystalDrop().usersClaimed.length > 0 ? 'Lucky claimers:' : ''} ${crystalsDrops.getCrystalDrop().usersClaimed.map((u) => `<@${u}>`).join(', ')}`,
        color: '15844367',
        footer: {
            text: `${crystalsDrops.getCrystalDrop().claimed}/${crystalsDrops.getCrystalDrop().maxClaims} users claimed | The drop will disappear in 5 minutes`
        }
        }
      })
      crystalsDrops.setCrystalDrop({});
    }, currency.dropTimeout);
    }

    let ranTime = Math.round(Math.random() * (currency.dropTimeMax - currency.dropTimeMin) + currency.dropTimeMin);
    setTimeout(randomCrystals, ranTime);
    console.log('First drop: ' + Math.round((moment.now() + ranTime) / 1000));
  }
}

module.exports = new Ready();
