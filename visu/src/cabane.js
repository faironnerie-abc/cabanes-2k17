'use strict';

const COLORS        = require('./colors.json').colors
    , WIDTHS        = [2 / 11.0, 3 / 11.0, 5 / 11.0, 7 / 11.0, 9 / 11.0, 1]
    , cube          = new THREE.BoxGeometry(1, 1, 1)
    , whiteMaterial = canvasMaterial(whiteCanvas());

let materials = {};

function getFaceMaterial(s1, s2) {
  let id = `${s1}_${s2}`;

  if (!materials[id]) {
    materials[id] = faceMaterial(s1, s2);
  }

  return materials[id];
}

function faceMaterial(s1, s2) {
    let c1      = s1 % COLORS.length
      , w1      = Math.floor(s1 / COLORS.length)
      , c2      = s2 % COLORS.length
      , w2      = Math.floor(s2 / COLORS.length)
      , canvas  = whiteCanvas()
      , ctx     = canvas.getContext("2d");

    ctx.fillStyle = COLORS[c1];
    ctx.fillRect(64 * (1 - WIDTHS[w1]), 0, 128 * WIDTHS[w1], 256);
    ctx.fillStyle = COLORS[c2];
    ctx.fillRect(128 + 64 * (1 - WIDTHS[w2]), 0, 128 * WIDTHS[w2], 256);

    return canvasMaterial(canvas);
}

function whiteCanvas() {
   let canvas = document.createElement("canvas");
   let ctx = canvas.getContext("2d");

   canvas.width = canvas.height = 256;
   ctx.fillStyle = "#fff";
   ctx.fillRect(0, 0, 256, 256);

   return canvas;
}

function canvasMaterial(canvas) {
   let map = new THREE.Texture(canvas);
   map.needsUpdate = true;

   return new THREE.MeshBasicMaterial({map : map});
}

function convertColorsToMaterial(colors) {
  let materials = [
    faceMaterial(colors[2], colors[3]),
    faceMaterial(colors[6], colors[7]),
    whiteMaterial,
    whiteMaterial,
    faceMaterial(colors[0], colors[1]),
    faceMaterial(colors[4], colors[5])
  ];

  return new THREE.MultiMaterial(materials);
}

class Cabane {
  constructor(data) {
    this._x = data.x;
    this._z = data.y;

    this._mesh = new THREE.Mesh(cube, convertColorsToMaterial(data.colors));
    this._mesh.position.x = this._x;
    this._mesh.position.z = this._z;
    this._mesh.matrixAutoUpdate = false;
    this._mesh.updateMatrix();
  }

  get mesh() {
    return this._mesh;
  }

  set colors(colors) {
    let material = convertColorsToMaterial(colors);
    material.needsUpdate = true;

    this._mesh.material = material;
  }
}

module.exports = Cabane;
