const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function getShopItem(item) {
  const db = (await database()).session;

  const shopItem = await db
  .getSchema('openhome')
  .getTable('currency_shop')
  .select()
  .where('item = :item')
  .bind('item', item)
  .execute()
  .then((result) => result.fetchOne())
  .catch((e) => e);

  db.close();
  return shopItem;
}