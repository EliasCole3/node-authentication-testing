//babel generator-es6.js --out-file generator.js
//npm install --global babel-cli@5.8.26
//npm install grunt-babel@^5.*.*

// ${flect.camelize(flect.pluralize(def.name))}
// ${flect.camelize(flect.pluralize(def.name), true)}
// ${flect.titleize(flect.pluralize(def.name))}
// ${flect.dasherize(flect.pluralize(def.name))}
// ${flect.dasherize(def.name)}
// ${flect.camelize(def.name)}
// ${flect.camelize(def.name, true)}
// ${flect.titleize(def.name)}

'use strict';

var fs = require('fs');
var flect = require('inflection');
var filepath = "";

var models = ["creature", "non_player_character", "player_character", "item", "log", "log_entry", "power"];

var definitions = [];
var readCount = 0;

models.forEach(function (model) {
  filepath = './definitions/' + model + '.js';

  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      console.error("Could not open file: %s", err);
      return;
    }

    try {
      var def = JSON.parse(data);
      definitions.push(def);
      readCount++;

      if (readCount === models.length) {
        //trigger everything else
        writeNodeFiles();
        writeNodeSnippets();
        writeTestFiles();
      }
    } catch (error) {
      console.log('problem with ' + model);
      console.log(error);
      console.log("----------------------------");
    }
  });
});

var writeNodeFiles = function writeNodeFiles() {
  definitions.forEach(function (def) {
    filepath = './mongoose-models/' + flect.dasherize(def.name) + '.js';
    fs.writeFile(filepath, createMongooseModel(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });

    filepath = './routes/routes-' + flect.dasherize(def.name) + '.js';
    fs.writeFile(filepath, createRoute(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });

    filepath = '../app/models/' + flect.dasherize(def.name) + '.js';
    fs.writeFile(filepath, createMongooseModel(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });

    filepath = '../app/routes-' + flect.dasherize(def.name) + '.js';
    fs.writeFile(filepath, createRoute(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });
  });
};

var writeNodeSnippets = function writeNodeSnippets() {
  var output = '';

  definitions.forEach(function (def) {
    output += 'require(\'./app/routes-' + flect.dasherize(def.name) + '.js\')(app, passport)\n';
  });

  output += '\n';

  definitions.forEach(function (def) {
    output += 'db.createCollection("' + flect.pluralize(def.name) + '")\n';
  });

  filepath = './output/miscellaneous.js';
  fs.writeFile(filepath, output, function (err) {
    if (err) console.error("Could not write file: %s", err);
  });
};

var writeTestFiles = function writeTestFiles() {
  var output = '';
  definitions.forEach(function (def) {
    output += createTestRow(def);
  });

  var filepath = './output/test-table-rows.js';
  fs.writeFile(filepath, output, function (err) {
    if (err) console.error("Could not write file: %s", err);
  });

  filepath = './output/test-js.js';
  output = createInitialHandlers();

  output += "\n\n\n";

  // output += createFrontEndTestHandler(definitions[0])
  definitions.forEach(function (def) {
    output += createFrontEndTestHandler(def);
  });

  fs.writeFile(filepath, output, function (err) {
    if (err) console.error("Could not write file: %s", err);
  });
};

var createInitialHandlers = function createInitialHandlers() {
  var output = '';
  definitions.forEach(function (def) {
    output += 'abc.handlerTest' + flect.camelize(flect.pluralize(def.name)) + '()\n';
    output += 'abc.handlerTestCreate' + flect.camelize(def.name) + '()\n';
    output += 'abc.handlerTestGet' + flect.camelize(def.name) + '()\n';
    output += 'abc.handlerTestPut' + flect.camelize(def.name) + '()\n';
    output += 'abc.handlerTestDelete' + flect.camelize(def.name) + '()\n';
  });
  return output;
};

