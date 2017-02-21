'use strict;'

const fs = require('fs');
const colors = require('../../src/colors.json').colors;
const cabins = require('../../../modeles/data/cabins.json').cabins;
const stripes  = require('../../../modeles/decret2/colors.json').colors;
const chunks = require('../../../modeles/data/chunks.json').chunks;

const A = 11 * 5;
const WIDTHS = [1, 3, 5, 7, 9, 11];
const LW = 1;
const FSL = 9 * 4 / 3;
const FST = 12 * 4 / 3;

const HPX = 907;
const WPX = 643;
const YTITLE = 96;

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="170mm" height="240mm">\n');
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

function writePage(fName, start, chunk) {
    let out = fs.createWriteStream(fName);
    writeHeader(out);
    let x = (WPX - 4 * A) / 2;
    let y = (HPX - chunk.count * A) / 2;
    for (let c = 0; c < chunk.count; c++) {
        writeCabin(out, x, y, cabins[start + c], true);
        y += A;
    }
    out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FST}" x="${WPX / 2}" y="${YTITLE}">${chunk.text}</text>\n`);
    writeFooter(out);
}

function writeAll() {
    let start = 0;
    for (let i = 0; i < chunks.length; i++) {
        let fName = 'p';
        if (i < 10) fName += '0';
        fName += i + '.svg';
        writePage(fName, start, chunks[i]);
        start += chunks[i].count;
    }
}

//writePage('test.svg', 10, chunks[1]);
writeAll();
