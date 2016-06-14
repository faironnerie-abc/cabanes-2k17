'use strict';

function rnd(n) {
    return Math.floor(Math.random() * n);
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
  }
};
