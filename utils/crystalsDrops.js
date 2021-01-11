const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');

let _crystalDrop = {};
let _running = false;

function setRunning(i) {
    _running = i;
}

function getRunning() {
    return _running;
}

function setCrystalDrop(crystalDrop) {
    _crystalDrop = crystalDrop;
};

function getCrystalDrop() {
    return _crystalDrop;
};

var _milestones = [];
function getMilestones() {
    return _milestones;
}

function addMilestone(milestone) {
    _milestones.push(milestone);
}
  
module.exports = {
    setCrystalDrop,
    getCrystalDrop,
    setRunning,
    getRunning,
    getMilestones,
    addMilestone
}
