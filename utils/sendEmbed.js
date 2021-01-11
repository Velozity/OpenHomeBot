const Chariot = require('chariot.js');
const Promise = require('bluebird');
const fs = require('fs')

/** Get DM channel id and send MSG to user */
module.exports = async function sendEmbed(channel, color, title = '', description = '', image = null, footer = '', footerIcon = null, timestamp = '', thumbnail = '') {
  return channel.createEmbed(new Chariot.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setImage(image)
    .setFooter(footer, footerIcon)
    .setTimestamp(timestamp)
    .setThumbnail(thumbnail)
  );
};
