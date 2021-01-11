const Chariot = require('chariot.js');
const moment = require('moment');

/** Get DM channel id and send MSG to user */
module.exports = async function sendDM(client, id, msg, color='BLACK', title='', image=null) {
  const ch = await client.getDMChannel(id);

  const send = await client.createEmbed(ch.id, new Chariot.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(msg)
    .setImage(image)
    .setFooter('♥ second home', client.user.avatarURL)
    );

  return send;
};
