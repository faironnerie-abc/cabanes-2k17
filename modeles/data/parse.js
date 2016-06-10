'use strict';

const fs = require('fs')
    , path = require('path')
    , parseXML = require('xml2js').parseString;

fs.readFile(path.join(__dirname, './PlacementCabane.xml'), (err, data) => {
  if (err) {
    console.log(err);
  }
  else {
    let cabanes = [];

    parseXML(data, (err, result) => {
      Object.keys(result.cabanes).forEach(k => {
        result.cabanes[k].forEach(g => {
          console.log("Groupe", g["$"].id, g.cabane.length, "cabanes");

          g.cabane.forEach(c => {
            cabanes.push({
              id: cabanes.length,
              x: c.coordonnee[0].colonne,
              y: c.coordonnee[0].ligne,
              orientation: c.orientation
            });
          });
        });
      });
    });

    fs.writeFile(path.join(__dirname, 'cabanes.json'), JSON.stringify({cabanes:cabanes}), err => {
      if (err) {
        console.log("Can not write file :", err);
      }
      else {
        console.log("Done");
      }
    });
  }
});
