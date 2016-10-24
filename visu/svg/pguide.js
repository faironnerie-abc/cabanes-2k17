'use strict;'

const fs = require('fs');
// const colors = require('../src/colors.json').colors;

const colors = [
    "#ef3340", // rouge
    "#ff9000", // orange (plus clair)
    "#f6e500", // jaune
    "#78be20", // vert
    "#008fb3", // bleu (plus foncé)
    "#894fd1", // violet (plus clair)
    "#aeeffc", // bleu clair (plus clair)
    "#ecc7cd", // rose pale
    "#919d9d", // gris clair
    "#3f4444"  // gris anthracite
]

const cabins = require('../../modeles/data/all_cabins.json').cabins;
const stripes  = require('../../modeles/decret2/colors.json').colors;

const colorNames = ['rouge', 'orange', 'jaune', 'vert', 'bleu', 'violet', 'bleu clair', 'rose pale', 'gris clair', 'gris anthracite'];

const A = 44;
const WIDTHS = [1, 3, 5, 7, 9, 11];
const FSW = 9 * 1.25;
const GAP = 2;

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm">\n');
}

function writeFooter(out) {
    out.write('</svg>\n');
    out.end();
}

function writeFace(out, s1, s2) {
    if (s1 >= 0) {
        let w = Math.floor(s1 / 10);
        let c = s1 % 10;
        let sw = A / 2 * WIDTHS[w] / WIDTHS[5];
        out.write(`<rect x="${(A / 2 - sw) / 2}" y="0" width="${sw}" height="${A}" fill="${colors[c]}"/>\n`);
        out.write(`<text x="${A / 4}" y="${A + FSW / 1.25}" text-anchor="middle" font-family="Courier" font-size="${FSW}">${9 * WIDTHS[w]}</text>\n`)
    }
    out.write(`<rect x="0" y="0" width="${A/2}" height="${A}" fill="none" stroke="black" stroke-width="0.5" />\n`);
    if (s2 >= 0) {
        let w = Math.floor(s2 / 10);
        let c = s2 % 10;
        let sw = A / 2 * WIDTHS[w] / WIDTHS[5];
        out.write(`<rect x="${A / 2 + (A / 2 - sw) / 2}" y="0" width="${sw}" height="${A}" fill="${colors[c]}"/>\n`);
        out.write(`<text x="${A / 2 + A / 4}" y="${A + FSW / 1.25}" text-anchor="middle" font-family="Courier" font-size="${FSW}">${9 * WIDTHS[w]}</text>\n`)

    }
    out.write(`<rect x="${A / 2}" y="0" width="${A/2}" height="${A}" fill="none" stroke="black" stroke-width="0.5" />\n`);
}

function getS(s, participate, only) {
    if (!participate) return -1;
    if (only == -1) return s;
    return s % 10 == only ? s : -1;
}

// revoir cette fonction après la refonte des json des cabanes
function writeCabin(out, id, stripes, show, participate, only, door) {
    out.write(`<rect x="0" y="0" width="${A}" height="${A}" fill="none" stroke="black" stroke-width="0.5" />\n`);
    out.write(`<text x="${A / 2}" y="${A - 2}" text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="rotate(${-90 * door} ${A / 2} ${A / 2})">${id}</text>\n`)

    transforms = [`translate(0, ${A})`, `translate(${A} ${A}) rotate(-90)`, `translate(${A} 0) rotate(180)`, `rotate(90)`];
    for (let i = 0; i < 4; i++) {
        if (show[i]) {
            out.write(`<g transform="${transforms[i]}">\n`);
            writeFace(out, getS(stripes[2 * i], participate, only), getS(stripes[2 * i + 1], participate, only));
            out.write('</g>\n');
        }
    }
}

