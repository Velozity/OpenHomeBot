const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');

const _badWords = ['nigga', 'nigger', 'cunt', 'n1gger', 'faggot', 'fag', 'cock', 'placenta', 'fingering', 'nigg4s', 'n1gg4s', 'cunt', 'clit', 'phaggot', 'phag', 'cumslut']
  
module.exports = function badWords() {
    return _badWords;
}
