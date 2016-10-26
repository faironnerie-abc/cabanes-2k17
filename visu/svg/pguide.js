'use strict;'

const fs = require('fs');
// const colors = require('../src/colors.json').colors;

// modified colors for better view
const colors = [
    "#ef3340", // rouge
    "#ff9000", // orange (plus clair)
    "#f6e500", // jaune
    "#78be20", // vert
    "#007ec6", // bleu (plus foncé)
    "#753bbd", // violet
    "#aeeffc", // bleu clair (plus clair)
    "#ecc7cd", // rose pale
    "#919d9d", // gris clair
    "#3f4444"  // gris anthracite
]

const colorNames = ['rouge', 'orange', 'jaune', 'vert', 'bleu', 'violet', 'bleu clair', 'rose pale', 'gris clair', 'gris anthracite'];

const cabins = require('../../modeles/data/cabins.json').cabins;
const stripes  = require('../../modeles/decret2/colors.json').colors;

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
function writeCabin(out, cab, only) {
    out.write(`<rect x="0" y="0" width="${A}" height="${A}" fill="none" stroke="black" stroke-width="0.5" />\n`);
    out.write(`<text x="${A / 2}" y="${A - 2}" text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="rotate(${-90 * cab.door} ${A / 2} ${A / 2})">${cab.id}</text>\n`)
    let s = stripes[cab.id].stripes;
    let transforms = [`translate(0, ${A})`, `translate(${A} ${A}) rotate(-90)`, `translate(${A} 0) rotate(180)`, `rotate(90)`];
    let show = [true, cab.rightGap, true, cab.leftGap];
    for (let i = 0; i < 4; i++) {
        if (show[i]) {
            out.write(`<g transform="${transforms[i]}">\n`);
            writeFace(out, getS(s[2 * i], cab.paint, only), getS(s[2 * i + 1], cab.paint, only));
            out.write('</g>\n');
        }
    }
}

function writeRow(fileName, start, count, epi, only, page) {
    let out = fs.createWriteStream(fileName);
    writeHeader(out);

    if (epi) {
        out.write(`<text x="526" y="${372 - 5 * A}" text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}">= promenade =</text>\n`);
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(526 ${372 + 5 * A}) rotate(180)">~ mer ~</text>\n`);
    } else {
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(30 372) rotate(-90)">= promenade =</text>\n`);
        out.write(`<text text-anchor="middle" font-family="Courier" font-weight="bold" font-size="${FSW}" transform="translate(1022 372) rotate(90)">~ mer ~</text>\n`);
    }
    out.write(`<text x="1022" y="714" text-anchor="middle" font-family="Courier" font-size="${FSW}">${page}</text>\n`);

    let col = only == -1 ? 'toutes les couleurs' : `couleur ${only + 1} (${colorNames[only]})`;
    let title = `${cabins[start].id} > ${cabins[start + count - 1].id} : ${col}`;
    out.write(`<text text-anchor="left" font-family="Courier" font-weight="bold" font-size="${2 * FSW}" transform="translate(30 ${2 * FSW + 60})">${title}</text>\n`);
    out.write(`<line x1="30" y1="${2 * FSW + 60 + 10}" x2="1022" y2="${2 * FSW + 60 + 10}" stroke="black"/>\n`);
    title = `${cabins[start + count - 1].id} > ${cabins[start].id} : ${col}`;
    out.write(`<text text-anchor="left" font-family="Courier" font-weight="bold" font-size="${2 * FSW}" transform="translate(1022 ${-2* FSW + 744 - 60}) rotate(180)">${title}</text>\n`);
    out.write(`<line x1="30" y1="${744 - 2 * FSW - 60 - 10}" x2="1022" y2="${744 - 2 * FSW - 60 - 10}" stroke="black"/>\n`);

    let totalWidth = count * A + (count - 1) * GAP;
    if (cabins[start].leftGap) totalWidth += A;
    for (let i = start; i < start + count - 1; i++) {
        if (cabins[i].rightGap) totalWidth += 3 * A;
    }
    if (cabins[start + count - 1].rightGap) totalWidth += A;

    let x = (1052 - totalWidth) / 2;
    let y1 = 372 + 2 * A;
    let y2 = 372 - 3 * A;
    for (let i = start; i < start + count; i++) {
        if (cabins[i].leftGap) x += A;
        out.write(`<g transform="translate(${x}, ${y1})">\n`);
        writeCabin(out, cabins[i], only);
        out.write('</g>\n');
        out.write(`<g transform="translate(${x}, ${y2})">\n`);
        writeCabin(out, cabins[i], -1);
        out.write('</g>\n');
        x += A + GAP;
        if (cabins[i].rightGap) x += 2 * A;
    }
    writeFooter(out);
}

