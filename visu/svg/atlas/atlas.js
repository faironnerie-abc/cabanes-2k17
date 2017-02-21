'use strict;'

const fs = require('fs');
const colors = require('../../src/colors.json').colors;
const cabins = require('../../../modeles/data/cabins.json').cabins;
const stripes  = require('../../../modeles/decret2/colors.json').colors;
const chunks = require('../../../modeles/data/chunks.json').chunks;

const A = 11 * 16;
const WIDTHS = [1, 3, 5, 7, 9, 11];
const LW = 0.2;
const FSL = 21 * 4 / 3;
const FST = 48 * 4 / 3;
const COLS = 21;
const X0 = 2150;
const Y0 = 1590;

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="4500mm" height="2800mm">\n');
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
}

function writeFace(out, x, y, s1, s2) {
    writeStripe(out, x, y, s1);
    writeStripe(out, x + A / 2, y, s2);
    out.write(`<rect x="${x}" y="${y}" width="${A}" height="${A}" fill="none" stroke="black" stroke-width="${LW}"/>\n`);
}

function writeCabin(out, row, col, cab) {
    let s = stripes[cab.id].stripes;
    let x = 4 * A * col;
    let y = 1.5 * A * row;
    for (let i = 0; i < 4; i++) {
        writeFace(out, x + A * i, y, s[2 * i], s[2 * i + 1]);
    }
    out.write(`<text text-anchor="start" font-family="Courier" font-size="${FSL}" x="${x}" y="${y + A + FSL}">${cab.id}</text>\n`);
    if (cab.text) {
        out.write(`<text text-anchor="start" font-family="Courier" font-size="${FST}" letter-spacing="5.5" x="${x}" y="${y - FSL / 2}">${cab.text}</text>\n`);
    }
}

function writeAll(out) {
    writeHeader(out);
    out.write(`<g transform="translate(${X0}, ${Y0})">\n`);
    let row = 0;
    let col = 0;
    cabins.forEach(cab => {
        writeCabin(out, row, col, cab);
        col++;
        if (col == COLS) {
            row++;
            col = 0;
        }
    });
    out.write('</g>\n');
    writeFooter(out);
}

function distributeChunks() {
    let start = 0;
    chunks.forEach(chunk => {
        let t = chunk.text;
        let col = start % COLS;
        let chars = (COLS - col) * 16;
        if (chars < t.length) {
            while (t.charAt(chars) != ' ') chars--;
            cabins[start + COLS - col].text = t.substr(chars + 1);
            t = t.substr(0, chars);
        }
        cabins[start].text = t;
        start += chunk.count;
    });
}

distributeChunks();
let out = fs.createWriteStream('test.svg');
writeAll(out);
