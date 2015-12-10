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

let fs = require('fs')
let flect = require('inflection')
let filepath = ""

let models = [
  "creature",
  "non_player_character",
  "player_character",
  "item",
  "log",
  "log_entry",
  "power",
  "join_player_character_item",
  "join_player_character_power",
  "character_detail"
]

// let models = [
//   "item"
// ]

let definitions = []
let readCount = 0

models.forEach(model => {
  filepath = `./definitions/${model}.js`

  fs.readFile(filepath, 'utf8', (err, data) => {
    if(err) {
      console.error("Could not open file: %s", err)
      return
    }

    try {
      let def = JSON.parse(data)
      definitions.push(def)
      readCount++

      if(readCount === models.length) {
        //trigger everything else
        writeNodeFiles()
        writeNodeSnippets()
        writeTestFiles()
        writeCrudFiles()
      }

    } catch(error) {
      console.log(`problem with ${model}`)
      console.log(error)
      console.log("----------------------------")
    }
    
  })

})

let writeNodeFiles = () => {
  definitions.forEach(def => {
    filepath = `./mongoose-models/${flect.dasherize(def.name)}.js`
    fs.writeFile(filepath, createMongooseModel(def), err => {
      if(err) console.error("Could not write file: %s", err)
    })

    filepath = `./routes/routes-${flect.dasherize(def.name)}.js`
    fs.writeFile(filepath, createRoute(def), err => {
      if(err) console.error("Could not write file: %s", err)
    })

    filepath = `../app/models/${flect.dasherize(def.name)}.js`
    fs.writeFile(filepath, createMongooseModel(def), err => {
      if(err) console.error("Could not write file: %s", err)
    })

    filepath = `../app/routes-${flect.dasherize(def.name)}.js`
    fs.writeFile(filepath, createRoute(def), err => {
      if(err) console.error("Could not write file: %s", err)
    })
  })
}



let writeNodeSnippets = () => {
  let output = ``

  definitions.forEach(def => {
    output += `require('./app/routes-${flect.dasherize(def.name)}.js')(app, passport)\n`
  })

  output += `\n`

  definitions.forEach(def => {
    output += `db.createCollection("${flect.pluralize(def.name)}")\n`
  })


  filepath = `./output/miscellaneous.js`
  fs.writeFile(filepath, output, err => {
    if(err) console.error("Could not write file: %s", err)
  })
}



let writeTestFiles = () => {
  let output = ``
  definitions.forEach(def => {
    output += createTestRow(def)
  })

  let filepath = `./output/test-table-rows.js`
  fs.writeFile(filepath, output, err => {
    if(err) console.error("Could not write file: %s", err)
  })

  filepath = `./output/test-js.js`
  output = createInitialHandlers()

  output += "\n\n\n"

  // output += createFrontEndTestHandler(definitions[0])
  definitions.forEach(def => {
    output += createFrontEndTestHandler(def)
  })

  fs.writeFile(filepath, output, err => {
    if(err) console.error("Could not write file: %s", err)
  })
}


let writeCrudFiles = () => {
  definitions.forEach(def => {
    // filepath = `./crud-files/crud-${flect.dasherize(flect.pluralize(def.name))}-es6.js`
    filepath = `../js/crud-${flect.dasherize(flect.pluralize(def.name))}-es6.js`
    fs.writeFile(filepath, createCrudViewJS(def), err => {if(err) console.error("Could not write file: %s", err)})
  })

  //this will erase any changes made to crud views
  definitions.forEach(def => {
    filepath = `../css/crud-${flect.dasherize(flect.pluralize(def.name))}.css`
    fs.writeFile(filepath, "", err => {if(err) console.error("Could not write file: %s", err)})
  })

  let output = ``
  definitions.forEach(def => {
    output += createCrudRoutes(def)
  })

  filepath = `./output/crud-routes.js`
  fs.writeFile(filepath, output, err => {if(err) console.error("Could not write file: %s", err)})


  output = ``
  definitions.forEach(def => {
    output += createCrudGruntFileAdditions(def)
  })

  filepath = `./output/crud-grunt-file-additions.js`
  fs.writeFile(filepath, output, err => {if(err) console.error("Could not write file: %s", err)})


  definitions.forEach(def => {
    // filepath = `./crud-views/${flect.dasherize(flect.pluralize(def.name))}.ejs`
    filepath = `../views/CRUD/${flect.dasherize(flect.pluralize(def.name))}.ejs`
    fs.writeFile(filepath, createCrudView(def), err => {if(err) console.error("Could not write file: %s", err)})
  })

}





