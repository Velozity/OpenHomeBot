const Chariot = require('chariot.js');
const Promise = require('bluebird');
const fs = require('fs')

/** Get DM channel id and send MSG to user */
module.exports = async function sendTransEmbed(channel, color, title = '', description = '', footer = '', footerIcon = null, author = '', authorIcon = null) {
  return channel.createEmbed(new Chariot.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter(footer, footerIcon)
    .setAuthor(author, authorIcon)
    .setTimestamp(new Date().toISOString())
  );
};
