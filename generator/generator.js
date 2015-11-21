//babel generator-es6.js --out-file generator.js
//npm install --global babel-cli@5.8.26
//npm install grunt-babel@^5.*.*

// ${flect.camelize(flect.pluralize(def.name))}
// ${flect.camelize(flect.pluralize(def.name), true)}
// ${flect.titleize(flect.pluralize(def.name))}
// ${flect.dasherize(flect.pluralize(def.name))}
// ${flect.underscore(flect.pluralize(def.name))}
// ${flect.dasherize(def.name)}
// ${flect.camelize(def.name)}
// ${flect.camelize(def.name, true)}
// ${flect.titleize(def.name)}

// for(let prop in def.properties) {
//   output += ``
// }

'use strict';

var fs = require('fs');
var flect = require('inflection');
var filepath = "";

var models = ["creature", "non_player_character", "player_character", "item", "log", "log_entry", "power", "join_player_character_item", "character_detail"];

// let models = [
//   "item"
// ]

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
        writeCrudFiles();
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

var writeCrudFiles = function writeCrudFiles() {
  definitions.forEach(function (def) {
    // filepath = `./crud-files/crud-${flect.dasherize(flect.pluralize(def.name))}-es6.js`
    filepath = '../js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '-es6.js';
    fs.writeFile(filepath, createCrudViewJS(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });
  });

  //this will erase any changes made to crud views
  definitions.forEach(function (def) {
    filepath = '../css/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.css';
    fs.writeFile(filepath, "", function (err) {
      if (err) console.error("Could not write file: %s", err);
    });
  });

  var output = '';
  definitions.forEach(function (def) {
    output += createCrudRoutes(def);
  });

  filepath = './output/crud-routes.js';
  fs.writeFile(filepath, output, function (err) {
    if (err) console.error("Could not write file: %s", err);
  });

  output = '';
  definitions.forEach(function (def) {
    output += createCrudGruntFileAdditions(def);
  });

  filepath = './output/crud-grunt-file-additions.js';
  fs.writeFile(filepath, output, function (err) {
    if (err) console.error("Could not write file: %s", err);
  });

  definitions.forEach(function (def) {
    // filepath = `./crud-views/${flect.dasherize(flect.pluralize(def.name))}.ejs`
    filepath = '../views/CRUD/' + flect.dasherize(flect.pluralize(def.name)) + '.ejs';
    fs.writeFile(filepath, createCrudView(def), function (err) {
      if (err) console.error("Could not write file: %s", err);
    });
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

  string += '})\n\nmodule.exports = mongoose.model(\'' + flect.camelize(def.name) + '\', ' + flect.camelize(def.name, true) + 'Schema, \'' + flect.pluralize(def.name) + '\')';

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

var createCrudViewJS = function createCrudViewJS(def) {
  var output = '$(() => {\n  abc.initialize()\n  // ebot.updateDocumentation(abc)\n})\n\nlet abc = {\n  \n  initialize: () => {\n    abc.assignInitialHandlers()\n    ebot.insertModalHtml()\n  },\n\n  assignInitialHandlers: () => {\n    abc.handler' + flect.camelize(def.name) + 'CreateButton()\n    abc.get' + flect.camelize(flect.pluralize(def.name)) + '().then(' + flect.camelize(flect.pluralize(def.name), true) + ' => {\n      abc.' + flect.camelize(flect.pluralize(def.name), true) + ' = ' + flect.camelize(flect.pluralize(def.name), true) + '\n      abc.createTable()\n    })\n  },\n\n  createTable: () => {\n    let htmlString = `<table id=\'' + flect.dasherize(def.name) + '-table\' class=\'table\'>`\n\n    htmlString += `\n    <tr>\n';

  for (var prop in def.properties) {
    output += '      <th>' + flect.titleize(prop) + '</th>\n';
  }
  // <th>Item Id</th>
  // <th>Name</th>
  // <th>Cost</th>
  // <th>Effect</th>
  // <th>Flavor Text</th>
  // <th>Image Filename</th>
  output += '      <th></th>\n      <th></th>\n    </tr>`\n\n    abc.' + flect.camelize(flect.pluralize(def.name), true) + '.forEach(' + flect.camelize(def.name, true) + ' => {\n      htmlString += `<tr data-id=\'${' + flect.camelize(def.name, true) + '._id}\'>`\n';

  for (var prop in def.properties) {
    output += '      htmlString += `<td>${' + flect.camelize(def.name, true) + '.' + flect.camelize(prop, true) + '}</td>`\n';
  }
  // htmlString += \`<td>\$\{item.itemId\}</td>\`
  // htmlString += \`<td>\$\{item.name\}</td>\`
  // htmlString += \`<td>\$\{item.cost\}</td>\`
  // htmlString += \`<td>\$\{item.effect\}</td>\`
  // htmlString += \`<td>\$\{item.flavorText\}</td>\`
  // htmlString += \`<td>\$\{item.imageFilename\}</td>\`

  output += '      htmlString += `<td><button class=\'btn btn-sm update-' + flect.dasherize(def.name) + '\' data-id=\'${' + flect.camelize(def.name, true) + '._id}\'>Update</button></td>`\n      htmlString += `<td><button class=\'btn btn-sm delete-' + flect.dasherize(def.name) + '\' data-id=\'${' + flect.camelize(def.name, true) + '._id}\'>Delete</button></td>`\n      htmlString += `</tr>`\n    })\n\n\n    htmlString += `</table>`\n    $("#' + flect.dasherize(def.name) + '-table-wrapper").html(htmlString)\n    abc.handler' + flect.camelize(def.name) + 'Table()\n  },\n\n  handler' + flect.camelize(def.name) + 'Table: () => {\n    $(".update-' + flect.dasherize(def.name) + '").click(e => {\n      let button = $(e.currentTarget)\n      let id = button.attr("data-id")\n      ebot.showModal(`Update ' + flect.titleize(def.name) + '`, abc.get' + flect.camelize(def.name) + 'Form())\n      abc.fill' + flect.camelize(def.name) + 'FormWithOldData(id)\n      abc.handlerUpdate(id)\n    })\n\n    $(".delete-' + flect.dasherize(def.name) + '").click(e => {\n      let button = $(e.currentTarget)\n      let id = button.attr("data-id")\n      ebot.showModal(`Are you sure?`, `<button id=\'submit-deletion\' class=\'btn btn-lg form-control\' data-id=\'${id}\' type=\'submit\'>Yes</button>`)\n      abc.handlerDelete()\n    })\n  },\n\n  handler' + flect.camelize(def.name) + 'CreateButton: () => {\n    $("#' + flect.dasherize(def.name) + '-create-button").click(e => {\n      ebot.showModal("New ' + flect.titleize(def.name) + '", abc.get' + flect.camelize(def.name) + 'Form())\n      abc.handlerCreate()\n    })\n  },\n\n  handlerCreate: () => {\n    $("#submit").click(e => {\n      let jsonData = JSON.stringify({\n';

  for (var prop in def.properties) {
    output += '        "' + flect.camelize(prop, true) + '": $("#' + flect.dasherize(prop) + '").val(),\n';
  }
  output = output.replace(/,\n$/g, "\n");

  // "itemId": $("#item-id").val(),
  // "name": $("#name").val(),
  // "cost": $("#cost").val(),
  // "flavorText": $("#flavor-text").val(),
  // "effect": $("#effect").val(),
  // "imageFilename": $("#image-filename").val()

  output += '      })\n\n      abc.create' + flect.camelize(def.name) + '(jsonData).then(data => {\n        abc.get' + flect.camelize(flect.pluralize(def.name)) + '().then(' + flect.camelize(flect.pluralize(def.name), true) + ' => {\n          abc.' + flect.camelize(flect.pluralize(def.name), true) + ' = ' + flect.camelize(flect.pluralize(def.name), true) + '\n          abc.createTable()\n          ebot.hideModal()\n        })\n      })\n    })\n  },\n\n  handlerUpdate: id => {\n    $("#submit").click(e => {\n      let jsonData = JSON.stringify({\n';

  for (var prop in def.properties) {
    output += '        "' + flect.camelize(prop, true) + '": $("#' + flect.dasherize(prop) + '").val(),\n';
  }
  output = output.replace(/,\n$/g, "\n");

  // "itemId": $("#item-id").val(),
  // "name": $("#name").val(),
  // "cost": $("#cost").val(),
  // "flavorText": $("#flavor-text").val(),
  // "effect": $("#effect").val(),
  // "imageFilename": $("#image-filename").val()
  output += '      })\n\n      abc.update' + flect.camelize(def.name) + '(id, jsonData).then(data => {\n        abc.get' + flect.camelize(flect.pluralize(def.name)) + '().then(' + flect.camelize(flect.pluralize(def.name), true) + ' => {\n          abc.' + flect.camelize(flect.pluralize(def.name), true) + ' = ' + flect.camelize(flect.pluralize(def.name), true) + '\n          abc.createTable()\n          ebot.hideModal()\n        })\n      })\n    })\n  },\n\n  handlerDelete: () => {\n    $("#submit-deletion").click(e => {\n      let button = $(e.currentTarget)\n      let id = button.attr("data-id")\n      abc.delete' + flect.camelize(def.name) + '(id).then(() => {\n        ebot.hideModal()\n        $(`tr[data-id=${id}]`).remove()\n      })\n    })\n  },\n\n  get' + flect.camelize(def.name) + 'Form: () => {\n    let htmlString = `\n';

  for (var prop in def.properties) {
    switch (def.properties[prop].elementType) {
      case "select":
        output += '    <select id=\'' + flect.dasherize(prop) + '\' class=\'form-control\' data-placeholder=\'Choose an option...\'>\n    <option value=\'\'></option>\n';

        def.properties[prop].selectOptions.forEach(function (option) {
          output += '    <option value=\'' + option + '\'>' + option + '</option>\n';
        });

        output += '    </select><br />\n';

        break;
      case "number":
        output += '    <label>' + flect.titleize(prop) + '</label> <input id=\'' + flect.dasherize(prop) + '\' type=\'number\' class=\'form-control\'><br />\n';
        break;
      case "date":
        output += '    <label>' + flect.titleize(prop) + '</label> <input id=\'' + flect.dasherize(prop) + '\' type=\'date\' class=\'form-control\'><br />\n';
        break;
      case "checkbox":
        output += '    <label>' + flect.titleize(prop) + '</label> <input id=\'' + flect.dasherize(prop) + '\' type=\'checkbox\' class=\'form-control\'><br />\n';
        break;
      case "textarea":
        output += '    <label>' + flect.titleize(prop) + '</label> <textarea id=\'' + flect.dasherize(prop) + '\' class=\'form-control\'></textarea><br /><br />\n';
        break;
      default:
        //text
        output += '    <label>' + flect.titleize(prop) + '</label> <input id=\'' + flect.dasherize(prop) + '\' class=\'form-control\'><br />\n';
    }
  }

  // <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />
  // <label>Name</label> <input id='name' class='form-control'><br />
  // <label>Cost</label> <input id='cost' class='form-control'><br />
  // <label>Effect</label> <input id='effect' class='form-control'><br />
  // <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />
  // <label>Image Filename</label> <input id='image-filename' class='form-control'><br />
  // <button id='submit' class='form-control' type='submit'>Submit</button>\`

  output += '    <button id=\'submit\' class=\'form-control\' type=\'submit\'>Submit</button>`\n    return htmlString\n  },\n\n  fill' + flect.camelize(def.name) + 'FormWithOldData: id => {\n    abc.get' + flect.camelize(def.name) + '(id).then(data => {\n';

  for (var prop in def.properties) {
    output += '      $("#' + flect.dasherize(prop) + '").val(data.' + flect.camelize(prop, true) + '),\n';
  }
  output = output.replace(/,\n$/g, "\n");
  // $("#item-id").val(data.itemId),
  // $("#name").val(data.name),
  // $("#cost").val(data.cost),
  // $("#flavor-text").val(data.flavorText),
  // $("#effect").val(data.effect),
  // $("#image-filename").val(data.imageFilename)
  output += '    })\n  },\n\n  get' + flect.camelize(flect.pluralize(def.name)) + ': () => {\n    let deferred = $.ajax({\n      type: "GET",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("get' + flect.camelize(def.name) + 's() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n  create' + flect.camelize(def.name) + ': jsonData => {\n    console.log(jsonData)\n    let deferred = $.ajax({\n      type: "POST",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '`,\n      data: abc.convertJsonToFormData(jsonData),\n      contentType: "application/x-www-form-urlencoded; charset=UTF-8",\n      success: (data, status, jqXHR) => {},\n      error: (jqXHR, status) => {\n        ebot.notify("error creating a ' + flect.titleize(def.name) + '")\n        console.log(jqXHR)\n      }\n    }).promise()\n\n    return deferred\n  },\n\n  get' + flect.camelize(def.name) + ': id => {\n    let deferred = $.ajax({\n      type: "GET",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("get' + flect.camelize(def.name) + '() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n  update' + flect.camelize(def.name) + ': (id, jsonData) => {\n    let deferred = $.ajax({\n      type: "PUT",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      data: abc.convertJsonToFormData(jsonData),\n      contentType: "application/x-www-form-urlencoded; charset=UTF-8",\n      success: (data, status, jqXHR) => {},\n      error: (jqXHR, status) => {\n        ebot.notify("error updating a ' + flect.titleize(def.name) + '")\n        console.log(jqXHR)\n      }\n    }).promise()\n\n    return deferred\n  },\n\n  delete' + flect.camelize(def.name) + ': id => {\n    let deferred = $.ajax({\n      type: "DELETE",\n      url: `${abc.apiurl}/' + flect.camelize(flect.pluralize(def.name), true) + '/${id}`,\n      success: function(data, status, jqXHR) {},\n      error: function(jqXHR, status) {console.log("delete' + flect.camelize(def.name) + '() Error")}\n    }).promise()\n\n    return deferred\n  },\n\n  convertJsonToFormData: json => {\n    let string = ``\n\n    json = JSON.parse(json)\n\n    for(let prop in json) {\n      let converted = `${prop}=${encodeURI(json[prop])}&`\n      converted = converted.replace(/%20/g, "+")\n      string += converted\n    }\n    string = string.replace(/&$/g, "")\n\n    return string\n  },\n\n  // apiurl: "http://localhost:8082",\n  apiurl: "http://192.241.203.33:8082",\n\n  ' + flect.camelize(flect.pluralize(def.name), true) + ': []\n\n}';

  return output;
};

var createCrudRoutes = function createCrudRoutes(def) {
  var output = '\n  app.get(\'/crud-' + flect.dasherize(flect.pluralize(def.name)) + '\', function(req, res) {\n    res.render(\'CRUD/' + flect.dasherize(flect.pluralize(def.name)) + '.ejs\', {\n        user : req.user\n    })\n  })\n\n  app.get(\'/css/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.css\', function(req, res) {\n    res.sendFile(path.resolve(__dirname + \'./../css/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.css\'))\n  })\n\n  app.get(\'/js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.js\', function(req, res) {\n    res.sendFile(path.resolve(__dirname + \'./../js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.js\'))\n  })\n\n';

  return output;
};

var createCrudGruntFileAdditions = function createCrudGruntFileAdditions(def) {
  var output = '\n  babel_crud_' + flect.underscore(flect.pluralize(def.name)) + ': {\n    files: [\n      \'js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '-es6.js\'\n    ],\n    tasks: [\'babel:crud_' + flect.underscore(flect.pluralize(def.name)) + '\'],\n  },\n\n  crud_' + flect.underscore(flect.pluralize(def.name)) + ': {\n    files: {\n      \'js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.js\': \'js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '-es6.js\'\n    }\n  },\n\n  ';

  return output;
};

var createCrudView = function createCrudView(def) {
  var output = '\n  <!doctype html>\n  <html>\n  <head>\n      <title>' + flect.titleize(flect.pluralize(def.name)) + '</title>\n\n      <link rel="stylesheet" type="text/css" media="screen" href="css/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.css" />\n      <link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.css" />\n      <link rel="stylesheet" type="text/css" media="screen" href="css/vis.css" />\n      <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" />\n      <link rel="stylesheet" type="text/css" media="screen" href="css/chosen.min.css" />\n\n      <script type="text/javascript" src="js/jquery.js"></script>\n      <script type="text/javascript" src="js/jquery-ui.js"></script>\n      <script type="text/javascript" src="js/chosen.jquery.js"></script>\n      <script type="text/javascript" src="js/moment.js"></script>\n      <script type="text/javascript" src="js/vis.js"></script>\n      <script type="text/javascript" src="js/bootstrap.js"></script>\n      <script type="text/javascript" src="js/inflection.js"></script>\n      <script type="text/javascript" src="js/deepcopy.js"></script>\n      <script type="text/javascript" src="js/socket-io.js"></script>\n      <script type="text/javascript" src="js/ebot.js"></script>\n      <script type="text/javascript" src="node_modules/howler/howler.js"></script>\n    <script type="text/javascript" src="js/crud-' + flect.dasherize(flect.pluralize(def.name)) + '.js"></script>\n\n  </head>\n  <body>\n\n\n  <button id=\'' + flect.dasherize(def.name) + '-create-button\' class=\'btn btn-md\'>New ' + flect.titleize(def.name) + '</button>\n\n  <div id=\'' + flect.dasherize(def.name) + '-table-wrapper\'></div>\n\n  <div id=\'modal-holder\'></div>\n      \n  </body>\n  </html>\n\n  ';

  return output;
};
//# sourceMappingURL=generator.js.map
