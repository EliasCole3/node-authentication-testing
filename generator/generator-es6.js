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
  "power"
]

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
      }

    } catch(error) {
      console.log(`problem with ${model}`)
      console.log(error)
      console.log("----------------------------")
    }
    
  })

})

let writeNodeFiles = function() {
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



let writeNodeSnippets = function() {
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



let writeTestFiles = function() {
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








let createInitialHandlers = function() {
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




let createFrontEndTestHandler = function(def) {
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






let createTestRow = function(def) {

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




let createMongooseModel = function(def) {
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

module.exports = mongoose.model('${flect.camelize(def.name)}', ${flect.camelize(def.name, true)}Schema)`

  return string
}



let createRoute = function(def) {

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