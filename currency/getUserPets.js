const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function getUserPets(id) {
  const db = (await database()).session;

  const inventory = await db
    .getSchema('openhome')
    .getTable('currency_ownedpets')
    .select()
    .where('discord_id = :id')
    .bind('id', id)
    .execute()
    .then((result) => result.fetchAll())
    .catch((e) => e);

  db.close();
  return inventory;
}