'use strict';

const Graph = require('./graph.js');
const DIST  = 75;
const MAX_DEGREE = 61;

let graph = new Graph();
graph.makeLink((a, b) => {
    return a.distanceTo(b) < DIST;
});

graph.makeLink((a, b) => {
  let d = a.distanceTo(b);
  let idxA = a.links.length;
  let idxB = b.links.length;

  while (idxA > 0 && d < a.distanceTo(a.links[idxA - 1])) {
    idxA--;
  }

  if (idxA == a.links.length) {
    return false;
  }

  while (idxB > 0 && d < b.distanceTo(b.links[idxB - 1])) {
    idxB--;
  }

  if (idxB == b.links.length) {
    return false;
  }

});

/*let d = 50;

do {
  d++;

  graph.makeLink((a, b) => {
      return a.distanceTo(b) < d;
  });
} while (!graph.isConnected());*/

console.log("Using distance", DIST, " graph connected. (min/max/avg =", graph.minDegree, graph.maxDegree, graph.avgDegree, ")");
