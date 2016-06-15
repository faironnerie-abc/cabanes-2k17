'use strict';

function rnd(n) {
    return Math.floor(Math.random() * n);
}

class UnfoldCube extends THREE.BufferGeometry {
  constructor(base = 1, thickness = 0.1) {
    super();

    this.type = 'UnfoldCubeGeometry';

    let points = [
      [-base / 2,    1.5 * base], // 0
      [ base / 2,    1.5 * base], // 1
      [-1.5 * base,  base / 2], // 2
      [-base / 2,    base / 2], // 3
      [ base / 2,    base / 2], // 4
      [ 1.5 * base,  base / 2], // 5
      [-1.5 * base, -base / 2], // 6
      [-base / 2,   -base / 2], // 7
      [ base / 2,   -base / 2], // 8
      [ 1.5 * base, -base / 2], // 9
      [-base / 2,   -1.5 * base], // 10
      [ base / 2,   -1.5 * base] // 11
    ];

    let vertexCount = points.length * 2
      , indexCount  = 22 * 6;

    this.vertexBufferOffset = 0;
    this.uvBufferOffset = 0;
    this.indexBufferOffset = 0;
    this.groupStart = 0;
    this.numberOfVertices = 0;

    this.indices  = new Uint16Array(indexCount)
    this.vertices = new Float32Array(vertexCount * 3)
    this.normals  = new Float32Array(vertexCount * 3)
    this.uvs      = new Float32Array(vertexCount * 2);

    this.buildFace(-base / 2, thickness, base / 2, base, base, 0);
    this.buildFace(-base / 2, thickness, base / 2, base, base, 0);

    this.setIndex( new THREE.BufferAttribute( this.indices, 1 ) );
  	this.addAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
  	this.addAttribute( 'normal', new THREE.BufferAttribute( this.normals, 3 ) );
  	this.addAttribute( 'uv', new THREE.BufferAttribute( this.uvs, 2 ) );
  }

  buildFace(x, y, z, w, h, mat) {
    let vertexCounter = 0
      , groupCount = 0;

    [x, x + w].forEach((ix) => {
      [z, z + h].forEach((iz) => {
        this.vertices[this.vertexBufferOffset + 0] = ix;
        this.vertices[this.vertexBufferOffset + 1] = y;
        this.vertices[this.vertexBufferOffset + 2] = iz;

        this.normals[this.vertexBufferOffset + 0] = 0;
        this.normals[this.vertexBufferOffset + 1] = (y > 0 ? 1 : -1);
        this.normals[this.vertexBufferOffset + 2] = 0;

        this.uvs[this.uvBufferOffset + 0] = (ix - x) / w;
        this.uvs[this.uvBufferOffset + 1] = (iz - z) / h;

        this.vertexBufferOffset += 3;
        this.uvBufferOffset += 2;

        vertexCounter++;
      });
    });

    let a = this.numberOfVertices
      , b = this.numberOfVertices + 1
      , c = this.numberOfVertices + 2
      , d = this.numberOfVertices + 3;

    this.indices[this.indexBufferOffset + 0] = a;
    this.indices[this.indexBufferOffset + 1] = b;
    this.indices[this.indexBufferOffset + 2] = c;

    this.indices[this.indexBufferOffset + 3] = c;
    this.indices[this.indexBufferOffset + 4] = b;
    this.indices[this.indexBufferOffset + 5] = d;

    this.indexBufferOffset += 6;
    this.groupCount += 6;
    this.numberOfVertices += vertexCounter;

    this.addGroup(this.groupStart, this.groupCount, mat);
    this.groupStart += this.groupCount;
  }
}

