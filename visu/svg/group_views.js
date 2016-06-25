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
const pad = 10;
const stroke = 'black';
const strokeWidth = 0.5;

const widths = [2, 3, 5, 7, 9, 11];

function writeGroup(fileName, stripes) {
    let count = stripes.length / 2;
    let width = pad + count * cWidth + (count - 1) * gap + pad;
    let height = pad + cHeight + pad;
    let out = fs.createWriteStream(fileName);
    out.write(`<svg width="${width}" height="${height}">\n`);
    let x = pad;
    for (let i = 0; i < stripes.length; i++) {
        let w = Math.floor(stripes[i] / 10);
        let c = stripes[i] % 10;
        let cWidth = pWidth * widths[w] / 11;
        let offset = (pWidth - cWidth) / 2;
        out.write(`<rect x="${x + offset}" y="${pad}" width="${cWidth}" height="${cHeight}" fill="${colors[c]}" />\n`)
        out.write(`<rect x="${x}" y="${pad}" width="${pWidth}" height="${cHeight}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />\n`);
        x += pWidth;
        if (i % 2 == 1) x += gap;
    }
    out.write('</svg>\n');
    out.end();
}

function writeGroups() {
    let startIndex = 0;
    groups.forEach(g => {
        let gs = [];
        for (let i = 0; i < g.count; i++) {
            let s = stripes[cabins[startIndex + i].id].stripes;
            gs.push(s[0], s[1]);
        }
        let fileName = `${g.id}-front.svg`;
        console.log("Writing ", fileName);
        writeGroup(fileName, gs);
        gs = [];
        for (let i = g.count - 1; i >= 0; i--) {
            let s = stripes[cabins[startIndex + i].id].stripes;
            gs.push(s[4], s[5]);
        }
        fileName = `${g.id}-back.svg`;
        console.log("Writing ", fileName);
        writeGroup(fileName, gs);
        startIndex += g.count;
    });
}

// writeGroup('test.svg', [0, 11, 22, 33, 44, 55, 6, 17, 28, 39]);
writeGroups();
