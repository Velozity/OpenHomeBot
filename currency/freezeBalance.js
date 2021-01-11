const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function freezeBalance(id) {
  const db = (await database()).session;

  // Create bank if not exists
  await db
  .getSchema('openhome')
  .getSession(async (session) => await session.getSession())
  .sql(`INSERT IGNORE INTO \`openhome\`.\`currency_bank\` (\`discord_id\`, \`balance\`, \`frozen\`) VALUES ('${id}', '${config.currency.startAmount}', '0');`)
  .execute()
  .then((res) => res.fetchOne())
  .catch((e) => e);

  const freeze = await db
  .getSchema('openhome')
  .getSession(async (session) => await session.getSession())
  .sql(`UPDATE openhome.currency_bank SET frozen = 1 WHERE (discord_id='${id}');`)
  .execute()
  .then((res) => res.fetchOne())
  .catch((e) => e);

  db.close();
  if (freeze instanceof Error) 
    return false;
  else
    return true;
}