module.exports = {
  randomStripes: function() {
      let c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        , w = [0, 1, 2, 3, 4, 5]
        , x1 = rnd(w.length)
        , x2 = rnd(w.length - 1);

      if (x2 >= x1)
        x2++;

      w.push(x1); w.push(x2);

      let stripes = [];

      for (let i = 0; i < 8; i++) {
          let j = rnd(c.length);
          let s = c[j];
          c.splice(j, 1);
          j = rnd(w.length);
          s += 10 * w[j];
          w.splice(j, 1);
          stripes.push(s);
      }

      return stripes;
  },

  UnfoldCube: UnfoldCube,

  createUnfoldCube: function(base = 1, thickness = 0.1) {
    let openedCube = new THREE.Geometry();

    let vertices = [
      new THREE.Vector3(-base / 2, 0,  1.5 * base), // 0
      new THREE.Vector3( base / 2, 0,  1.5 * base), // 1
      new THREE.Vector3(-1.5 * base, 0,  base / 2), // 2
      new THREE.Vector3(-base / 2, 0,  base / 2), // 3
      new THREE.Vector3( base / 2, 0,  base / 2), // 4
      new THREE.Vector3( 1.5 * base, 0,  base / 2), // 5
      new THREE.Vector3(-1.5 * base, 0, -base / 2), // 6
      new THREE.Vector3(-base / 2, 0, -base / 2), // 7
      new THREE.Vector3( base / 2, 0, -base / 2), // 8
      new THREE.Vector3( 1.5 * base, 0, -base / 2), // 9
      new THREE.Vector3(-base / 2, 0, -1.5 * base), // 10
      new THREE.Vector3( base / 2, 0, -1.5 * base)  // 11
    ];

    let faces = [
      [3, 0, 1, 0,   [[0, 0], [0, 1], [1, 1]]],
      [1, 4, 3, 0,   [[1, 1], [1, 0], [0, 0]]],
      [2, 3, 6, 1,   [[1, 1], [1, 0], [1, 0]]],
      [3, 7, 6, 1,   [[1, 1], [0, 0], [0, 1]]],
      [3, 4, 7, 2,   [[0, 1], [1, 1], [0, 0]]],
      [4, 8, 7, 3,   [[1, 1], [1, 0], [0, 0]]],
      [4, 5, 8, 4,   [[0, 0], [0, 1], [1, 0]]],
      [5, 9, 8, 4,   [[0, 1], [1, 1], [1, 0]]],
      [7, 8, 10, 5,  [[1, 0], [0, 0], [1, 1]]],
      [8, 11, 10, 5, [[0, 0], [0, 1], [1, 1]]]
    ];

    let vertexOffset = 0
      , faceOffset = 0;

    faces.forEach((f) => {
      if (!openedCube.faceVertexUvs[f[3]]) {
        openedCube.faceVertexUvs[f[3]] = [];
      }

      openedCube.vertices.push(
        vertices[f[0]].clone().setY(thickness),
        vertices[f[1]].clone().setY(thickness),
        vertices[f[2]].clone().setY(thickness)
      );

      openedCube.faces.push(
        new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2,  null, null, f[3])
      );

      if (!openedCube.faceVertexUvs[f[3]][faceOffset]) {
        openedCube.faceVertexUvs[faceOffset] = [];
      }

      for (let i = 0; i < 3; i++) {
        openedCube.faceVertexUvs[f[3]][faceOffset].push(new THREE.Vector2(f[4][i][0], f[4][i][0]));
      }

      faceOffset++;
      vertexOffset += 3;

      openedCube.vertices.push(
        vertices[f[0]].clone().setY(-thickness),
        vertices[f[2]].clone().setY(-thickness),
        vertices[f[1]].clone().setY(-thickness)
      );

      if (!openedCube.faceVertexUvs[f[3]][faceOffset]) {
        openedCube.faceVertexUvs[faceOffset] = [];
      }

      openedCube.faces.push(
        new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2,  null, null, f[3])
      );

      [0, 2, 1].forEach((i) => {
        openedCube.faceVertexUvs[f[3]][faceOffset].push(new THREE.Vector2(f[4][i][0], f[4][i][0]));
      });

      faceOffset++;
      vertexOffset += 3;
    });

    /*[thickness, -thickness].forEach((y) => {
      openedCube.vertices.push(
        vertices[0],
      );
    });

    let addFace = (a, b, c, mat) => {
      openedCube.faces.push(
        new THREE.Face3(a, b, c,  null, null, mat),
        new THREE.Face3(a + 12, c + 12, b + 12,  null, null, mat)
      );
    };

    addFace(3, 0, 1, 0);
    addFace(1, 4, 3, 0);
    addFace(2, 3, 6, 1);
    addFace(3, 7, 6, 1);
    addFace(3, 4, 7, 2);
    addFace(4, 8, 7, 3);
    addFace(4, 5, 8, 4);
    addFace(5, 9, 8, 4);
    addFace(7, 8, 10, 5);
    addFace(8, 11, 10, 5);*/

    function sideFace(a, b, normal, mat=2) {
      openedCube.vertices.push(
        vertices[a].clone().setY( thickness),
        vertices[a].clone().setY(-thickness),
        vertices[b].clone().setY( thickness)
      );

      openedCube.faces.push(
        new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2,  null, null, mat)
      );

      vertexOffset += 3;

      openedCube.vertices.push(
        vertices[b].clone().setY( thickness),
        vertices[a].clone().setY(-thickness),
        vertices[b].clone().setY(-thickness)
      );

      openedCube.faces.push(
        new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2,  null, null, mat)
      );

      vertexOffset += 3;
    }

    sideFace( 3,  0);
    sideFace( 6,  2);
    sideFace(10,  7);
    sideFace( 0,  1);
    sideFace( 2,  3);
    sideFace( 4,  5);
    sideFace( 1,  4);
    sideFace( 5,  9);
    sideFace( 8, 11);
    sideFace( 9,  8);
    sideFace(11, 10);
    sideFace( 7,  6);

    openedCube.elementsNeedUpdate = true;
    openedCube.verticesNeedUpdate = true;
    openedCube.groupsNeedUpdate = true;
    openedCube.uvsNeedUpdate = true;
    openedCube.sortFacesByMaterialIndex();
    openedCube.computeBoundingSphere();
    openedCube.computeFaceNormals()

    /*let geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(openedCube);*/

    return openedCube;
  }
};
