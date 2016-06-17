'use strict';

const CABINS_URL = 'cabins.json';
const COLORS_URL = 'colors.json';

class CabinsLoader {
  constructor(renderer) {
    this._renderer = renderer;
  }

  load() {
    this._renderer.container.querySelector('.loader').classList.add('active');

    let req = new XMLHttpRequest();
    req.open('GET', CABINS_URL, true);

    /*req.onprogress = (e) => {
      let percentComplete = Math.floor((e.position / e.totalSize) * 100);
      this.progress = `Downloading cabanes list... [${percentComplete}%]`;
    };*/

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          //this.progress = "Creating cabanes mesh...";

          let cabins = JSON.parse(req.responseText).cabins;

          console.log("Loading", cabins.length, "cabins...");
          this._renderer.cabinsData = cabins;
          console.log("Done");

          this._renderer.container.querySelector('.loader').classList.remove('active');

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
    req.open('GET', COLORS_URL, true);

    this._renderer.container.querySelector('.loader').classList.add('active');

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          let colors = JSON.parse(req.responseText).colors;

          console.log("Loading colors...");
          this._renderer.colors = colors;
          console.log("Done.");
        }
        else {
          console.log("Impossible de télécharger la liste des couleurs.");
        }
      }

      this._renderer.container.querySelector('.loader').classList.remove('active');
    };

    req.send(null);
  }
}

module.exports = CabinsLoader;