function writeAll() {
    let groups = [
        // E6 - E2
        10, 12, 14, 13, 14,
        // E1
        18, 10,
        // P
        12, 11, 14, 13,
        // R1 - R6
        11, 11, 11, 11, 11, 11,
        // R7 - R12
        16, 16, 16, 16, 16, 16,
        // R13 - R18
        9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
        // R19 - R24
        11, 13, 11, 13, 11, 13, 11, 13, 11, 13, 11, 13,
        // R25 - R26
        8, 17, 8, 17,
        // R27 - R30
        10, 17, 10, 17, 10, 17, 10, 17
    ];
    let start = 0;
    let page = 1;
    groups.forEach((g, k) => {
        for (let c = 0; c < 10; c++) {
            let fName = 'p';
            if (page < 10) fName += '0';
            if (page < 100) fName += '0';
            fName += page + '.svg';
            writeRow(fName, start, g, start < 141, c, page++);
        };
        start += g;
    })
}

writeAll();

//writeRow('test.svg', 0, 10, true, 0, 1);


// let out = fs.createWriteStream('test.svg');
// writeHeader(out);
// writeCabin(out, cabins[9], -1);
// writeFooter(out);

// writeRow('test.svg', true,
//     ['E5/12', 'E5/11', 'E5/10', 'E5/9', 'E5/8', 'E5/7', 'E5/6', 'E5/5', 'E5/4', 'E5/3', 'E5/2', 'E5/1'],
//     [true, true, false, false, true, true, true, true, false, true, true, true],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     6, 0
// );

// for (let c = 0; c < 10; c++) {
//     writeRow(`a${c < 9 ? '0' : ''}${c + 1}.svg`, true,
//         ['E5/12', 'E5/11', 'E5/10', 'E5/9', 'E5/8', 'E5/7', 'E5/6', 'E5/5', 'E5/4', 'E5/3', 'E5/2', 'E5/1'],
//         [false, true, false, false, true, true, true, true, false, true, true, false],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         6, c
//     );
// }
//
// for (let c = 0; c < 10; c++) {
//     writeRow(`b${c < 9 ? '0' : ''}${c + 1}.svg`, false,
//         ['R27/0', 'R27/1', 'R27/2', 'R27/3', 'R27/4', 'R27/5', 'R27/6', 'R27/7', 'R27/8', 'R27/9'],
//         [true, true, false, false, true, true, true, false, true, false],
//         [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
//         590, c
//     );
// }
//
// for (let c = 0; c < 10; c++) {
//     writeRow(`c${c < 9 ? '0' : ''}${c + 1}.svg`, false,
//         ['R27/10', 'R27/11', 'R27/12', 'R27/13', 'R27/14', 'R27/15', 'R27/16', 'R27/17', 'R27/18', 'R27/19', 'R27/20', 'R27/21', 'R27/22', 'R27/23', 'R27/24', 'R27/25', 'R27/26'],
//         [false, true, true, false, true, true, false, true, true, true, true, true, true, false, true, false, true],
//         [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
//         600, c
//     );
// }
