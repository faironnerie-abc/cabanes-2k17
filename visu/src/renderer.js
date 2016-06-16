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
    this._gridFactor = 5;
    this._meshToCabin = {};

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;
    this.camera.up = new THREE.Vector3(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x111111);

    this._container = container;
    this._container.appendChild(this.renderer.domElement);

    this._progress = document.createElement('canvas');
    this._progress.classList.add('progress');
    this._container.appendChild(this._progress);

    this._scene = new THREE.Scene();
    this._cabanes = new THREE.Group();
    this._cabanesObject = {};
    this.loadCabins();

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

    document.getElementById('container').classList.toggle('fold');
  }

  set gridFactor(factor) {
    this._gridFactor = factor;

    if (this._gridDisplay) {
      this.gridDisplay();
    }
    else {
      this.normalDisplay();
    }
  }

  get gridFactor() {
    return this._gridFactor;
  }

  get normalFactor() {
    return this._gridFactor / 5.0;
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
          x: cabin.gridX * this.gridFactor,
          y: 10,
          z: (cabin.gridY + 1) * this.gridFactor
        }, () => {
          this.camera.updateProjectionMatrix();
        });

        animate(this.controls.target, {
          x: cabin.gridX * this.gridFactor,
          y: 0,
          z: cabin.gridY * this.gridFactor
        }, () => {
          this.controls.update();
        });
      }
      else {
        animate(this.camera.position, {
          x: cabin.x * this.normalFactor,
          y: 10,
          z: (cabin.z + 10) * this.normalFactor
        }, () => {
          this.camera.updateProjectionMatrix();
        });

        animate(this.controls.target, {
          x: cabin.x * this.normalFactor,
          y: 0,
          z: cabin.z * this.normalFactor
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

  set progress(text) {
    let ctx = this._progress.getContext('2d');
    ctx.textAlign = "left";
    ctx.fontStyle = "red";
    ctx.fillText(text, this._progress.width - 5, this._progress.height / 2);
  }

  get rendererDomElement() {
    return this.renderer.domElement;
  }

  loadCabins() {
    document.querySelector('#container .loader').classList.add('active');

    let req = new XMLHttpRequest();
    req.open('GET', 'cabins.json', true);

    req.onprogress = (e) => {
      let percentComplete = Math.floor((e.position / e.totalSize) * 100);
      this.progress = `Downloading cabanes list... [${percentComplete}%]`;
    };

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          this.progress = "Creating cabanes mesh...";

          let cabanes = JSON.parse(req.responseText).cabins
            , i       = 0;

          this._scene.remove(this._cabanes);
          this._cabanes = new THREE.Group();
          this._scene.add(this._cabanes);

          this._cabanesObject = {};
          this._meshToCabin = {};

          let minX = cabanes[0].x
            , maxX = cabanes[0].x
            , minY = cabanes[0].y
            , maxY = cabanes[0].y;

          let count = 0;

          cabanes.forEach((cabane) => {
            this.progress = `Creating cabanes mesh... ${++i}/${cabanes.length}`;
            cabane.colors = randomStripes();

            minX = Math.min(minX, cabane.x);
            maxX = Math.max(maxX, cabane.x);
            minY = Math.min(minY, cabane.y);
            maxY = Math.max(maxY, cabane.y);

            let c = new Cabin(cabane, this);
            this._cabanesObject[c.id] = c;
            this._cabanes.add(c.mesh);

            this._meshToCabin[c.mesh.uuid] = c;

            c.gridX = count % 10;
            c.gridY = Math.floor(count / 10);
            count++;

            requestAnimationFrame(this.render);
          });

          this._center.set((minX + maxX) / 2, 0, (minY + maxY) / 2);

          //this.progress = "";

          //
          // Load colors
          //

          this.loadColors();
        }
        else {
          console.log("Impossible de télécharger la liste des cabanes.");
        }
      }
    };

    req.send(null);
  }

  loadColors() {
    let req = new XMLHttpRequest();
    req.open('GET', 'colors.json', true);

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          let colors = JSON.parse(req.responseText).colors;

          for (let k in this._cabanesObject) {
            let color = colors [k];

            if (color) {
              this._cabanesObject [k].colors = color.stripes;
            }
            else {
              console.log("Missing color for cabin", k);
            }
          }

          requestAnimationFrame(this.render);
        }
        else {
          console.log("Impossible de télécharger la liste des couleurs.");
        }
      }

      document.querySelector('#container .loader').classList.remove('active');
    };

    req.send(null);
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
    if (this._gridDisplay) {
      animate(this.camera.position, {
        x:this._gridFactor * 5,
        y:10,
        z:5
      }, () => {
        this.camera.updateProjectionMatrix();
      });

      animate(this.controls.target, {
        x:this._gridFactor * 5,
        y:0,
        z:5
      }, () => {
        this.controls.update();
      });
    }
    else {
      animate(this.camera.position, {
        x:0,
        y:0,
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
  }

  animate() {
      requestAnimationFrame( this.animate );
      this.controls.update();
  }

  render() {
      this.renderer.render(this._scene, this.camera);
  }

  topView() {
    this.camera.position.set(this._center.x, 300, this._center.z);
    this.camera.up = new THREE.Vector3(0, 1, 0);
    this.camera.updateProjectionMatrix();

    this.controls.target = this._center.clone();
    this.controls.update();
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
