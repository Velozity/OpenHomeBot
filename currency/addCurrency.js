const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function addCurrency(id, amount) {
    const db = (await database()).session;

    // Create bank if not exists
    await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${id}', '${config.currency.startAmount}', '0');`)
    .execute()
    .catch((e) => e);

    const setBalance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_bank SET balance = balance + ${amount} WHERE (discord_id='${id}');`)
    .execute()
    .catch((e) => e);

    db.close();
    if (setBalance instanceof Error) {
      return false;
    } else {
      return true;
    }
}