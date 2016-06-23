'use strict';

var groups = [];

function ste_adresse() {
    let count = [6, 14, 12, 14, 18, 9];
    let dist = [15, 13, 13, 9, 9, 5, 0];
    let alpha = -Math.PI / 10;
    let startX = 0;
    for (var i = 0; i < count.length; i++) {

        groups.push({
            id: "S" + (i + 1),
            count: count[i],
            x: startX * Math.cos(alpha) - 208,
            y: startX * Math.sin(alpha) + 50,
            angle: 18
        });
        startX += 2 * count[i] + dist[i];
    }
}

function lh_lines() {
    groups.push({
        id: "L1",
        count: 23,
        x: 0,
        y: 0,
        angle: 0
    });
    groups.push({
        id: "L2",
        count: 27,
        x: 2 * 23 + 11,
        y: 0,
        angle: 0
    });
}

function lh_blocks() {
    let count = [11, 16, 18, 24, 27];
    let dist = [57, 64, 51, 30, 0];
    let yShift = [0, 0, 0.5, 0.5, 8];
    let startX = 2 * 23 + 11 + 2 * 27 + 28;
    for (var i = 0; i < count.length; i++) {
        for (var j = 0; j < 6; j++) {
            groups.push({
                id: "R" + (6 * i + j + 1),
                count: count[i],
                x: startX,
                y: yShift[i],
                angle: -90
            });
            startX += 5;
        }
        startX += dist[i];
    }
}

ste_adresse();
lh_lines();
lh_blocks();
console.log(JSON.stringify({groups: groups}, null, 2));
