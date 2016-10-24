'use strict;'

const fs = require('fs');
const colors = require('../src/colors.json').colors;
const cabins = require('../../modeles/data/all_cabins.json').cabins;
const stripes  = require('../../modeles/decret2/colors.json').colors;


const A = 110;
const STROKE_WIDTH = 0.5;
const FONT_SIZE = 15 //10;
const FONT_SIZE_W = 10 //7.5;
const GAP = 4;

// const WIDTHS = [1, 2, 3, 5, 8, 13];
const WIDTHS = [2, 3, 5, 7, 9, 11];

function writeHeader(out) {
    out.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');
    out.write('<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm">\n');
}

function writeFooter(out) {
    out.write('</svg>\n');
    out.end();
}

function writeRect(out, x, y, width, height, fill) {
    out.write(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="none" />\n`);
}

function writeRectStroke(out, x, y, width, height){
    if (STROKE_WIDTH > 0)
        out.write(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="${STROKE_WIDTH}" />\n`);
}

function writeStripeV(out, x, y, s, participate) {
    // writeRect(out, x, y, A / 2, A, 'white');
    if (participate) {
        let w = Math.floor(s / 10);
        let c = s % 10;
        let sWidth = A / 2 * WIDTHS[w] / WIDTHS[5];
        let offset = (A / 2 - sWidth) / 2;
        writeRect(out, x + offset, y, sWidth, A, colors[c], 0);
        out.write(`<text x="${x + A / 4}" y="${y + (A + FONT_SIZE_W / 1.2) / 2}" text-anchor="middle" font-family="Courier" font-size="${FONT_SIZE_W}">${WIDTHS[w]}</text>\n`);
    }
    // writeRectStroke(out, x, y, A / 2, A);
}

function writeStripeH(out, x, y, s, participate) {
    // writeRect(out, x, y, A, A / 2, 'white');
    if (participate) {
        let w = Math.floor(s / 10);
        let c = s % 10;
        let sWidth = A / 2 * WIDTHS[w] / WIDTHS[5];
        let offset = (A / 2 - sWidth) / 2;
        writeRect(out, x, y + offset, A, sWidth, colors[c], 0);
        out.write(`<text x="${x + A / 2}" y="${y + (A / 2 + FONT_SIZE_W / 1.2) / 2}" text-anchor="middle" font-family="Courier" font-size="${FONT_SIZE_W}">${WIDTHS[w]}</text>\n`);
    }
    // writeRectStroke(out, x, y, A, A / 2);
}


function writeCabin(out, x, y, id, stripes, show, participate) {
    out.write('<g>\n');
    // writeRect(out, x, y, A, A, 'white');
    // writeRectStroke(out, x, y, A, A);
    let yText = y + (A + FONT_SIZE / 1.2) / 2;
    out.write(`<text x="${x + A / 2}" y="${yText}" text-anchor="middle" font-family="Courier" font-size="${FONT_SIZE}">${id}</text>\n`);
    if (show[0]) {
        writeRect(out, x, y + A, A, A, 'white');
        writeStripeV(out, x, y + A, stripes[0], participate);
        writeStripeV(out, x + A / 2, y + A, stripes[1], participate);
    }
    if (show[1]) {
        writeRect(out, x + A, y, A, A, 'white');
        writeStripeH(out, x + A, y + A / 2, stripes[2], participate);
        writeStripeH(out, x + A, y, stripes[3], participate);
    }
    if (show[2]) {
        writeRect(out, x, y - A, A, A, 'white');
        writeStripeV(out, x + A / 2, y - A, stripes[4], participate);
        writeStripeV(out, x, y - A, stripes[5], participate);
    }
    if (show[3]) {
        writeRect(out, x - A, y, A, A, 'white');
        writeStripeH(out, x - A, y, stripes[6], participate);
        writeStripeH(out, x - A, y + A / 2, stripes[7], participate);
    }
    out.write('</g>\n');
}

let out = fs.createWriteStream('test.svg');
writeHeader(out);
// writeCabin(out, 0, 0, 'R30/30', [0, 11, 22, 33, 44, 55, 6, 17], [true, true, true, true], true);
let p = [true, true, true, true, true, true, true, true, false, true, true];
let x = 0;
for (let i = 0; i < 5; i++) {
    writeCabin(out, x, 0, `R6/${i}`, stripes[cabins[123 + 55 + i].id].stripes, [true, i == 10, true, i == 0], true);
    // writeCabin(out, x, 0, `R6/${i}`, stripes[cabins[123 + 55 + i].id].stripes, [true, true, true, true], true);
    console.log(cabins[123 + 55 + i].id);
    x += A + GAP;
}
writeFooter(out);