function writeRow(fileName, epi, ids, participate, doors, start, only) {
    let out = fs.createWriteStream(fileName);
    writeHeader(out);

    if (epi) {
        out.write(`<text x="526" y="${372 - 5 * A}" text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}">= promenade =</text>\n`);
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(526 ${372 + 5 * A}) rotate(180)">~ mer ~</text>\n`);
    } else {
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(30 372) rotate(-90)">= promenade =</text>\n`);
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(1022 372) rotate(90)">~ mer ~</text>\n`);
    }
    let count = ids.length;
    let col = only == -1 ? 'toutes les couleurs' : `couleur ${only + 1} (${colorNames[only]})`;
    let title = `${ids[0]} > ${ids[count - 1]} : ${col}`;
    out.write(`<text text-anchor="left" font-family="Courier" font-weight="bold" font-size="${2 * FSW}" transform="translate(30 ${2 * FSW + 60})">${title}</text>\n`);
    out.write(`<line x1="30" y1="${2 * FSW + 60 + 10}" x2="1022" y2="${2 * FSW + 60 + 10}" stroke="black"/>\n`);
    title = `${ids[count - 1]} > ${ids[0]} : ${col}`;
    out.write(`<text text-anchor="left" font-family="Courier" font-weight="bold" font-size="${2 * FSW}" transform="translate(1022 ${-2* FSW + 744 - 60}) rotate(180)">${title}</text>\n`);
    out.write(`<line x1="30" y1="${744 - 2 * FSW - 60 - 10}" x2="1022" y2="${744 - 2 * FSW - 60 - 10}" stroke="black"/>\n`);

    let x = (1052 - (count * A + (count - 1) * GAP)) / 2;
    let y1 = 372 + 2 * A;
    let y2 = 372 - 3 * A;
    for (let i = 0; i < count; i++) {
        out.write(`<g transform="translate(${x}, ${y1})">\n`);
        writeCabin(out, ids[i], stripes[cabins[start + i].id].stripes, [true, i == count - 1, true, i == 0], participate[i], only, doors[i]);
        out.write('</g>\n');
        out.write(`<g transform="translate(${x}, ${y2})">\n`);
        writeCabin(out, ids[i], stripes[cabins[start + i].id].stripes, [true, i == count - 1, true, i == 0], participate[i], -1, doors[i]);
        out.write('</g>\n');
        x += A + GAP;
    }
    writeFooter(out);
}

// writeRow('test.svg', true,
//     ['E5/12', 'E5/11', 'E5/10', 'E5/9', 'E5/8', 'E5/7', 'E5/6', 'E5/5', 'E5/4', 'E5/3', 'E5/2', 'E5/1'],
//     [true, true, false, false, true, true, true, true, false, true, true, true],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     6, 0
// );

for (let c = 0; c < 10; c++) {
    writeRow(`a${c < 9 ? '0' : ''}${c + 1}.svg`, true,
        ['E5/12', 'E5/11', 'E5/10', 'E5/9', 'E5/8', 'E5/7', 'E5/6', 'E5/5', 'E5/4', 'E5/3', 'E5/2', 'E5/1'],
        [false, true, false, false, true, true, true, true, false, true, true, false],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        6, c
    );
}

for (let c = 0; c < 10; c++) {
    writeRow(`b${c < 9 ? '0' : ''}${c + 1}.svg`, false,
        ['R27/0', 'R27/1', 'R27/2', 'R27/3', 'R27/4', 'R27/5', 'R27/6', 'R27/7', 'R27/8', 'R27/9'],
        [true, true, false, false, true, true, true, false, true, false],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        590, c
    );
}

for (let c = 0; c < 10; c++) {
    writeRow(`c${c < 9 ? '0' : ''}${c + 1}.svg`, false,
        ['R27/10', 'R27/11', 'R27/12', 'R27/13', 'R27/14', 'R27/15', 'R27/16', 'R27/17', 'R27/18', 'R27/19', 'R27/20', 'R27/21', 'R27/22', 'R27/23', 'R27/24', 'R27/25', 'R27/26'],
        [false, true, true, false, true, true, false, true, true, true, true, true, true, false, true, false, true],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        600, c
    );
}
