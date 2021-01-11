const Chariot = require('chariot.js');
const { database, discord, config } = require('../config');
const { v4: uuidv4 } = require('uuid')
const sendEmbed = require('../utils/sendEmbed')
const moment = require('moment')
const crystalsDrops = require('../utils/crystalsDrops')
const sendTransEmbed = require('../utils/sendTransEmbed')

class messageReactionAdd extends Chariot.Event {
    constructor() {
        super('messageReactionAdd');
    }

    /**
     * Main event handling method running upon the registered event being fired.
     * Arguments passed to the execute method are always relative to the event it is processing.
     * For instance the "ready" event has no args, whereas the "message" event gets passed "message"
     * 
     * @param {*} args Arguments for the main event executor as described above.
     */
    async execute(message, emoji, userID) {
        // Claim
        if(emoji.id !== '769280106270687273')
            return;

        const msg = message.channel.messages.filter((m) => m.id === message.id)[0];

        if(msg !== undefined)
            if(msg.author.id === userID)
                return;

        if(emoji.id === '769280106270687273') {
            if(Object.keys(crystalsDrops.getCrystalDrop()).length === 0)
                return;
            
            if(crystalsDrops.getCrystalDrop().msgId === message.id) {
                // reacted to right msg
            
                let drop = crystalsDrops.getCrystalDrop();
                let user = message.guild.members.filter((m) => m.id === userID)[0];

                if(user === undefined) 
                    return;

                if(drop.usersClaimed.includes(userID)) 
                    return;

                drop.usersClaimed.push(userID)

                if(drop.maxClaims === 1) {
                crystalsDrops.setCrystalDrop({});
                } else if(drop.maxClaims <= drop.claimed + 1) {
                crystalsDrops.setCrystalDrop({});
                } else {
                
                crystalsDrops.setCrystalDrop({
                    msgId: drop.msgId,
                    amount: drop.amount,
                    maxClaims: drop.maxClaims,
                    claimed: drop.claimed + 1,
                    usersClaimed: drop.usersClaimed
                });
                }

                drop.claimed = drop.claimed + 1;
                const db = (await database()).session;

                // Create bank if not exists
                await db
                .getSchema('openhome')
                .getSession(async (session) => await session.getSession())
                .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${user.id}', '${config.currency.startAmount}', '0');`)
                .execute()
                .then((res) => res.fetchOne())
                .catch((e) => e);

                const setBalance = await db
                .getSchema('openhome')
                .getSession(async (session) => await session.getSession())
                .sql(`UPDATE openhome.currency_bank SET balance = balance + ${drop.amount} WHERE (discord_id='${user.id}');`)
                .execute()
                .then((res) => res.fetchOne())
                .catch((e) => e);

                if (setBalance instanceof Error) {
                    return;
                }

                const logsChannel = message.guild.channels.filter((ch) => ch.id === config.channels.logs)[0];
            
                const uid = uuidv4().substr(0, 18).replace(/-/g, '');

                const transLog = await db
                .getSchema('openhome')
                .getSession(async (session) => await session.getSession())
                .sql(`INSERT INTO \`openhome\`.\`currency_transactions\` (\`id\`, \`amount\`, \`sender\`, \`receiver\`, \`timestamp\`) VALUES ('${uid}', '${drop.amount}', 'SYSTEM-DROP', '${user.id}', '${Math.round(moment.now() / 1000)}');`)
                .execute()
                .then((res) => res.fetchOne())
                .catch((e) => e);

                db.close();
                if(transLog instanceof Error) {
                    return;
                }

                sendTransEmbed(logsChannel, 
                    'BLUE',
                    ``,
                    `**<@${user.id}> claimed a crystal drop**
    They received <:crystal:769280106270687273>**${drop.amount} Crystals**`,
                `${drop.claimed}/${drop.maxClaims} users claimed`,
                null,
                `${user.username}#${user.discriminator}`,
                user.avatarURL)

                const embed = (await message.channel.getMessage(drop.msgId)).embeds[0];

                message.channel.editMessage(drop.msgId, {
                    embed: {
                    title: embed.title + ` ${drop.claimed === drop.maxClaims ? '(Finished)' : ''}`,
                    description: `React with<:crystal:769280106270687273> to pick up<:crystal:769280106270687273>**${drop.amount} Crystals**

Lucky claimers: ${drop.usersClaimed.map((u) => `<@${u}>`).join(', ')}`,
                    color: embed.color,
                    footer: {
                        text: `${drop.claimed}/${drop.maxClaims} users claimed | The drop will disappear in 5 minutes`
                    }
                    }
                })
            }
        }
    }
}

module.exports = new messageReactionAdd();