const Chariot = require('chariot.js');

class Discord extends Chariot.Client {
  constructor() {
    super(new Chariot.Config(
      process.env.DISCORD_TOKEN,
      {
        prefix: '!',
        defaultHelpCommand: false,
        primaryColor: 'BLUE',
        owner: [
          '224379198255529984', // Velo
        ],
      },
      {
        getAllUsers: false,
      },
    ));
  }
}

module.exports = new Discord();
