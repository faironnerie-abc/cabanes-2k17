'use strict';

// 10 different colors as defined by the artist
var colors = [
    "#e53517", "#ff9f00", "#ffed00", "#4df18c", "#00acff",
    "#6e1ec7", "#bee1e9", "#fadde4", "#97adc5", "#4b575f"
];

// 6 different width ratios as defined by the artist
var widths = [2 / 11.0, 3 / 11.0, 5 / 11.0, 7 / 11.0, 9 / 11.0, 1];

var cube = new THREE.BoxGeometry(1, 1, 1);

var whiteMaterial = canvasMaterial(whiteCanvas());

/*
Generates a cube paint with 8 stripes
stripes is array of 8 elements encoding the color and the width
of each stripe in the following order:
+---> x
|   54
|   +--+
V  6|  |3
z  7|  |2
    +--+
     01
Each element of the array is of the form 10 * w + c where:
 - w is the index of the width (in widths array)
 - c is the index of the color (in colors array)
*/
function cabin(stripes) {
    var materials = [
            faceMaterial(stripes[2], stripes[3]),
            faceMaterial(stripes[6], stripes[7]),
            whiteMaterial,
            whiteMaterial,
            faceMaterial(stripes[0], stripes[1]),
            faceMaterial(stripes[4], stripes[5])
    ];
    var cab = new THREE.Mesh(cube, new THREE.MeshFaceMaterial(materials));
    return cab;
}

function faceMaterial(s1, s2) {
    var c1 = s1 % colors.length;
    var w1 = Math.floor(s1 / colors.length);
    var c2 = s2 % colors.length;
    var w2 = Math.floor(s2 / colors.length);
    var canvas = whiteCanvas();
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = colors[c1];
    ctx.fillRect(64 * (1 - widths[w1]), 0, 128 * widths[w1], 256);
    ctx.fillStyle = colors[c2];
    ctx.fillRect(128 + 64 * (1 - widths[w2]), 0, 128 * widths[w2], 256);
    return canvasMaterial(canvas);
}

 function whiteCanvas() {
     var canvas = document.createElement("canvas");
     canvas.width = canvas.height = 256;
     var ctx = canvas.getContext("2d");
     ctx.fillStyle = "#fff";
     ctx.fillRect(0, 0, 256, 256);
     return canvas;
 }

function canvasMaterial(canvas) {
    var map = new THREE.Texture(canvas);
    map.needsUpdate = true;
    return new THREE.MeshBasicMaterial({map : map});
}

module.exports = cabin;
