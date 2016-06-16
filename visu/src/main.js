'use strict';

require('./main.scss');

const Renderer        = require('./renderer.js')
    , ActionListener  = require('./action-listener.js');

let container       = document.querySelector('#container')
  , renderer        = new Renderer(container)
  , actionListener  = new ActionListener(renderer, container);

renderer.render();
renderer.animate();
renderer.rendererDomElement.focus();
