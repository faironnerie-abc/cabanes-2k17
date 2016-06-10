'use strict';

const CABANES = require('../data/cabanes.json').cabanes;

console.log(CABANES.length, "cabanes");

class Cabane {
  constructor(jsonCabane) {
    this._links = [];

    this._id = jsonCabane.id;
    this._x  = jsonCabane.x;
    this._y  = jsonCabane.y;

    this.orientation = jsonCabane.orientation;
  }

  get id() {
    return this._id;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get links() {
    return this._links;
  }

  distanceTo(cabane) {
    return Math.sqrt(Math.pow(this.x - cabane.x, 2) + Math.pow(this.y - cabane.y, 2));
  }

  clearNeighbourhood() {
    this._links = [];
  }

  addLink(cabane) {
    this._links.push(cabane);
  }
}

class Graph {
  constructor() {
    this._cabanes = [];
    this._links = [];

    CABANES.forEach(jsonCabane => {
      let cabane = new Cabane(jsonCabane);
      this._cabanes.push(cabane);
    });
  }

  makeLink(validator) {
    for (let i = 0; i < this.cabanes.length - 1; i++) {
      for (let j = 1; j < this.cabanes.length; j++) {
        let a = this.cabanes[i]
          , b = this.cabanes[j];

        if (validator(a, b)) {
          this.addLink(a, b);
        }
      }
    }
  }

  addLink(a, b) {
    a.addLink(b);
    b.addLink(a);

    this._links.push([a, b]);
  }

  get cabanes() {
    return this._cabanes;
  }

  get links() {
    return this._links;
  }

  isConnected() {
    let tmp = [];
    let u = [];

    u.push(this._cabanes[0]);

    while (u.length > 0) {
      let n = u.pop();

      tmp.push(n);

      for (let o of n.links) {
        if (tmp.indexOf(o) < 0 && u.indexOf(o) < 0) {
          u.push(o);
        }
      }
    }

    return tmp.length == this._cabanes.length;
  }

  get maxDegree() {
    let d = 0;

    for (let c of this._cabanes) {
      d = Math.max(d, c.links.length);
    }

    return d;
  }

  get minDegree() {
    let d = this._cabanes[0].links.length;

    for (let c of this._cabanes) {
      d = Math.min(d, c.links.length);
    }

    return d;
  }

  get avgDegree() {
    let d = 0;

    for (let c of this._cabanes) {
      d += c.links.length;
    }

    return d / this._cabanes.length;
  }
}

module.exports = Graph;
