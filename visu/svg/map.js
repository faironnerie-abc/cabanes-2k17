// test if cabin generation produces correct map

'use strict';

const fs = require('fs');
const cabins = require('../../modeles/data/cabins.json').cabins;
const groups = require('../../modeles/data/groups.json').groups;
const WIDTH = 440; // in cm
const STROKE = 0.5; // in px

function writeMap(out) {
    let xMin = cabins[0].x;
    let xMax = xMin;
    let yMin = cabins[0].y;
    let yMax = yMin;
    cabins.forEach(cab => {
        if (cab.x < xMin) xMin = cab.x;
        if (cab.x > xMax) xMax = cab.x;
        if (cab.y < yMin) yMin = cab.y;
        if (cab.y > yMax) yMax = cab.y;
    });
    xMin = Math.round(xMin) - 1;
    xMax = Math.round(xMax) + 1;
    yMin = Math.round(yMin) - 1;
    yMax = Math.round(yMax) + 1;
    console.log(xMin, xMax, yMin, yMax);
    let height = WIDTH * (yMax - yMin) / (xMax - xMin);
    console.log(height);
    let stroke = STROKE * 2.54 * (xMax - xMin) / 96 / WIDTH;
    console.log(stroke);


    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}cm" height="${height}cm" viewBox="${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}">\n`);
    cabins.forEach(c => {
        let nb = c.id.substring(c.id.indexOf('/') + 1);
        out.write(`<g transform="translate(${c.x} ${c.y}) rotate(${-c.angle})">\n`);
        let fill = c.paint ? "#919d9d" : "none"
        out.write(`<rect x="-1" y="-1" width="2" height="2" fill="${fill}" stroke="black" stroke-width="${stroke}" />\n`);
        out.write(`<text x="0" y="2" text-anchor="middle" font-family="Courier" font-size="1" transform="rotate(${-90 * c.door})">${nb}</text>"\n`);
        out.write('</g>\n');
    });

    groups.forEach(g => {
        let alpha = -g.angle * Math.PI /180;
        let x = g.x - 2 * Math.cos(alpha);
        let y = g.y - 2.5 * Math.sin(alpha);
        let angle = g.id.startsWith('R') ? 0 : -g.angle;
        out.write(`<text x="${x}" y="${y}" transform="rotate(${angle} ${x} ${y})" text-anchor="middle" font-family="Courier" font-size="1">${g.id}</text>\n`);
    });

    out.write('</svg>\n');
    out.end();

}

let out = fs.createWriteStream('map.svg');
writeMap(out);
