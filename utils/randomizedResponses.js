const _ = require('lodash');
const { database } = require('../config')

function walkResponses(species, cost, xp) {
    species = species.toLowerCase();
    // - You took your pet for a walk...
    let min = Math.round(5);
    let max = Math.round(80);

    if(Math.floor(Math.random()) === 0) {
        min = 5;
        max = 30;
    } else {
        min = 5;
        max = 80;
    }

    if(cost > 300) {
        min = 5;
        max = 80;
    }

    if(cost > 700) {
        min = 20;
        max = 100;
    }

    if(cost >= 1000) {
        min = 50;
        max = 175;
    }
    
    const ranNum = Math.round(Math.random() * (max - min) + min)
    const texts = [
        { response: `Your ${species} found a box next to a tree. In it contained <:crystal:769280106270687273>${ranNum} crystals!\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} found a friend on your walk!\r\nIts new friend shared <:crystal:769280106270687273>${ranNum} crystals with you!\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} was walking along a path and saw something shiny on the ground. <:crystal:769280106270687273>${ranNum} crystals! They've been added to your inventory!\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} found a secret room and inside was <:crystal:769280106270687273>${ranNum} crystals\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} found <:crystal:769280106270687273>${ranNum} crystals hidden in the bushes on a trail! \r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} went for a drink in a stream and noticed some crystals sparkling at the bottom. \r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `On a walk, your ${species} found <:crystal:769280106270687273>${ranNum} crystals buried in the dirt!\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `A kind person thought your ${species} was so cute, and gave you <:crystal:769280106270687273>${ranNum} crystals\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum },
        { response: `Your ${species} was walking on the beach and found a bottle! Inside was <:crystal:769280106270687273>${ranNum} crystals\r\n\r\n+<:crystal:769280106270687273>${ranNum} Crystals\r\n+${xp} XP`, reward: ranNum }
    ];
    return texts[Math.round(Math.random() * (texts.length - 1) + 0)];
}

function trainResponses(species, xp) {
    const texts = [
        { response: `+${xp} XP` }
    ];
    return texts[Math.round(Math.random() * (texts.length - 1) + 0)];
}

module.exports = { 
    walkResponses,
    trainResponses
}