'use strict';

const fs = require('fs');

const cabins = require('../../modeles/data/all_cabins.json').cabins;
const colors  = require('../../modeles/decret2/colors.json').colors;
const bandColors = require('../src/colors.json').colors;

const path_points = [[0, 0], [0, 1], [1, 1], [1, 0], [2, 0], [2, -1], [1, -1], [1, -2], [0, -2], [0, -1], [-1, -1], [-1, 0]];
const factor = 100;
const widths = [2 / 11.0, 3 / 11.0, 5 / 11.0, 7 / 11.0, 9 / 11.0, 1];

function createPathData(data, factor) {
  let path = "";

  data.forEach((p) => {
    path += path.length == 0 ? "M" : "L";
    path += `${p[0] * factor / 2} ${p[1] * factor / 2} `;
  });

  path += "Z";

  return path;
}

let path = createPathData(path_points, factor);

let minX = 9999999
  , maxX = -minX
  , minY =  minX
  , maxY =  maxX;

cabins.forEach((c) => {
  minX = Math.min(minX, c.x * factor);
  maxX = Math.max(maxX, c.x * factor);
  minY = Math.min(minY, c.y * factor);
  maxY = Math.max(maxY, c.y * factor);
});

let out = fs.createWriteStream('export.svg');

out.write(`<svg viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}">`);

function getStripes(s1, s2) {
  let c1 = s1 % 10
    , b1 = Math.floor(s1 / 10)
    , c2 = s2 % 10
    , b2 = Math.floor(s2 / 10)
    , f1 = factor / 4
    , f2 = factor / 8
    , w1 = widths[b1]
    , w2 = widths[b2];

  let d1 = [
    [-f2 - (w1 * f1) / 2, -f1],
    [-f2 - (w1 * f1) / 2,  f1],
    [-f2 + (w1 * f1) / 2,  f1],
    [-f2 + (w1 * f1) / 2, -f1]
  ];

  let d2 = [
    [ f2 - (w2 * f1) / 2, -f1],
    [ f2 - (w2 * f1) / 2,  f1],
    [ f2 + (w2 * f1) / 2,  f1],
    [ f2 + (w2 * f1) / 2, -f1]
  ];

  let p1 = `<path d="${createPathData(d1, 2)}" style="fill:${bandColors[c1]};stroke:none;"></path>`;
  let p2 = `<path d="${createPathData(d2, 2)}" style="fill:${bandColors[c2]};stroke:none;"></path>`;

  return p1 + p2;
}

cabins.forEach(c => {
  let stripes = colors[c.id].stripes;

  out.write(`<g id="cabin${c.id}" transform="translate(${c.x * factor}, ${c.y * factor}) rotate(${-c.angle})">`);

  [
    [ factor / 4,   factor / 4,  0,   stripes[0], stripes[1]],
    [-factor / 4,  -factor/4,   -90,  stripes[7], stripes[6]],
    [ factor / 4,  -3*factor/4,  0,   stripes[5], stripes[4]],
    [ 3*factor/4,  -factor/4,    90,  stripes[3], stripes[2]]
  ].forEach(d => {
    out.write(`<g transform="translate(${d[0]}, ${d[1]}) rotate(${d[2]})">`);
      out.write(getStripes(d[3], d[4]));
    out.write("</g>");
  });

  out.write(`<path d="${path}" style="fill:none;stroke:#000000;stroke-width:1px;"></path>`);

  out.write('</g>');
});

out.write('</svg>');
out.end();
