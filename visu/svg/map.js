// test if cabin generation produces correct map

'use strict';

const fs = require('fs');
const cabins = require('../../modeles/data/cabins.json').cabins;
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
        out.write(`<g transform="translate(${c.x} ${c.y}) rotate(${-c.angle})">\n`)
        out.write(`<rect x="-1" y="-1" width="2" height="2" fill="none" stroke="black" stroke-width="${stroke}" />\n`);
        out.write(`<text x="0" y="0.9" text-anchor="middle" font-family="Courier" font-size="0.5" transform="rotate(${-90 * c.door})">${c.id}</text>"\n`);
        out.write('</g>\n');
    });
    out.write('</svg>\n');
    out.end();

}

let out = fs.createWriteStream('map.svg');
writeMap(out);
