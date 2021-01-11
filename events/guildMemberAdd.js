const Chariot = require('chariot.js');
const { database, discord } = require('../config');
const sendEmbed = require('../utils/sendEmbed');
const { badWords, crystalsDrops } = require('../utils')
const { server, channels } = require('../config/config');
const Canvas = require('canvas');
const nodeHtmlToImage = require('node-html-to-image')
const sendReply = require('../utils/sendReply');

class guildMemberAdd extends Chariot.Event {
    constructor() {
        super('guildMemberAdd');
    }

    /**
     * Main event handling method running upon the registered event being fired.
     * Arguments passed to the execute method are always relative to the event it is processing.
     * For instance the "ready" event has no args, whereas the "message" event gets passed "message"
     * 
     * @param {*} args Arguments for the main event executor as described above.
     */
    async execute(guild, member) {
        const db = (await database()).session;

        const autoroles = await db
        .getSchema('openhome')
        .getSession(async (session) => await session.getSession())
        .sql(`SELECT role_id FROM openhome.autoroles`)
        .execute()
        .then((res) => res.fetchAll())
        .catch((e) => e)
        db.close();

        autoroles.map(async (role) => {
            member.addRole(role[0], 'Auto assigned roles')
            .catch((e) => e)
        });

        let channel = guild
        .channels.filter((channel) => channel.id === channels.general)[0];

        const target = member.user;

        const isBad = badWords().some(v => target.username.toLowerCase().includes(v));

        if(isBad) {
            const changeNick = await member.edit({nick: 'Change me'}).catch((e) => e);
            await channel.createMessage(`<@${target.id}> Please change your nickname`);
        }

        if(guild.memberCount % 50 === 0 && !crystalsDrops.getMilestones().includes(guild.memberCount)) {
            sendEmbed(channel, 
                'RANDOM',
                `We reached ${guild.memberCount} members!`,
                'Thank _you_ for making this possible.',
                null,
                '',
                null,
                '',
                guild.iconURL);

            crystalsDrops.addMilestone(guild.memberCount);
        }
    }
}

module.exports = new guildMemberAdd();