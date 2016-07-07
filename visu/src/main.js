'use strict';

console.log("   ___      _                           \n  / __\\__ _| |__   __ _ _ __   ___  ___ \n / /  / _` | '_ \\ / _` | '_ \ / _ \\/ __|\n/ /__| (_| | |_) | (_| | | | |  __/\\__ \\\n\\____/\\__,_|_.__/ \\__,_|_| |_|\\___||___/\n                    ____  _    _ _____ \n                   |___ \\| | _/ |___  |\n                     __) | |/ / |  / / \n                    / __/|   <| | / /  \n                   |_____|_|\\_\\_|/_/");

require('./main.scss');

const Renderer        = require('./renderer.js')
    , ActionListener  = require('./action-listener.js');

let container       = document.querySelector('#container')
  , renderer        = new Renderer(container)
  , actionListener  = new ActionListener(renderer, container)
  , CabinsLoader    = require('./loader.js');

let loader = new CabinsLoader(renderer);
loader.load();

renderer.render();
renderer.animate();
