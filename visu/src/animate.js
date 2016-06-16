'use strict';

const defaultAnimationLength = 1000;
const defaultAnimationEase   = createjs.Ease.quintInOut;

function animate(target, properties, cb = null) {
  let tween = createjs.Tween.get(target);
  tween.to(properties, defaultAnimationLength, defaultAnimationEase);

  if (cb != null) {
    tween.addEventListener("change", cb);
  }
}

module.exports = animate;
