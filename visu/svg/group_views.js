'use strict';

const fs = require('fs');

const groups = require('../../modeles/data/groups.json').groups;
const cabins = require('../../modeles/data/all_cabins.json').cabins;
const stripes  = require('../../modeles/decret2/colors.json').colors;
const colors = require('../src/colors.json').colors;
const chunks = require('../../modeles/decret2/chunks.json').chunks;

const cWidth = 44;
const pWidth = cWidth / 2;
const cHeight = cWidth
const gap = 2;
const lGap = 6;
const yGap = 36;
const fontSize = 15;

const widths = [2, 3, 5, 7, 9, 11];

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm">\n');
}

function writeFooter(out) {
    out.write('</svg>\n');
    out.end();
}

function writeGroup(out, x, y, stripes, label, chunks) {
    out.write('  <g>\n');
    out.write(`    <rect x="${x}" y="${y}" width="${2 * cWidth}" height="${cHeight}" fill="none" stroke="none" />\n`)
    out.write(`    <text x="${x + 2 * cWidth - lGap}" y="${y + (cHeight - fontSize) / 2 + fontSize}" text-anchor="end" font-family="sans-serif" font-size="15">${label}</text>\n`);
    let currentX = x + 2 * cWidth;
    if (chunks) {
        for (let c = 0; c < chunks.length; c++) {
            let dx = chunks[c].count * (cWidth + gap) - gap;
            out.write(`    <path d="M ${currentX} ${y - lGap - fontSize} v ${fontSize}" stroke="#808080" stroke-width="0.5"/>\n`);
            out.write(`    <path d="M ${currentX + dx} ${y - lGap - fontSize} v ${fontSize}" stroke="#808080" stroke-width="0.5"/>\n`);
            out.write(`    <text x="${currentX + dx / 2}" y="${y - lGap}" text-anchor="middle" font-family="sans-serif" font-size="15">${chunks[c].text}</text>\n`);
            currentX += dx + gap;
        }
    }
    currentX = x + 2 * cWidth;
    for (let i = 0; i < stripes.length; i++) {
        let w = Math.floor(stripes[i] / 10);
        let c = stripes[i] % 10;
        let sWidth = pWidth * widths[w] / 11;
        let offset = (pWidth - sWidth) / 2;
        out.write(`    <rect x="${currentX + offset}" y="${y}" width="${sWidth}" height="${cHeight}" fill="${colors[c]}" />\n`);
        out.write(`    <rect x="${currentX}" y="${y}" width="${pWidth}" height="${cHeight}" fill="none" stroke="black" stroke-width="0.5" />\n`);
        currentX += pWidth;
        if (i % 2 == 1) currentX += gap;
    }
    out.write('  </g>\n');
}

function startIndex(group) {
    let start = 0;
    for (let g = 0; g < group; g++) start += groups[g].count;
    return start;
}

function getFront(g) {
    let start = startIndex(g);
    let front = [];
    for (let i = 0; i < groups[g].count; i++) {
        let s = stripes[cabins[start + i].id].stripes;
        front.push(s[0], s[1]);
    }
    return front;
}

function getRear(g) {
    let start = startIndex(g);
    let rear = [];
    for (let i = groups[g].count - 1; i >= 0; i--) {
        let s = stripes[cabins[start + i].id].stripes;
        rear.push(s[4], s[5]);
    }
    return rear;
}

function yInkscape(y) {
    return 1052.3622 - y - cHeight - 0.25;
}

function page1() {
    let out = fs.createWriteStream('p1.svg');
    writeHeader(out);
    let xf = [276, 640, 0, 640, 0, 920, 0, 0];
    let yf = [700, 700, 630, 630, 560, 560, 490, 420];
    let xr = [740, 0, 740, 0, 510, 0, 0, 0];
    let yr = [40, 40, 110, 110, 180, 180, 250, 320];
    for (let g = 0; g < 8; g++) {
        writeGroup(out, xf[g], yInkscape(yf[g]), getFront(g), `${groups[g].id} (F)`, chunks[groups[g].id]);
        writeGroup(out, xr[g], yInkscape(yr[g]), getRear(g), `${groups[g].id} (R)`);
    }
    out.write(` <path d="M 40 ${1052.3622 - 400} h 1400" stroke="#808080" stroke-width="1" />\n`);
    writeFooter(out);
}

function page2() {
    let out = fs.createWriteStream('p2.svg');
    writeHeader(out);
    for (let i = 0; i < 6; i++) {
        let g = 8 + i;
        writeGroup(out, 0, yInkscape(90 + 80 * i), getFront(g), `${groups[g].id} (F)`, chunks[groups[g].id]);
        writeGroup(out, 650, yInkscape(490 - 80 * i), getRear(g), `${groups[g].id} (R)`);
    }
    writeFooter(out);
}

function pageOther(gStart, fileName) {
    let out = fs.createWriteStream(fileName);
    writeHeader(out);
    for (let i = 0; i < 6; i++) {
        let g = gStart + i;
        writeGroup(out, 0, yInkscape(550 + 80 * i), getFront(g), `${groups[g].id} (F)`, chunks[groups[g].id]);
        writeGroup(out, 0, yInkscape(440 - 80 * i), getRear(g), `${groups[g].id} (R)`);
    }
    out.write(` <path d="M 30 ${1052.3622 - 530} h 1420" stroke="#808080" stroke-width="1" />\n`);
    writeFooter(out);
}


// page1();
// page2();
// for (let p = 0; p < 4; p++) {
//     pageOther(14 + 6 * p, `p${p + 3}.svg`);
// }

console.log(startIndex(8));
