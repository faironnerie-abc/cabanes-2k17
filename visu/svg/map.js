// test if cabin generation produces correct map

'use strict';

const fs = require('fs');
const cabins = require('../../modeles/data/all_cabins.json').cabins;
const A = 44;
const FSW = 9 * 1.25;

function writeMap(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm">\n');
    cabins.forEach(c => {
        out.write(`<g transform="translate(${A / 2 * c.x} ${A / 2 * c.y}) rotate(${-c.angle})">\n`)
        out.write(`<rect width="${A}" height="${A}" fill="none" stroke="black" stroke-width="0.5" />\n`);
        out.write(`<text x="${A / 2}" y="${A - 2}" text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="rotate(${-90 * c.door} ${A / 2} ${A / 2})">${c.id}</text>"\n`);
        out.write('</g>\n');
    });
    out.write('</svg>\n');
    out.end();
}

let out = fs.createWriteStream('map.svg');
writeMap(out);
