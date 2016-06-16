'use strict';

import { createUnfoldCube, UnfoldCubeGeometry } from './util.js';

const COLORS        = require('./colors.json').colors
    , WIDTHS        = [2 / 11.0, 3 / 11.0, 5 / 11.0, 7 / 11.0, 9 / 11.0, 1]
    , cube          = new THREE.BoxGeometry(1.75, 1.75, 1.75)
    , unfoldCube    = new UnfoldCubeGeometry(0.5, 0.05)
    //, openCabin     = createUnfoldCube(1, 0.05)
    , whiteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
    , redMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000}); //canvasMaterial(whiteCanvas());

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
  let w = whiteMaterial.clone();

  let materials = [
    faceMaterial(colors[2], colors[3]),
    faceMaterial(colors[6], colors[7]),
    w,
    w,
    faceMaterial(colors[0], colors[1]),
    faceMaterial(colors[4], colors[5])
  ];

  return new THREE.MultiMaterial(materials);
}

class Cabin {
  constructor(data, renderer) {
    this._id = data.id;
    this._x = data.x;
    this._z = data.y;
    this._angle = data.angle * Math.PI / 180;
    this._unfold = false;
    this._renderer = renderer;

    //this._mesh = new THREE.Mesh(unfoldCube, whiteMaterial);
    this._mesh = new THREE.Mesh(cube, whiteMaterial);//convertColorsToMaterial(data.colors));
    this._mesh.position.x = this._x * renderer.normalFactor;
    this._mesh.position.z = this._z * renderer.normalFactor;
    this._mesh.rotation.y = this._angle;
    this._mesh.matrixAutoUpdate = false;
    this._mesh.updateMatrix();
  }

  get id() {
    return this._id;
  }

  get mesh() {
    return this._mesh;
  }

  get x() {
    return this._x;
  }

  get z() {
    return this._z;
  }

  set colors(colors) {
    let material = convertColorsToMaterial(colors);
    material.needsUpdate = true;

    this._colors = colors;
    this._mesh.material = material;
  }

  set gridX(gridX) {
    this._gridX = gridX;
  }

  set gridY(gridY) {
    this._gridY = gridY;
  }

  get gridX() {
    return this._gridX;
  }

  get gridY() {
    return this._gridY;
  }

  set transparent(v) {
    let t = true
      , o = v;

    if (v >= 1) {
      t = false;
      o = 1;
    }

    for (let material of this._mesh.material.materials) {
      material.transparent = t;
      material.opacity = o;
      material.needsUpdate = true;
    }

    this._mesh.material.needsUpdate = true;
  }

  toggleUnfold() {
    this._unfold = !this._unfold;

    if (this._unfold) {
      this._mesh.geometry = unfoldCube;
    }
    else {
      this._mesh.geometry = cube;
    }

    this._mesh.geometry.needsUpdate = true;
  }

  goOnGrid() {
    createjs.Tween.get(this._mesh.rotation).to({y:0}, 1000);
    createjs.Tween.get(this._mesh.position).to({
      x:this.gridX * this._renderer.gridFactor,
      z:this.gridY * this._renderer.gridFactor
    }, 1000).addEventListener("change", () => {
      this._mesh.matrixAutoUpdate = false;
      this._mesh.updateMatrix();

      this._renderer.askForRendering();
    });
  }

  resetPosition() {
    createjs.Tween.get(this._mesh.rotation).to({y:this._angle}, 1000);
    createjs.Tween.get(this._mesh.position).to({
      x:this.renderer.normalFactor * this._x,
      z:this.renderer.normalFactor * this._z
    }, 1000).addEventListener("change", () => {
      this._mesh.matrixAutoUpdate = false;
      this._mesh.updateMatrix();

      this._renderer.askForRendering();
    });
  }
}

module.exports = Cabin;
