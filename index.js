'use strict';


const express        = require('express')
    , app            = express()
    , SERVER_PORT    = 8000;


app.use('/cabins.json', express.static('modeles/data/all_cabins.json'));
app.use('/colors.json', express.static('modeles/decret2/colors.json'));
app.use(express.static('visu/'));

app.listen(SERVER_PORT, () => {
  console.log('Listenning on', SERVER_PORT);
});