var createFrontEndTestHandler = function createFrontEndTestHandler(def) {
  var output = '';

  output += '  handlerTest' + flect.camelize(flect.pluralize(def.name)) + ': () => {\n    $("#test-' + flect.dasherize(flect.pluralize(def.name)) + '").click(e => {\n      abc.get' + flect.camelize(flect.pluralize(def.name)) + '().then(data => {\n        console.log(data)\n      })\n    })\n  },\n\n  handlerTestCreate' + flect.camelize(def.name) + ': () => {\n    $("#test-create-' + flect.dasherize(def.name) + '").click(e => {\n';

  for (var prop in def.properties) {
    output += '      let ' + flect.camelize(prop, true) + ' = "' + def.properties[prop].testValue + '"\n';
  }

  output += '\n      let jsonData = JSON.stringify({\n';

  for (var prop in def.properties) {
    output += '        "' + flect.camelize(prop, true) + '": ' + flect.camelize(prop, true) + ',\n';
  }
  output = output.replace(/(,\n$)/g, "\n");

  output += '      })\n\n      abc.create' + flect.camelize(def.name) + '(jsonData).then(data => {\n        console.log(data)\n        $("#' + flect.dasherize(def.name) + '-id").html(data.obj._id)\n      })\n    })\n  },\n\n  handlerTestGet' + flect.camelize(def.name) + ': () => {\n    $("#test-get-' + flect.dasherize(def.name) + '").click(e => {\n      let id = $("#' + flect.dasherize(def.name) + '-id").html()\n      \n      abc.get' + flect.camelize(def.name) + '(id).then(data => {\n        console.log(data)\n      })\n\n    })\n  },\n\n  handlerTestPut' + flect.camelize(def.name) + ': () => {\n    $("#test-put-' + flect.dasherize(def.name) + '").click(e => {\n      let id = $("#' + flect.dasherize(def.name) + '-id").html()\n\n';

  for (var prop in def.properties) {
    output += '      let ' + flect.camelize(prop, true) + ' = "' + def.properties[prop].updateValue + '"\n';
  }

  output += '\n      let jsonData = JSON.stringify({\n';

  for (var prop in def.properties) {
    output += '        "' + flect.camelize(prop, true) + '": ' + flect.camelize(prop, true) + ',\n';
  }
  output = output.replace(/(,\n$)/g, "\n");

  output += '      })\n\n      abc.put' + flect.camelize(def.name) + '(id, jsonData).then(data => {\n        console.log(data)\n      })\n    })\n  },\n\n  handlerTestDelete' + flect.camelize(def.name) + ': id => {\n    $("#test-delete-' + flect.dasherize(def.name) + '").click(e => {\n      let id = $("#' + flect.dasherize(def.name) + '-id").html()\n      \n      abc.delete' + flect.camelize(def.name) + '(id).then(() => {\n        console.log("deleted!")\n      })\n\n    })\n  },\n\n  get' + flect.camelize(flect.pluralize(def.name)) + ': () => {\n    let deferred = $.ajax({\n      type: "GET",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("get' + flect.camelize(flect.pluralize(def.name)) + '() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n  create' + flect.camelize(def.name) + ': jsonData => {\n    let deferred = $.ajax({\n      type: "POST",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '`,\n      data: abc.convertJsonToFormData(jsonData),\n      contentType: "application/x-www-form-urlencoded; charset=UTF-8",\n      success: (data, status, jqXHR) => {},\n      error: (jqXHR, status) => {\n        ebot.notify("error creating a ' + flect.humanize(def.name) + '")\n        console.log(jqXHR)\n      }\n    }).promise()\n\n    return deferred\n  },\n\n  get' + flect.camelize(def.name) + ': id => {\n    let deferred = $.ajax({\n      type: "GET",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("get' + flect.camelize(def.name) + '() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n  put' + flect.camelize(def.name) + ': (id, jsonData) => {\n    let deferred = $.ajax({\n      type: "PUT",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      data: abc.convertJsonToFormData(jsonData),\n      contentType: "application/x-www-form-urlencoded; charset=UTF-8",\n      success: (data, status, jqXHR) => {},\n      error: (jqXHR, status) => {\n        ebot.notify("error updating a ' + flect.humanize(def.name) + '")\n        console.log(jqXHR)\n      }\n    }).promise()\n\n    return deferred\n  },\n\n  delete' + flect.camelize(def.name) + ': id => {\n    let deferred = $.ajax({\n      type: "DELETE",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("delete' + flect.camelize(def.name) + '() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n';

  return output;
};

var createTestRow = function createTestRow(def) {

  var string = '\n  <tr>\n    <td><button id=\'test-' + flect.dasherize(flect.pluralize(def.name), true) + '\' class=\'btn btn-md\'>Test ' + flect.titleize(flect.pluralize(def.name)) + '</button></td>\n    <td><button id=\'test-create-' + flect.dasherize(def.name) + '\' class=\'btn btn-md\'>Test Create ' + flect.titleize(def.name, true) + '</button></td>\n    <td><button id=\'test-get-' + flect.dasherize(def.name) + '\' class=\'btn btn-md\'>Test Get ' + flect.titleize(def.name, true) + '</button></td>\n    <td><button id=\'test-put-' + flect.dasherize(def.name) + '\' class=\'btn btn-md\'>Test Put ' + flect.titleize(def.name, true) + '</button></td>\n    <td><button id=\'test-delete-' + flect.dasherize(def.name) + '\' class=\'btn btn-md\'>Test Delete ' + flect.titleize(def.name, true) + '</button></td>\n    <td><div id=\'' + flect.dasherize(def.name) + '-id\'></div></td>\n  </tr>\n\n  ';

  return string;
};

var createMongooseModel = function createMongooseModel(def) {
  var string = '';

  string += '\nvar mongoose = require(\'mongoose\')\nvar Schema = mongoose.Schema\n\nvar ' + flect.camelize(def.name, true) + 'Schema = new Schema({\n';

  for (var prop in def.properties) {
    string += '  ' + flect.camelize(prop, true) + ': String,\n';
  }
  string = string.replace(/(,\n$)/g, "\n");

  string += '})\n\nmodule.exports = mongoose.model(\'' + flect.camelize(def.name) + '\', ' + flect.camelize(def.name, true) + 'Schema)';

  return string;
};

var createRoute = function createRoute(def) {

  var string = '\n  \n  var ' + flect.camelize(def.name) + ' = require(\'../app/models/' + flect.dasherize(def.name) + '\')\n\n  module.exports = function(app, passport) {\n\n    app.get(\'/' + flect.camelize(flect.pluralize(def.name), true) + '\', function(req, res) {\n      ' + flect.camelize(def.name) + '.find(function(err, ' + flect.camelize(flect.pluralize(def.name), true) + ') {\n        if(err)\n          res.send(err)\n        res.json(' + flect.camelize(flect.pluralize(def.name), true) + ')\n      })\n    })\n\n    app.post(\'/' + flect.camelize(flect.pluralize(def.name), true) + '\', function(req, res) {\n      var ' + flect.camelize(def.name, true) + ' = new ' + flect.camelize(def.name) + '()\n\n';

  for (var prop in def.properties) {
    string += '      ' + flect.camelize(def.name, true) + '.' + flect.camelize(prop, true) + ' = req.body.' + flect.camelize(prop, true) + '\n';
  }

  string += '\n      ' + flect.camelize(def.name, true) + '.save(function(err) {\n        if(err)\n          res.send(err)\n        res.json({message: \'' + flect.humanize(def.name) + ' created!\', obj: ' + flect.camelize(def.name, true) + '})\n      })\n    })\n\n    app.get(\'/' + flect.camelize(flect.pluralize(def.name), true) + '/:' + def.name + '_id\', function(req, res) {\n      ' + flect.camelize(def.name) + '.findById(req.params.' + def.name + '_id, function(err, ' + flect.camelize(def.name, true) + ') {\n        if(err)\n          res.send(err)\n        res.json(' + flect.camelize(def.name, true) + ')\n      })\n    })\n\n    app.put(\'/' + flect.camelize(flect.pluralize(def.name), true) + '/:' + def.name + '_id\', function(req, res) {\n      ' + flect.camelize(def.name) + '.findById(req.params.' + def.name + '_id, function(err, ' + flect.camelize(def.name, true) + ') {\n\n';

  for (var prop in def.properties) {
    string += '        ' + flect.camelize(def.name, true) + '.' + flect.camelize(prop, true) + ' = req.body.' + flect.camelize(prop, true) + '\n';
  }

  string += '\n        ' + flect.camelize(def.name, true) + '.save(function(err) {\n          if(err)\n            res.send(err)\n          res.json({message: \'' + flect.humanize(def.name) + ' updated!\', obj: ' + flect.camelize(def.name, true) + '})\n        })\n      })\n    })\n\n    app.delete(\'/' + flect.camelize(flect.pluralize(def.name), true) + '/:' + def.name + '_id\', function(req, res) {\n      ' + flect.camelize(def.name) + '.remove({_id: req.params.' + def.name + '_id}, function(err, ' + flect.camelize(def.name, true) + ') {\n        if(err)\n          res.send(err)\n        res.json({message: \'Successfully deleted\'})\n      })\n    })\n\n  }\n\n  ';

  return string;
};
//# sourceMappingURL=generator.js.map
