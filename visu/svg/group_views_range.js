'use strict';

const fs = require('fs');

const groups = require('../../modeles/data/groups.json').groups;
const cabins = require('../../modeles/data/all_cabins.json').cabins;
const stripes  = require('../../modeles/decret2/colors.json').colors;
const colors = require('../src/colors.json').colors;

const cWidth = 44;
const pWidth = cWidth / 2;
const cHeight = cWidth
const gap = 2;
const lGap = 6;
const yGap = 36;

const widths = [2, 3, 5, 7, 9, 11];

function writeGroup(out, y, stripes, label) {
    out.write('  <g>\n');
    out.write(`    <text x= "0" y = "${y - lGap}" font-family="sans-serif" font-size="15">${label}</text>\n`);
    let x = 0;
    for (let i = 0; i < stripes.length; i++) {
        let w = Math.floor(stripes[i] / 10);
        let c = stripes[i] % 10;
        let sWidth = pWidth * widths[w] / 11;
        let offset = (pWidth - sWidth) / 2;
        out.write(`    <rect x="${x + offset}" y="${y}" width="${sWidth}" height="${cHeight}" fill="${colors[c]}" />\n`);
        out.write(`    <rect x="${x}" y="${y}" width="${pWidth}" height="${cHeight}" fill="none" stroke="black" stroke-width="0.5" />\n`);
        x += pWidth;
        if (i % 2 == 1) x += gap;
    }
    out.write('  </g>\n');
}

function startIndex(group) {
    let start = 0;
    for (let g = 0; g < group; g++) start += groups[g].count;
    return start;
}

function writeGroups(gStart, gEnd, fileName) {
    let height = 2 * (gEnd - gStart) * (cHeight + yGap);
    let width = 30 * (cWidth + gap);
    let out = fs.createWriteStream(fileName);
    out.write(`<svg width="${width}" height="${height}">\n`);
    let y = 0;
    for (let g = gEnd - 1; g >= gStart; g--) {
        let start = startIndex(g);
        let gs = [];
        for (let i = 0; i < groups[g].count; i++) {
            let s = stripes[cabins[start + i].id].stripes;
            gs.push(s[0], s[1]);
        }
        writeGroup(out, y, gs, `${groups[g].id} front`);
        y += cHeight + yGap;
    }

    for (let g = gStart; g < gEnd; g++) {
        let start = startIndex(g);
        let gs = [];
        for (let i = groups[g].count - 1; i >= 0; i--) {
            let s = stripes[cabins[start + i].id].stripes;
            gs.push(s[4], s[5]);
        }
        writeGroup(out, y, gs, `${groups[g].id} rear`);
        y += cHeight + yGap;
    }
    out.write('</svg>\n');
    out.end();
}

writeGroups(32, 38, 'test.svg');
