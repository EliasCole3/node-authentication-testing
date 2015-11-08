//babel generator-es6.js --out-file generator.js
//npm install --global babel-cli@5.8.26
//npm install grunt-babel@^5.*.*

"use strict";

var fs = require('fs');
var filepath = "";

var models = ["creature", "non_player_character", "player_character", "item", "log", "log_entry", "power"];

models.forEach(function (model) {
  filepath = "./definitions/" + model + ".js";

  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      console.error("Could not open file: %s", err);
      return;
    }

    try {
      var def = JSON.parse(data);
      var output = "";
      filepath = "./output/" + def.name + ".js";

      for (var prop in def.properties) {
        output += prop + "\n";
      }

      fs.writeFile(filepath, output, function (err) {
        if (err) console.error("Could not write file: %s", err);
      });
    } catch (e) {
      console.log("problem with " + model);
    }
  });
});
//# sourceMappingURL=generator.js.map
