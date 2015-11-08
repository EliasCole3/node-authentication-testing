//babel generator-es6.js --out-file generator.js
//npm install --global babel-cli@5.8.26
//npm install grunt-babel@^5.*.*

let fs = require('fs')
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

models.forEach(model => {
  filepath = `./definitions/${model}.js`

  fs.readFile(filepath, 'utf8', (err, data) => {
    if(err) {
      console.error("Could not open file: %s", err)
      return
    }

    try {
      let def = JSON.parse(data)
      let output = ""
      filepath = "./output/" + def.name + ".js"

      for(let prop in def.properties) {
        output += prop + "\n"
      }

      fs.writeFile(filepath, output, err => {
        if(err) console.error("Could not write file: %s", err)
      })
    } catch(e) {
      console.log(`problem with ${model}`)
    }
    
  })

})

