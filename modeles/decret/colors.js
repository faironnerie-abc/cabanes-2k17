'use strict';

const fs   = require('fs')
    , path = require('path');

const MIN_WORD_LENGTH = 9;

function getColorCode(charCode) {
  let c = charCode % 60;
  return [Math.floor(c / 10), c % 6];
}

function getColor(data) {
  let t = [];
  let colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let bands = [];

  for (let i = 0; i < 8; i++) {
    if (bands.length == 0) {
      bands = [0, 1, 2, 3, 4, 5];
    }

    let cc  = getColorCode(data.charCodeAt(i))
      , idx1 = cc[0] % colors.length
      , idx2 = cc[1] % bands.length;

    cc[0] = colors[idx1];
    colors.splice(idx1, 1);

    cc[1] = bands[idx2];
    bands.splice(idx2, 1);

    t.push(cc);
  }

  return t;
}

function areColorsEquals(c1, c2) {
  for (let i = 0; i < 8; i++) {
    let cond = false;

    for (let j = 0; j < 8; j++) {
      if (c1[i][0] == c2[j][0] && c1[i][1] == c2[j][1]) {
        cond = true;
      }
    }

    if (!cond) {
      return false;
    }
  }

  return true;
}

function removeDuplication(a, cb) {
  let tmp = [];

  for (let i = 0; i < a.length - 1; i++) {
    let uniq = true;

    for (let j = 0; j < tmp.length; j++) {
      if (cb(a[i], tmp[j])) {
        uniq = false;
      }
    }

    if (uniq) {
      tmp.push(a[i]);
    }
  }

  return tmp;
}

fs.readFile(path.join(__dirname, 'decret1517.txt'), (err, data) => {
  if (err) {
    console.log("Error :", err);
  }
  else {
    let words = data.toString().split(/\s+/)
      , tmp   = [];

    console.log("Starts with", words.length, "words");

    words = words.filter(w => {return w.length >= MIN_WORD_LENGTH}).map(w => w.substr(0, MIN_WORD_LENGTH));

    console.log('', words.length, "words remaining after filter (", MIN_WORD_LENGTH, ")");

    words = removeDuplication(words, (a, b) => a == b);

    console.log('', words.length, "words remaining after uniqness check");

    let colors = words.map(w => {
      return getColor(w)
    });

    colors = removeDuplication(colors, areColorsEquals);

    console.log('', colors.length, "colors remaining");

    fs.writeFile(path.join(__dirname, 'colors.json'), JSON.stringify({colors: colors}), err => {
      if (err) {
        console.log("Can not write file :", err);
      }
      else {
        console.log("Done");
      }
    });
  }
});
