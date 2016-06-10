'use strict';


const express        = require('express')
    , app            = express()
    , SERVER_PORT    = 8000;


app.use(express.static('visu/'));

app.listen(SERVER_PORT, () => {
  console.log('Listenning on', SERVER_PORT);
});
