'use strict';

require('./main.scss');

const cabin = require('./cabin.js');
const Cabane = require('./cabane.js');
import { randomStripes } from './util.js';

class Renderer {
  constructor() {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x808080);

    this._container = document.querySelector('#container');
    this._container.appendChild(this.renderer.domElement);

    this._progress = document.createElement('canvas');
    this._progress.classList.add('progress');
    this._container.appendChild(this._progress);

    this.scene = new THREE.Scene();
    this._cabanes = new THREE.Group();
    this._cabanesObject = {};
    this.loadCabanes();

    this.scene.add(this._cabanes);

    var axisHelper = new THREE.AxisHelper(2);
    this.scene.add(axisHelper);

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

  set progress(text) {
    let ctx = this._progress.getContext('2d');
    ctx.textAlign = "left";
    ctx.fontStyle = "red";
    ctx.fillText(text, this._progress.width - 5, this._progress.height / 2);
  }

  loadCabanes() {
    let req = new XMLHttpRequest();
    req.open('GET', '/cabins.json', true);

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

          cabanes.forEach((cabane) => {
            this.progress = `Creating cabanes mesh... ${++i}/${cabanes.length}`;
            cabane.colors = randomStripes();

            let c = new Cabane(cabane);
            this._cabanesObject[c.id] = c;
            this._cabanes.add(c.mesh);

            requestAnimationFrame(this.render);
          });


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
    req.open('GET', '/colors.json', true);

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
    };

    req.send(null);
  }

  animate() {
      requestAnimationFrame( this.animate );
      this.controls.update();
  }

  render() {
      this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.render();
  }
}

let renderer = new Renderer();
renderer.render();
renderer.animate();
