const { database, config} = require('../config');

/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const { sendReply } = require('../utils');

class Help extends Chariot.Command {
  constructor() {
    super();

    this.name = 'help';
    this.allowDMs = true;
    this.subcommands = ['card']
    this.help = {
        message: 'Get either a general Help card or instructions for specified commands! Specifying a command is optional. If a command was specified its help text will show up.',
        usage: 'help [command]',
        example: ['help', 'help command'],
        inline: true
    }
  }

  async card(message, args, chariot) {
    sendReply(message.channel, `Send a Christmas card to a member!\r\n\`\`!card <@user> <a message under 130 characters>\`\` - requires 50 Crystals`)
  }

  async execute(message, args, chariot) {
    message.channel.createEmbed(new Chariot.RichEmbed()
    .setColor('#1e3a4c')
    .setTitle(`Open Home Bot | Command Help`)
    .addField('⚙️ General Commands', `\`\`!help\`\` - View this message
\`\`!crisis [country]\`\` - Get crisis hotlines for a country
\`\`!userinfo [@user]\`\` - Shows user info
\`\`!serverinfo\`\` - View server info`, true)
    .addBlankField(true)
    .addField('🛒 Pet Shop Commands', `\`\`!balance [@user]\`\` - Check the balance of a user
\`\`!shop\`\` - View the pet shop
\`\`!buy <pet>\`\` - Buy a pet from the shop
\`\`!send <amount> <@user>\`\` - Send crystals to a user
\`\`!leaderboard\`\` - View leaderboards`, true)
    .addBlankField(false)
    .addField('🐶 Pet Commands', `\`\`!pets [@user]\`\` - View all pets you or someone owns
\`\`!pet <pet>\`\` - Shows info on your pet
\`\`!pet walk <pet>\`\` - Walk your pet for crystals & XP
\`\`!pet train <pet>\`\` - Train your pet for XP
\`\`!pet nickname <pet> <new nickname>\`\` - Nickname your pet
\`\`!pet rehome <pet>\`\` - Rehome your pet (deletes them)
_You can refer to your pet with the nickname you set (wrap in "quotations" if multiple words)_`, true)

)
  }
}

module.exports = new Help();
