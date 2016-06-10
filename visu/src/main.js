'use strict';

const cabin = require('./cabin.js');

function randomStripes() {
    var c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var w = [0, 1, 2, 3, 4, 5];
    var x1 = rnd(w.length);
    var x2 = rnd(w.length - 1);
    if (x2 >= x1) x2++;
    w.push(x1); w.push(x2);
    var stripes = [];
    for (var i = 0; i < 8; i++) {
        var j = rnd(c.length);
        var s = c[j];
        c.splice(j, 1);
        j = rnd(w.length);
        s += 10 * w[j];
        w.splice(j, 1);
        stripes.push(s);
    }
    return stripes;
}

function rnd(n) {
    return Math.floor(Math.random() * n);
}

class Renderer {
  constructor() {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);

    this.camera = new THREE.PerspectiveCamera(75,
        window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x808080);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    var group = new THREE.Group();
    for (var x = -5; x < 5; x++) {
        for (var z = -5; z < 5; z++) {
            var stripes = randomStripes();
            var cab = cabin(stripes);
            cab.position.x = 1.5 * x;
            cab.position.z = 1.5 * z;
            cab.matrixAutoUpdate = false;
            cab.updateMatrix();
            group.add(cab);
        }
    }
    this.scene.add(group);

    var axisHelper = new THREE.AxisHelper(2);
    this.scene.add(axisHelper);

    this.controls = new THREE.TrackballControls(this.camera);
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.addEventListener('change', this.render);
  }

  animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
  }

  render() {
      this.renderer.render(this.scene, this.camera);
  }
}

let renderer = new Renderer();
renderer.render();
renderer.animate();