let createInitialHandlers = () => {
  let output = ``
  definitions.forEach(def => {
    output += `abc.handlerTest${flect.camelize(flect.pluralize(def.name))}()\n`
    output += `abc.handlerTestCreate${flect.camelize(def.name)}()\n`
    output += `abc.handlerTestGet${flect.camelize(def.name)}()\n`
    output += `abc.handlerTestPut${flect.camelize(def.name)}()\n`
    output += `abc.handlerTestDelete${flect.camelize(def.name)}()\n`
  })
  return output
}




let createFrontEndTestHandler = def => {
  let output = ``

  output +=`  handlerTest${flect.camelize(flect.pluralize(def.name))}: () => {
    $("#test-${flect.dasherize(flect.pluralize(def.name))}").click(e => {
      abc.get${flect.camelize(flect.pluralize(def.name))}().then(data => {
        console.log(data)
      })
    })
  },

  handlerTestCreate${flect.camelize(def.name)}: () => {
    $("#test-create-${flect.dasherize(def.name)}").click(e => {\n`

  for(let prop in def.properties) {
    output += `      let ${flect.camelize(prop, true)} = "${def.properties[prop].testValue}"\n`
  }

  output +=`\n      let jsonData = JSON.stringify({\n`

  for(let prop in def.properties) {
    output += `        "${flect.camelize(prop, true)}": ${flect.camelize(prop, true)},\n`
  }
  output = output.replace(/(,\n$)/g, "\n")

  output +=`      })

      abc.create${flect.camelize(def.name)}(jsonData).then(data => {
        console.log(data)
        $("#${flect.dasherize(def.name)}-id").html(data.obj._id)
      })
    })
  },

  handlerTestGet${flect.camelize(def.name)}: () => {
    $("#test-get-${flect.dasherize(def.name)}").click(e => {
      let id = $("#${flect.dasherize(def.name)}-id").html()
      
      abc.get${flect.camelize(def.name)}(id).then(data => {
        console.log(data)
      })

    })
  },

  handlerTestPut${flect.camelize(def.name)}: () => {
    $("#test-put-${flect.dasherize(def.name)}").click(e => {
      let id = $("#${flect.dasherize(def.name)}-id").html()\n\n`
      
  for(let prop in def.properties) {
    output += `      let ${flect.camelize(prop, true)} = "${def.properties[prop].updateValue}"\n`
  }

  output +=`\n      let jsonData = JSON.stringify({\n`

  for(let prop in def.properties) {
    output += `        "${flect.camelize(prop, true)}": ${flect.camelize(prop, true)},\n`
  }
  output = output.replace(/(,\n$)/g, "\n")

  output +=`      })

      abc.put${flect.camelize(def.name)}(id, jsonData).then(data => {
        console.log(data)
      })
    })
  },

  handlerTestDelete${flect.camelize(def.name)}: id => {
    $("#test-delete-${flect.dasherize(def.name)}").click(e => {
      let id = $("#${flect.dasherize(def.name)}-id").html()
      
      abc.delete${flect.camelize(def.name)}(id).then(() => {
        console.log("deleted!")
      })

    })
  },

  get${flect.camelize(flect.pluralize(def.name))}: () => {
    let deferred = $.ajax({
      type: "GET",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("get${flect.camelize(flect.pluralize(def.name))}() Error")}
    }).promise()

    return deferred
  },

  create${flect.camelize(def.name)}: jsonData => {
    let deferred = $.ajax({
      type: "POST",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}\`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a ${flect.humanize(def.name)}")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  get${flect.camelize(def.name)}: id => {
    let deferred = $.ajax({
      type: "GET",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("get${flect.camelize(def.name)}() Error")}
    }).promise()

    return deferred
  },

  put${flect.camelize(def.name)}: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a ${flect.humanize(def.name)}")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  delete${flect.camelize(def.name)}: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("delete${flect.camelize(def.name)}() Error")}
    }).promise()

    return deferred
  },\n\n`

  return output
}






