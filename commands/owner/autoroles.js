/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  database, config
} = require('../../config');
const { sendTransEmbed, sendEmbed, sendReply } = require('../../utils');
const fs = require('fs');
const moment = require('moment');
const { timeStamp } = require('console');

/** Crisis */
class Autoroles extends Chariot.Command {
  constructor() {
    super();

    this.name = 'autoroles';
    this.allowDMs = false;
    this.cooldown = 2;
    this.aliases = ['ar'];
    this.subcommands = ['add', 'remove'];
    this.help = {
      message: 'Auto role commands',
      usage: 'autoroles',
      example: ['autoroles'],
      visible: false
    };
  }

  /**
      * Precondition testing method. This method will run BEFORE the main command logic.
      * Once every test passed, next() MUST be called, in order to run the main command logic!
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      * @param {Function} next Marking testing as done, invoking the main command executor
      */
  async runPreconditions(message, args, chariot, next) {
    if(config.staff.owner.includes(message.member.id))
      next();
    else 
      return;
  }

  async add(message, args) {
    if(message.roleMentions.length === 0) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'You must specify atleast 1 role to add to the auto roles');
      return;
    }

    const db = (await database()).session;

    const addedRoles = [];
    const failedRoles = [];
    await Promise.all(message.roleMentions.map(async (role) => { 
      const res = await db
      .getSchema('openhome')
      .getSession(async (session) => await session.getSession())
      .sql(`INSERT INTO openhome.autoroles (\`role_id\`) VALUES ('${role}');`)
      .execute()
      .then((res) => res.getAffectedItemsCount())
      .catch((e) => {
        console.log(e)
        failedRoles.push(role);
      })

      if(res > 0) {
        addedRoles.push(role)
      }
    }));

    db.close();
    if(failedRoles.length > 0) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'Some roles could not be added, maybe they already exist?\n' +
        failedRoles.map((role) => `<@&${role}>`).join(', '));
    }

    if(addedRoles.length > 0) {
      sendEmbed(message.channel,
        'GREEN',
        'Success',
        'Members will get the following roles on join:\n' +
        addedRoles.map((role) => `<@&${role}>`).join(', '))
    }
  }

  async remove(message, args) {
    if(message.roleMentions.length === 0) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'You must specify atleast 1 role to remove from auto roles');
      return;
    }

    const db = (await database()).session;

    const removedRoles = [];
    const failedRoles = [];
    await Promise.all(message.roleMentions.map(async (role) => { 
      const res = await db
      .getSchema('openhome')
      .getSession(async (session) => await session.getSession())
      .sql(`DELETE FROM openhome.autoroles WHERE (\`role_id\` = '${role}');;`)
      .execute()
      .then((res) => res.getAffectedItemsCount())
      .catch((e) => {
        console.log(e)
        failedRoles.push(role);
      })

      if(res > 0) {
        removedRoles.push(role)
      }
    }));

    db.close();
    if(failedRoles.length > 0) {
      sendEmbed(message.channel,
        'RED',
        'Error',
        'Some roles could not be removed, do they exist?\n' +
        failedRoles.map((role) => `<@&${role}>`).join(', '));
    }

    if(removedRoles.length > 0) {
      sendEmbed(message.channel,
        'GREEN',
        'Success',
        'The following roles have been removed from auto roles:\n' +
        removedRoles.map((role) => `<@&${role}>`).join(', '))
    }
  }
  /**
      * Main method running after passing preconditions
      * @param {object} message An Eris.Message object emitted from Eris
      * @param {string[]} args An array containing all provided arguments
      * @param {object} chariot The main bot client.
      */
  async execute(message, args, chariot) {
    const db = (await database()).session;

    const res = await db
    .getSchema('openhome')
    .getSession(async (session) => await session.getSession())
    .sql(`SELECT role_id FROM openhome.autoroles`)
    .execute()
    .then((res) => res.fetchAll())
    .catch((e) => e);

    db.close();
    if(res.length > 0)
      sendEmbed(message.channel,
        'GREEN',
        'Success',
        'Members get the following roles on join:\n' +
        res.map((r) => `<@&${r}>`).join(', '))
    else 
      sendEmbed(message.channel,
        'GREEN',
        'Success',
        'No auto roles have been defined')

  }
}

module.exports = new Autoroles();
