'use strict;'

const fs = require('fs');
const colors = require('../../src/colors.json').colors;
const cabins = require('../../../modeles/data/cabins.json').cabins;
const stripes  = require('../../../modeles/decret2/colors.json').colors;
const chunks = require('../../../modeles/data/chunks.json').chunks;


function mm2px(mm) {
    return mm * 96 / 25.4;
}

const H = mm2px(6.7);
const W = mm2px(6.7);
const LS = mm2px(4.3);

const WIDTHS = [1, 3, 5, 7, 9, 11];
const LW = 0.1;
const FSL = 4 * 4 / 3;
const FST = 8 * 4 / 3;
const COLS = 12;
const X0 = 0;
const Y0 = 0;
const ALLCOLORS = true;

const LETTER_SPACING = 2.05;
const LETTERS_PER_CABIN = 12;

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="340mm" height="240mm">\n');
}

function writeFooter(out) {
    out.write('</svg>\n');
    out.end();
}

function writeStripe(out, x, y, s) {
    let w = Math.floor(s / 10);
    let c = s % 10;
    let sw = W / 2 * WIDTHS[w] / WIDTHS[5];
    out.write(`<rect x="${x + (W / 2 - sw) / 2}" y="${y}" width="${sw}" height="${H}" fill="${colors[c]}"/>\n`);
}

function writeFace(out, x, y, s1, s2, stripes) {
    if (stripes) {
        writeStripe(out, x, y, s1);
        writeStripe(out, x + W / 2, y, s2);
    }
    out.write(`<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="none" stroke="black" stroke-width="${LW}"/>\n`);
}

function writeCabin(out, row, col, cab) {
    let s = stripes[cab.id].stripes;
    let x = 4 * W * col;
    let y = (H + LS) * row;
    let show = [true, cab.rightGap, true, cab.leftGap];
    out.write('<g>\n');
    for (let i = 0; i < 4; i++) {
        let stripes = ALLCOLORS || (cab.paint && show[i]);
        writeFace(out, x + W * i, y, s[2 * i], s[2 * i + 1], stripes);
    }
    out.write(`<text text-anchor="start" font-family="Courier" font-size="${FSL}" x="${x}" y="${y + H + FSL}">${cab.id}</text>\n`);
    out.write('</g>\n');
    if (cab.text) {
        let ltm = (COLS / 2 - col) * LETTERS_PER_CABIN;
        if (col < COLS / 2 && cab.text.length > ltm) {
            out.write(`<text text-anchor="start" font-family="Courier" font-size="${FST}" letter-spacing="${LETTER_SPACING}" x="${x}" y="${y - FST / 4}">${cab.text.substr(0, ltm)}</text>\n`);
            out.write(`<text text-anchor="start" font-family="Courier" font-size="${FST}" letter-spacing="${LETTER_SPACING}" x="${COLS / 2 * 4 * W}" y="${y - FST / 4}">${cab.text.substr(ltm)}</text>\n`);
        } else {
            out.write(`<text text-anchor="start" font-family="Courier" font-size="${FST}" letter-spacing="${LETTER_SPACING}" x="${x}" y="${y - FST / 4}">${cab.text}</text>\n`);
        }
    }
}

function writeAll(out) {
    writeHeader(out);
    out.write(`<g transform="translate(${X0}, ${Y0})">\n`);
    let row = 0;
    let col = 0;
    cabins.forEach(cab => {
        if (row >= 40) writeCabin(out, row, col, cab);
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
        let chars = (COLS - col) * LETTERS_PER_CABIN;
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
