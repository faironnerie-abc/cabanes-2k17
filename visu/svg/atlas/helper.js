'use strict;'

const fs = require('fs');
const colors = require('../../src/colors.json').colors;
const cabins = require('../../../modeles/data/cabins.json').cabins;
const stripes  = require('../../../modeles/decret2/colors.json').colors;
const chunks = require('../../../modeles/data/chunks.json').chunks;

const A = 11 * 7;
const WIDTHS = [1, 3, 5, 7, 9, 11];
const LW = 0.2;
const FSL = 18 * 4 / 3;
const FST = 51 * 4 / 3;
const COLS = 21;
const X0 = 2150;
const Y0 = 1590;
const ALLCOLORS = true;

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm">\n');
}

function writeFooter(out) {
    out.write('</svg>\n');
    out.end();
}

function writeStripe(out, x, y, s) {
    let w = Math.floor(s / 10);
    let c = s % 10;
    let sw = A / 2 * WIDTHS[w] / WIDTHS[5];
    out.write(`<rect x="${x + (A / 2 - sw) / 2}" y="${y}" width="${sw}" height="${A}" fill="${colors[c]}"/>\n`);
    //out.write(`<rect x="${x}" y="${y}" width="${A / 2}" height="${A}" fill="none" stroke="black" stroke-width="${LW}"/>\n`);
}

function writeFace(out, x, y, s1, s2, stripes) {
    if (stripes) {
        writeStripe(out, x, y, s1);
        writeStripe(out, x + A / 2, y, s2);
    }
    out.write(`<rect x="${x}" y="${y}" width="${A}" height="${A}" fill="none" stroke="black" stroke-width="${LW}"/>\n`);
}


let out = fs.createWriteStream('test.svg');
writeHeader(out);
//for (let c = 0; c < 10; c++) writeStripe(out, (A/2 + 11) * c, 0, 50 + c);
//for (let w = 0; w < 6; w++) writeStripe(out, (A / 2 + 11) * w, 0, 10 * w + 8);
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        let cab = cabins[3 * i + j];
        let s = stripes[cab.id].stripes;
        for (let k = 0; k < 4; k++) {
            writeFace(out, (4 * j + k) * A, i * A, s[2 * k], s[2 * k + 1], true);
        }
    }
}
writeFooter(out);
