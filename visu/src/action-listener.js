'use strict';

class ActionListener {
  constructor(renderer, container) {
    this._renderer = renderer;
    this._container = container;

    let actioners = container.querySelectorAll('.action');

    for (let i = 0; i < actioners.length; i++) {
      actioners[i].addEventListener(actioners[i].dataset.type || 'click', this.actionPerformed.bind(this, actioners[i]));
    }

    this._renderer.rendererDomElement.addEventListener('click', (e) => {
      if (this._disableClick) {
        return;
      }

      let cabin = this._renderer.getCabinAt(
         (e.clientX / window.innerWidth)  * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      if (cabin != null) {
        this._renderer.trackedCabin = cabin.id;
      }
    });

    let cb = () => {
      this._disableClick = true;
    };

    this._renderer.rendererDomElement.addEventListener('mousedown', (e) => {
      this._renderer.rendererDomElement.addEventListener('mousemove', cb);
    });

    this._renderer.rendererDomElement.addEventListener('mouseup', (e) => {
      this._renderer.rendererDomElement.removeEventListener('mousemove', cb);
      setTimeout(() => { this._disableClick = false; }, 250);
    });
  }

  actionPerformed(target, e) {
    let found = true;

    switch(target.dataset.action) {
    case 'toggle-finder':
      this._container.querySelector('.finder').classList.toggle('opened');
      break;
    case 'unfolder':
      this._renderer.unfoldCabins();
      break;
    case 'clear-tracked-cabin':
      this._container.querySelector('.search-box input').value = '';
      this._renderer.trackedCabin = null;
      break;
    case 'top-view':
      this._renderer.topView();
      break;
    case 'toggle-display':
      this._renderer.toggleDisplay();
      break;
    case 'set-grid-factor':
      //this._renderer.gridFactor = parseInt(target.value);
      this._renderer.scale = parseFloat(target.value);
      break;
    case 'reset-camera':
      this._renderer.resetCamera();
      break;
    case 'track-cabin':
      if (e.key == 'Enter') {
        let cabinId = target.value;
        console.log("tracked cabin", cabinId, cabinId.length);
        this._renderer.trackedCabin = (cabinId.length == 0 ? null : cabinId);
      }
      break;
    default:
      console.log("Unknown action", target.dataset.action);
      found = false;
      break;
    }

    if(found) {
      e.preventDefault();
    }
  }
}

module.exports = ActionListener;
