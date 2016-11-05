'use strict';

const fs = require('fs');

const GROUPS = require('./groups.json').groups;
const xj = require("xls-to-json");
let cabins = [];

function createCabins() {
    GROUPS.forEach(g => {
        let alpha = -g.angle * Math.PI /180;
        let r = 0;
        for (let i = 0; i < g.cabids.length; i++) {
            let cab = {
                id: g.id + '/' + g.cabids[i],
                x: r * Math.cos(alpha) + g.x,
                y: r * Math.sin(alpha) + g.y,
                angle: g.angle,
                door: g.doors[i]
            };
            if (g.gaps[i]) cab.leftGap = true;
            if (g.gaps[i + 1]) cab.rightGap = true;
            cabins.push(cab);
            r += 2 + g.gaps[i + 1];
        }
    });
}

function addParticipants(callback) {
    xj({
        input: "participants.xls",
        output: null,
        sheet: "Feuille1"
    }, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        let m = {};
        result.forEach((v, k) => {
            if (v["REPONSE"].toUpperCase() === "OUI") {
                let id = v["RANG"] + '/' + v["NUMERO"];
                m[id] = true;
            }
        });
        console.log(`${cabins.length} cabins / ${Object.keys(m).length} participants`);
        cabins.forEach((v, k) => {
            if (m[v.id]) {
                v.paint = true;
            }
        });
        callback();
    });
}

function writeCabins() {
    let out = fs.createWriteStream('cabins.json');
    out.write(JSON.stringify({cabins: cabins}));
    out.write('\n');
    out.end();
    console.log('data written in cabins.json');
}


createCabins();
addParticipants(writeCabins);