let createTestRow = def => {

  let string = `
  <tr>
    <td><button id='test-${flect.dasherize(flect.pluralize(def.name), true)}' class='btn btn-md'>Test ${flect.titleize(flect.pluralize(def.name))}</button></td>
    <td><button id='test-create-${flect.dasherize(def.name)}' class='btn btn-md'>Test Create ${flect.titleize(def.name, true)}</button></td>
    <td><button id='test-get-${flect.dasherize(def.name)}' class='btn btn-md'>Test Get ${flect.titleize(def.name, true)}</button></td>
    <td><button id='test-put-${flect.dasherize(def.name)}' class='btn btn-md'>Test Put ${flect.titleize(def.name, true)}</button></td>
    <td><button id='test-delete-${flect.dasherize(def.name)}' class='btn btn-md'>Test Delete ${flect.titleize(def.name, true)}</button></td>
    <td><div id='${flect.dasherize(def.name)}-id'></div></td>
  </tr>

  `

  return string
}




let createMongooseModel = def => {
  let string = ``

  string += `
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ${flect.camelize(def.name, true)}Schema = new Schema({\n`

  for(let prop in def.properties) {
    string += `  ${flect.camelize(prop, true)}: String,\n`
  }
  string = string.replace(/(,\n$)/g, "\n")

  string += `})

module.exports = mongoose.model('${flect.camelize(def.name)}', ${flect.camelize(def.name, true)}Schema, '${flect.pluralize(def.name)}')`

  return string
}



let createRoute = def => {

  let string = `
  
  var ${flect.camelize(def.name)} = require('../app/models/${flect.dasherize(def.name)}')

  module.exports = function(app, passport) {

    app.get('/${flect.camelize(flect.pluralize(def.name), true)}', function(req, res) {
      ${flect.camelize(def.name)}.find(function(err, ${flect.camelize(flect.pluralize(def.name), true)}) {
        if(err)
          res.send(err)
        res.json(${flect.camelize(flect.pluralize(def.name), true)})
      })
    })

    app.post('/${flect.camelize(flect.pluralize(def.name), true)}', function(req, res) {
      var ${flect.camelize(def.name, true)} = new ${flect.camelize(def.name)}()\n\n`

  for(let prop in def.properties) {
    string += `      ${flect.camelize(def.name, true)}.${flect.camelize(prop, true)} = req.body.${flect.camelize(prop, true)}\n`
  }

  string += `\n      ${flect.camelize(def.name, true)}.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: '${flect.humanize(def.name)} created!', obj: ${flect.camelize(def.name, true)}})
      })
    })

    app.get('/${flect.camelize(flect.pluralize(def.name), true)}/:${def.name}_id', function(req, res) {
      ${flect.camelize(def.name)}.findById(req.params.${def.name}_id, function(err, ${flect.camelize(def.name, true)}) {
        if(err)
          res.send(err)
        res.json(${flect.camelize(def.name, true)})
      })
    })

    app.put('/${flect.camelize(flect.pluralize(def.name), true)}/:${def.name}_id', function(req, res) {
      ${flect.camelize(def.name)}.findById(req.params.${def.name}_id, function(err, ${flect.camelize(def.name, true)}) {\n\n`


  for(let prop in def.properties) {
    string += `        ${flect.camelize(def.name, true)}.${flect.camelize(prop, true)} = req.body.${flect.camelize(prop, true)}\n`
  }

  string +=`\n        ${flect.camelize(def.name, true)}.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: '${flect.humanize(def.name)} updated!', obj: ${flect.camelize(def.name, true)}})
        })
      })
    })

    app.delete('/${flect.camelize(flect.pluralize(def.name), true)}/:${def.name}_id', function(req, res) {
      ${flect.camelize(def.name)}.remove({_id: req.params.${def.name}_id}, function(err, ${flect.camelize(def.name, true)}) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  `


  return string
}



