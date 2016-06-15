'use strict';

require('./main.scss');

const Cabin = require('./cabin.js');
import { randomStripes } from './util.js';

class Renderer {
  constructor() {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this._center = new THREE.Vector3(0, 0, 0);
    this._gridDisplay = false;
    this._gridFactor = 3;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x111111);

    this._container = document.querySelector('#container');
    this._container.appendChild(this.renderer.domElement);

    this._progress = document.createElement('canvas');
    this._progress.classList.add('progress');
    this._container.appendChild(this._progress);

    this.scene = new THREE.Scene();
    this._cabanes = new THREE.Group();
    this._cabanesObject = {};
    this.loadCabins();

    this.scene.add(this._cabanes);

    /*var axisHelper = new THREE.AxisHelper(2);
    this.scene.add(axisHelper);*/

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

  set trackedCabin(cabinId) {
    if (cabinId == null || !cabinId) {
      for (let k in this._cabanesObject) {
        this._cabanesObject[k].transparent = 1;
      }

      requestAnimationFrame(this.render);
    }
    else if (this._cabanesObject[cabinId]) {
      let cabin = this._cabanesObject[cabinId];
      console.log("Cabin found");

      this.camera.position.set(cabin.x, 10, cabin.z + 20);
      this.camera.up = new THREE.Vector3(0, 1, 0);
      this.camera.updateProjectionMatrix();

      this.controls.target = new THREE.Vector3(cabin.x, 0, cabin.z);
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

          this.scene.remove(this._cabanes);
          this._cabanes = new THREE.Group();
          this.scene.add(this._cabanes);

          this._cabanesObject = {};

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
      this._cabanesObject[k].goOnGrid(this._gridFactor, this);
    }

    this.render();
    this._gridDisplay = true;

    document.getElementById('container').classList.add('grid-display');
  }

  normalDisplay() {
    for (let k in this._cabanesObject) {
      this._cabanesObject[k].resetPosition(this._gridFactor / 5.0);
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
      this.camera.position.set(this._gridFactor * 5, 10, 5);
      this.camera.up = new THREE.Vector3(0, 1, 0);
      this.camera.updateProjectionMatrix();

      this.controls.target = new THREE.Vector3(this._gridFactor * 5, 0, 5);
      this.controls.update();
    }
    else {
      this.camera.position.set(0, 0, 20);
      this.camera.updateProjectionMatrix();
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.update();
    }
  }

  animate() {
      requestAnimationFrame( this.animate );
      this.controls.update();
  }

  render() {
      this.renderer.render(this.scene, this.camera);
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
}

let renderer = new Renderer();
renderer.render();
renderer.animate();

document.querySelector('#container .finder').addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    let cabinId = e.target.value;
    console.log("tracked cabin", cabinId, cabinId.length);
    renderer.trackedCabin = (cabinId.length == 0 ? null : cabinId);
  }
});

function actionListener(e) {
  switch(this.dataset.action) {
  case 'unfolder':
    renderer.unfoldCabins();
    break;
  case 'clear-tracked-cabin':
    document.querySelector('#container .search-box input').value = '';
    renderer.trackedCabin = null;
    break;
  case 'top-view':
    renderer.topView();
    break;
  case 'toggle-display':
    renderer.toggleDisplay();
    break;
  case 'set-grid-factor':
    renderer.gridFactor = parseInt(this.value);
    break;
  case 'reset-camera':
    renderer.resetCamera();
    break;
  default:
    console.log("Unknown action", this.dataset.action);
    break;
  }
}

let actioners = document.querySelectorAll('#container .action');

for (let i = 0; i < actioners.length; i++) {
  actioners[i].addEventListener(actioners[i].dataset.type || 'click', actionListener.bind(actioners[i]));
}

document.querySelector('#container .open-finder').addEventListener('click', e => {
  document.querySelector('#container .finder').classList.toggle('opened');
});

renderer.rendererDomElement.focus();
