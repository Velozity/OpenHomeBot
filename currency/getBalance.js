const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function getBalance(id) {
  const db = (await database()).session;

  const balance = await db
  .getSchema('openhome')
  .getTable('currency_bank')
  .select('balance')
  .where('discord_id = :id')
  .bind('id', id)
  .execute()
  .then((result) => result.fetchOne())
  .catch((e) => e);

  db.close();

  return balance;
}