let createCrudViewJS = def => {
  let output = `$(() => {
  abc.initialize()
  // ebot.updateDocumentation(abc)
})

let abc = {
  
  initialize: () => {
    abc.assignInitialHandlers()
    ebot.insertModalHtml()
  },

  assignInitialHandlers: () => {
    abc.handler${flect.camelize(def.name)}CreateButton()
    abc.get${flect.camelize(flect.pluralize(def.name))}().then(${flect.camelize(flect.pluralize(def.name), true)} => {
      abc.${flect.camelize(flect.pluralize(def.name), true)} = ${flect.camelize(flect.pluralize(def.name), true)}
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = \`<table id='${flect.dasherize(def.name)}-table' class='table'>\`

    htmlString += \`
    <tr>\n`

    for(let prop in def.properties) {
      output += `      <th>${flect.titleize(prop)}</th>\n`
    }
      // <th>Item Id</th>
      // <th>Name</th>
      // <th>Cost</th>
      // <th>Effect</th>
      // <th>Flavor Text</th>
      // <th>Image Filename</th>
  output += `      <th></th>
      <th></th>
    </tr>\`

    abc.${flect.camelize(flect.pluralize(def.name), true)}.forEach(${flect.camelize(def.name, true)} => {
      htmlString += \`<tr data-id='\$\{${flect.camelize(def.name, true)}._id\}'>\`\n`
  
  
      for(let prop in def.properties) {
        output += `      htmlString += \`<td>\$\{${flect.camelize(def.name, true)}.${flect.camelize(prop, true)}\}</td>\`\n`
      }
      // htmlString += \`<td>\$\{item.itemId\}</td>\`
      // htmlString += \`<td>\$\{item.name\}</td>\`
      // htmlString += \`<td>\$\{item.cost\}</td>\`
      // htmlString += \`<td>\$\{item.effect\}</td>\`
      // htmlString += \`<td>\$\{item.flavorText\}</td>\`
      // htmlString += \`<td>\$\{item.imageFilename\}</td>\`

  output += `      htmlString += \`<td><button class='btn btn-sm update-${flect.dasherize(def.name)}' data-id='\$\{${flect.camelize(def.name, true)}._id\}'>Update</button></td>\`
      htmlString += \`<td><button class='btn btn-sm delete-${flect.dasherize(def.name)}' data-id='\$\{${flect.camelize(def.name, true)}._id\}'>Delete</button></td>\`
      htmlString += \`</tr>\`
    })


    htmlString += \`</table>\`
    $("#${flect.dasherize(def.name)}-table-wrapper").html(htmlString)
    abc.handler${flect.camelize(def.name)}Table()
  },

  handler${flect.camelize(def.name)}Table: () => {
    $(".update-${flect.dasherize(def.name)}").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(\`Update ${flect.titleize(def.name)}\`, abc.get${flect.camelize(def.name)}Form())
      abc.fill${flect.camelize(def.name)}FormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-${flect.dasherize(def.name)}").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(\`Are you sure?\`, \`<button id='submit-deletion' class='btn btn-lg form-control' data-id='\$\{id\}' type='submit'>Yes</button>\`)
      abc.handlerDelete()
    })
  },

  handler${flect.camelize(def.name)}CreateButton: () => {
    $("#${flect.dasherize(def.name)}-create-button").click(e => {
      ebot.showModal("New ${flect.titleize(def.name)}", abc.get${flect.camelize(def.name)}Form())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({\n`

        for(let prop in def.properties) {
          output += `        "${flect.camelize(prop, true)}": $("#${flect.dasherize(prop)}").val(),\n`
        }
        output = output.replace(/,\n$/g, "\n")

        // "itemId": $("#item-id").val(),
        // "name": $("#name").val(),
        // "cost": $("#cost").val(),
        // "flavorText": $("#flavor-text").val(),
        // "effect": $("#effect").val(),
        // "imageFilename": $("#image-filename").val()

  output += `      })

      abc.create${flect.camelize(def.name)}(jsonData).then(data => {
        abc.get${flect.camelize(flect.pluralize(def.name))}().then(${flect.camelize(flect.pluralize(def.name), true)} => {
          abc.${flect.camelize(flect.pluralize(def.name), true)} = ${flect.camelize(flect.pluralize(def.name), true)}
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({\n`

        for(let prop in def.properties) {
          output += `        "${flect.camelize(prop, true)}": $("#${flect.dasherize(prop)}").val(),\n`
        }
        output = output.replace(/,\n$/g, "\n")

        // "itemId": $("#item-id").val(),
        // "name": $("#name").val(),
        // "cost": $("#cost").val(),
        // "flavorText": $("#flavor-text").val(),
        // "effect": $("#effect").val(),
        // "imageFilename": $("#image-filename").val()
  output += `      })

      abc.update${flect.camelize(def.name)}(id, jsonData).then(data => {
        abc.get${flect.camelize(flect.pluralize(def.name))}().then(${flect.camelize(flect.pluralize(def.name), true)} => {
          abc.${flect.camelize(flect.pluralize(def.name), true)} = ${flect.camelize(flect.pluralize(def.name), true)}
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerDelete: () => {
    $("#submit-deletion").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      abc.delete${flect.camelize(def.name)}(id).then(() => {
        ebot.hideModal()
        $(\`tr[data-id=\$\{id\}]\`).remove()
      })
    })
  },

  get${flect.camelize(def.name)}Form: () => {
    let htmlString = \`\n`

    for(let prop in def.properties) {
      switch(def.properties[prop].elementType) {
        case "select":
          output += `    <select id='${flect.dasherize(prop)}' class='form-control' data-placeholder='Choose an option...'>\n    <option value=''></option>\n`
  
          def.properties[prop].selectOptions.forEach(option => {
            output += `    <option value='${option}'>${option}</option>\n`
          })
          
          output += `    </select><br />\n`

          break
        case "number":
          output += `    <label>${flect.titleize(prop)}</label> <input id='${flect.dasherize(prop)}' type='number' class='form-control'><br />\n`
          break
        case "date":
          output += `    <label>${flect.titleize(prop)}</label> <input id='${flect.dasherize(prop)}' type='date' class='form-control'><br />\n`
          break
        case "checkbox":
          output += `    <label>${flect.titleize(prop)}</label> <input id='${flect.dasherize(prop)}' type='checkbox' class='form-control'><br />\n`
          break
        case "textarea":
          output += `    <label>${flect.titleize(prop)}</label> <textarea id='${flect.dasherize(prop)}' class='form-control'></textarea><br /><br />\n`
          break
        default: //text
          output += `    <label>${flect.titleize(prop)}</label> <input id='${flect.dasherize(prop)}' class='form-control'><br />\n`
      }
    }

    // <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />
    // <label>Name</label> <input id='name' class='form-control'><br />
    // <label>Cost</label> <input id='cost' class='form-control'><br />
    // <label>Effect</label> <input id='effect' class='form-control'><br />
    // <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />
    // <label>Image Filename</label> <input id='image-filename' class='form-control'><br />
    // <button id='submit' class='form-control' type='submit'>Submit</button>\`

  output += `    <button id='submit' class='form-control' type='submit'>Submit</button>\`
    return htmlString
  },

  fill${flect.camelize(def.name)}FormWithOldData: id => {
    abc.get${flect.camelize(def.name)}(id).then(data => {\n`

      for(let prop in def.properties) {
        output += `      $("#${flect.dasherize(prop)}").val(data.${flect.camelize(prop, true)}),\n`
      }
      output = output.replace(/,\n$/g, "\n")
      // $("#item-id").val(data.itemId),
      // $("#name").val(data.name),
      // $("#cost").val(data.cost),
      // $("#flavor-text").val(data.flavorText),
      // $("#effect").val(data.effect),
      // $("#image-filename").val(data.imageFilename)
  output += `    })
  },

  get${flect.camelize(flect.pluralize(def.name))}: () => {
    let deferred = $.ajax({
      type: "GET",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("get${flect.camelize(def.name)}s() Error")}
    }).promise()

    return deferred
  },

  create${flect.camelize(def.name)}: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}\`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a ${flect.titleize(def.name)}")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  get${flect.camelize(def.name)}: id => {
    let deferred = $.ajax({
      type: "GET",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("get${flect.camelize(def.name)}() Error")}
    }).promise()

    return deferred
  },

  update${flect.camelize(def.name)}: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a ${flect.titleize(def.name)}")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  delete${flect.camelize(def.name)}: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: \`\$\{abc.apiurl\}/${flect.camelize(flect.pluralize(def.name), true)}/\$\{id\}\`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("delete${flect.camelize(def.name)}() Error")}
    }).promise()

    return deferred
  },

  convertJsonToFormData: json => {
    let string = \`\`

    json = JSON.parse(json)

    for(let prop in json) {
      let converted = \`\$\{prop\}=\$\{encodeURI(json[prop])\}&\`
      converted = converted.replace(/%20/g, "+")
      string += converted
    }
    string = string.replace(/&$/g, "")

    return string
  },

  // apiurl: "http://localhost:8082",
  apiurl: "http://192.241.203.33:8082",

  ${flect.camelize(flect.pluralize(def.name), true)}: []

}`

  return output
}



