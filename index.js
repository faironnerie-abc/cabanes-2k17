'use strict';


const express        = require('express')
    , app            = express()
    , SERVER_PORT    = 8000;


app.use('/cabanes.json', express.static('modeles/data/all_cabins.json'));
app.use(express.static('visu/'));

app.listen(SERVER_PORT, () => {
  console.log('Listenning on', SERVER_PORT);
});
