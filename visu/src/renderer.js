'use strict';

const Cabin = require('./cabin.js');
const animate = require('./animate.js');

import { randomStripes } from './util.js';

class Renderer {
  constructor(container) {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this._center = new THREE.Vector3(0, 0, 0);
    this._gridDisplay = false;
    this._meshToCabin = {};
    this._cabinPerRow = 30;
    this._cabinCount = 0;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 5, 20);
    this.camera.up = new THREE.Vector3(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x111111);

    this._container = container;
    this._container.appendChild(this.renderer.domElement);

    this._scene = new THREE.Scene();
    this._cabanes = new THREE.Group();
    this._cabanesObject = {};

    this._scene.add(this._cabanes);

    /*var axisHelper = new THREE.AxisHelper(2);
    this._scene.add(axisHelper);*/

    /*this.controls = new THREE.TrackballControls(this.camera);
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;*/

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.controls.addEventListener('change', this.render);

    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  unfoldCabins() {
    for (let k in this._cabanesObject) {
      this._cabanesObject[k].toggleUnfold();
    }

    this.render();

    this._container.classList.toggle('fold');
  }

  set scale(factor) {
    for (let k in this._cabanesObject) {
      this._cabanesObject[k].scale = factor;
    }

    requestAnimationFrame(this.render);
  }

  set trackedCabin(cabinId) {
    if (cabinId == null || !cabinId) {
      for (let k in this._cabanesObject) {
        this._cabanesObject[k].transparent = 1;
      }

      requestAnimationFrame(this.render);
    }
    else if (this._cabanesObject[cabinId]) {
      let cabin = this._cabanesObject[cabinId];

      if (this._gridDisplay) {
        animate(this.camera.position, {
          x: cabin.gridX,
          y: 10,
          z: cabin.gridY + 1
        }, () => {
          this.camera.updateProjectionMatrix();
        });

        animate(this.controls.target, {
          x: cabin.gridX,
          y: 0,
          z: cabin.gridY
        }, () => {
          this.controls.update();
        });
      }
      else {
        animate(this.camera.position, {
          x: cabin.x,
          y: 10,
          z: cabin.z + 10
        }, () => {
          this.camera.updateProjectionMatrix();
        });

        animate(this.controls.target, {
          x: cabin.x,
          y: 0,
          z: cabin.z
        }, () => {
          this.controls.update();
        });
      }

      //this.camera.up = new THREE.Vector3(0, 1, 0);
      this.camera.updateProjectionMatrix();

      this.controls.update();

      for (let k in this._cabanesObject) {
        this._cabanesObject[k].transparent = 0.25;
      }

      cabin.transparent = 1;

      requestAnimationFrame(this.render);
    }
    else {
      console.log("Can not find cabin");
    }
  }

  get rendererDomElement() {
    return this.renderer.domElement;
  }

  get container() {
    return this._container;
  }

  set cabinsData(cabanes) {
    let i = 0;

    this._scene.remove(this._cabanes);
    this._cabanes = new THREE.Group();
    this._scene.add(this._cabanes);

    this._cabanesObject = {};
    this._meshToCabin = {};
    this._cabinCount = 0;

    let minX = cabanes[0].x
      , maxX = cabanes[0].x
      , minY = cabanes[0].y
      , maxY = cabanes[0].y
      , gridFactor = 2
      , dGridY   = -(cabanes.length / this._cabinPerRow) / 2;

    cabanes.forEach((cabane) => {
      cabane.colors = randomStripes();

      minX = Math.min(minX, cabane.x);
      maxX = Math.max(maxX, cabane.x);
      minY = Math.min(minY, cabane.y);
      maxY = Math.max(maxY, cabane.y);

      let c = new Cabin(cabane, this);
      this._cabanesObject[c.id] = c;
      this._cabanes.add(c.mesh);

      this._meshToCabin[c.mesh.uuid] = c;

      c.gridX = -this._cabinPerRow / 2 + this._cabinCount % this._cabinPerRow;
      c.gridY = dGridY + Math.floor(this._cabinCount / this._cabinPerRow);
      c.gridX *= gridFactor;
      c.gridY *= gridFactor;

      this._cabinCount++;
    });

    this._center.set((minX + maxX) / 2, 0, (minY + maxY) / 2);
    requestAnimationFrame(this.render);
  }

  set colors(colors) {
    for (let k in this._cabanesObject) {
      let color = colors [k];

      if (color) {
        this._cabanesObject[k].colors = color.stripes;
      }
      else {
        console.log("Missing color for cabin", k);
      }
    }

    requestAnimationFrame(this.render);
  }

  gridDisplay() {
    for (let k in this._cabanesObject) {
      this._cabanesObject[k].goOnGrid();
    }

    this.render();
    this._gridDisplay = true;

    document.getElementById('container').classList.add('grid-display');
  }

  normalDisplay() {
    for (let k in this._cabanesObject) {
      this._cabanesObject[k].resetPosition();
    }

    this.render();
    this._gridDisplay = false;

    document.getElementById('container').classList.remove('grid-display');
  }

  toggleDisplay() {
    if (this._gridDisplay) {
      this.normalDisplay();
    }
    else {
      this.gridDisplay();
    }
  }

  resetCamera() {
      animate(this.camera.position, {
        x:0,
        y:10,
        z:20
      }, () => {
        this.camera.updateProjectionMatrix();
      });

      animate(this.controls.target, {
        x:0,
        y:0,
        z:0
      }, () => {
        this.controls.update();
      });
  }

  animate() {
      requestAnimationFrame( this.animate );
      this.controls.update();
  }

  render() {
      this.renderer.render(this._scene, this.camera);
  }

  topView() {
    let x = this._gridDisplay ? this._cabinPerRow / 2 : this._center.x
      , z = this._gridDisplay ? (this._cabinCount / this._cabinPerRow) / 2 : this._center.z;

    animate(this.camera.position, {
      x: x,
      y: this._gridDisplay ? 150 : 300,
      z: z
    }, () => {
      this.camera.updateProjectionMatrix();
    });

    animate(this.controls.target, {
      x: x,
      y: 0,
      z: z
    }, () => {
      this.controls.update();
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.render();
  }

  askForRendering() {
    if (!this._willRender) {
      this._willRender = true;

      requestAnimationFrame(() => {
        this.render();
        this._willRender = false;
      });
    }
  }

  getCabinAt(x, y) {
    let raycaster = new THREE.Raycaster()
      , position  = new THREE.Vector2(x, y);

    raycaster.setFromCamera(position, this.camera);

    let intersects = raycaster.intersectObjects(this._scene.children, true);

    if (intersects.length > 0) {
      return this._meshToCabin[intersects[0].object.uuid];
    }
    else {
      console.log("no cabin found");
      return null;
    }
  }
}

module.exports = Renderer;