let createCrudRoutes = def => {
  let output = `
  app.get('/crud-${flect.dasherize(flect.pluralize(def.name))}', function(req, res) {
    res.render('CRUD/${flect.dasherize(flect.pluralize(def.name))}.ejs', {
        user : req.user
    })
  })\n\n`

  return output
}

let createCrudGruntFileAdditions = def => {
  let output = `
  babel_crud_${flect.underscore(flect.pluralize(def.name))}: {
    files: [
      'js/crud-${flect.dasherize(flect.pluralize(def.name))}-es6.js'
    ],
    tasks: ['babel:crud_${flect.underscore(flect.pluralize(def.name))}'],
  },

  crud_${flect.underscore(flect.pluralize(def.name))}: {
    files: {
      'js/crud-${flect.dasherize(flect.pluralize(def.name))}.js': 'js/crud-${flect.dasherize(flect.pluralize(def.name))}-es6.js'
    }
  },

  `

  return output
}

let createCrudView = def => {
  let output = `
  <!doctype html>
  <html>
  <head>
      <title>${flect.titleize(flect.pluralize(def.name))}</title>

      <link rel="stylesheet" type="text/css" media="screen" href="css/crud-${flect.dasherize(flect.pluralize(def.name))}.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="css/vis.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="css/chosen.min.css" />

      <script type="text/javascript" src="js/jquery.js"></script>
      <script type="text/javascript" src="js/jquery-ui.js"></script>
      <script type="text/javascript" src="js/chosen.jquery.js"></script>
      <script type="text/javascript" src="js/moment.js"></script>
      <script type="text/javascript" src="js/vis.js"></script>
      <script type="text/javascript" src="js/bootstrap.js"></script>
      <script type="text/javascript" src="js/inflection.js"></script>
      <script type="text/javascript" src="js/deepcopy.js"></script>
      <script type="text/javascript" src="js/socket-io.js"></script>
      <script type="text/javascript" src="js/ebot.js"></script>
      <script type="text/javascript" src="node_modules/howler/howler.js"></script>
    <script type="text/javascript" src="js/crud-${flect.dasherize(flect.pluralize(def.name))}.js"></script>

  </head>
  <body>


  <button id='${flect.dasherize(def.name)}-create-button' class='btn btn-md'>New ${flect.titleize(def.name)}</button>

  <div id='${flect.dasherize(def.name)}-table-wrapper'></div>

  <div id='modal-holder'></div>
      
  </body>
  </html>

  `

  return output
}