const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function getShopItems() {
  const db = (await database()).session;

  const shopItems = await db
  .getSchema('openhome')
  .getTable('currency_shop')
  .select()
  .execute()
  .then((result) => result.fetchAll())
  .catch((e) => e);

  db.close();

  return shopItems;
}