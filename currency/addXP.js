const _ = require('lodash');
const { database, config } = require('../config')

module.exports = async function addXP(petId, xp) {
    const db = (await database()).session;

    const setBalance = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`UPDATE openhome.currency_ownedpets SET xp = xp + ${xp} WHERE (id='${id}');`)
    .execute()
    .catch((e) => e);

    db.close();
    if (setBalance instanceof Error) {
      return false;
    } else {
      return true;
    }
}