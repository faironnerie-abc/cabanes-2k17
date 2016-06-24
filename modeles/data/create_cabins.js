'use strict';

const GROUPS = require('./groups.json').groups;

var cabins = [];

function createCabins() {
    GROUPS.forEach(g => {
        let alpha = -g.angle * Math.PI /180;
        for (var i = 0; i < g.count; i++) {
            cabins.push({
                id: g.id + '-' + i,
                x: 2 * i * Math.cos(alpha) + g.x,
                y: 2 * i * Math.sin(alpha) + g.y,
                angle: g.angle,
            });
        }

    });
}

createCabins();
console.log(JSON.stringify({cabins: cabins}));
