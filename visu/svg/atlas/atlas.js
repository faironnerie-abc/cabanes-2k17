'use strict;'

const fs = require('fs');
const colors = require('../../src/colors.json').colors;
const cabins = require('../../../modeles/data/cabins.json').cabins;
const stripes  = require('../../../modeles/decret2/colors.json').colors;
const chunks = require('../../../modeles/data/chunks.json').chunks;

const A = 11 * 16;
const WIDTHS = [1, 3, 5, 7, 9, 11];
const LW = 1;
const FSL = 15 * 4 / 3;
const FST = 18 * 4 / 3;

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
    out.write(`<rect x="${x}" y="${y}" width="${A}" height="${A}" fill="none" stroke="black" stroke-width="${LW}" />\n`);
}

function writeCabin(out, x, y, cab, vertical) {
    let s = stripes[cab.id].stripes;
    for (let i = 0; i < 4; i++) {
        writeFace(out, x + A * i, y, s[2 * i], s[2 * i + 1]);
    }
    if (vertical)
        out.write(`<text text-anchor="middle" font-family="Courier" font-size="${FSL}" transform=" translate(${x - FSL / 2} ${y + A / 2}) rotate(-90)">${cab.id}</text>\n`);
    else
        out.write(`<text text-anchor="start" font-family="Courier" font-size="${FSL}" x="${x}" y="${y + A + FSL}">${cab.id}</text>\n`);
}

function writeGroupV(out, x, y, start, chunk) {
    for (let i = 0; i < chunk.count; i++) {
        writeCabin(out, x, y + A * i, cabins[start + i], true);
    }
    out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FST}" x="${x + 2 * A}" y="${y - FSL / 2}">${chunk.text}</text>\n`)
}

function writeGroupH(out, x, y, start, chunk) {
    for (let i = 0; i < chunk.count; i++) {
        writeCabin(out, x + 4 * A * i, y, cabins[start + i], false);
    }
    out.write(`<text text-anchor="start" font-family="Courier" font-weight="bold" font-size="${FST}" x="${x}" y="${y - FSL / 2}">${chunk.text}</text>\n`)
}

function writeAllV(out) {
    let maxH = 60;
    writeHeader(out);
    let x = 100;
    let h = 0;
    let start = 0;
    for (let c = 0; c < chunks.length; c++) {
        if (h + chunks[c].count > maxH) {
            h = 0;
            x += 5 * A;
        }
        writeGroupV(out, x, 100 + A * h, start, chunks[c]);
        h += chunks[c].count + 1;
        start += chunks[c].count;
    }
    writeFooter(out);
}

function writeAllH(out) {
    let maxW = 96;
    writeHeader(out);
    let y = 100;
    let w = 0;
    let start = 0;
    for (let c = 0; c < chunks.length; c++) {
        if (w + 4 * chunks[c].count > maxW) {
            w = 0;
            y += 1.5 * A;
        }
        writeGroupH(out, 100 + A * w, y, start, chunks[c]);
        w += 4 * chunks[c].count + 1;
        start += chunks[c].count;
    }
    writeFooter(out);
}

let out = fs.createWriteStream('test.svg');
writeAllV(out);
//writeHeader(out);
//writeGroupH(out, 50, 30, 0, chunks[0]);
//writeFooter(out);
