'use strict';

const A = 11 * 16; // px

let acm = A * 2.54 / 96;

for (let l = 30; l <= 40; l++) {
    let c = Math.ceil(713 / l);
    let h = Math.round(1.5 * acm * l);
    let w = Math.round(4 * acm * c);
    console.log(l, c , h , w);
}
