const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function createBalance(id) {
  const db = (await database()).session;

   const result = await db
   .getSchema('openhome')
   .getSession(async (session) => await session.getSession())
   .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${id}', '${config.currency.startAmount}', '0');`)
   .execute()
   .catch((e) => e);

   db.close();
   return true;
}