$(() => {
  abc.initialize()
  // ebot.updateDocumentation(abc)
})


/**
 * initialize()
 * assignInitialHandlers()
 * handlerTestLogEntries()
 * handlerTestCreateLogEntry()
 * handlerTestGetLogEntry()
 * handlerTestPutLogEntry()
 * handlerTestDeleteLogEntry()
 * getLogEntries()
 * createLogEntry()
 * getLogEntry()
 * putLogEntry()
 * deleteLogEntry()
 * convertJsonToFormData()
 *
 * apiurl
 */
let abc = {
  
  initialize: () => {
    abc.assignInitialHandlers()
  },

  assignInitialHandlers: () => {
    // abc.handlerTestLogEntries()
    // abc.handlerTestCreateLogEntry()
    // abc.handlerTestGetLogEntry()
    // abc.handlerTestPutLogEntry()
    // abc.handlerTestDeleteLogEntry()

    abc.handlerTestCreatures()
    abc.handlerTestCreateCreature()
    abc.handlerTestGetCreature()
    abc.handlerTestPutCreature()
    abc.handlerTestDeleteCreature()
    abc.handlerTestNonPlayerCharacters()
    abc.handlerTestCreateNonPlayerCharacter()
    abc.handlerTestGetNonPlayerCharacter()
    abc.handlerTestPutNonPlayerCharacter()
    abc.handlerTestDeleteNonPlayerCharacter()
    abc.handlerTestItems()
    abc.handlerTestCreateItem()
    abc.handlerTestGetItem()
    abc.handlerTestPutItem()
    abc.handlerTestDeleteItem()
    abc.handlerTestPlayerCharacters()
    abc.handlerTestCreatePlayerCharacter()
    abc.handlerTestGetPlayerCharacter()
    abc.handlerTestPutPlayerCharacter()
    abc.handlerTestDeletePlayerCharacter()
    abc.handlerTestLogs()
    abc.handlerTestCreateLog()
    abc.handlerTestGetLog()
    abc.handlerTestPutLog()
    abc.handlerTestDeleteLog()
    abc.handlerTestLogEntries()
    abc.handlerTestCreateLogEntry()
    abc.handlerTestGetLogEntry()
    abc.handlerTestPutLogEntry()
    abc.handlerTestDeleteLogEntry()
    abc.handlerTestPowers()
    abc.handlerTestCreatePower()
    abc.handlerTestGetPower()
    abc.handlerTestPutPower()
    abc.handlerTestDeletePower()

  },

  // handlerTestLogEntries: () => {
  //   $("#test-log-entries").click(e => {
  //     abc.getLogEntries().then(data => {
  //       console.log(data)
  //     })
  //   })
  // },

  // handlerTestCreateLogEntry: () => {
  //   $("#test-create-log-entry").click(e => {
  //     let logEntryId = "1"
  //     let message = "this is a log entry"
  //     let date = "11-09-15"
  //     let logId = "1"

  //     let jsonData = JSON.stringify({
  //       "logEntryId": logEntryId,
  //       "message": message,
  //       "date": date,
  //       "logId": logId
  //     })

  //     abc.createLogEntry(jsonData).then(data => {
  //       console.log(data)
  //       $("#log-entry-id").html(data.obj._id)
  //     })
  //   })
  // },

  // handlerTestGetLogEntry: () => {
  //   $("#test-get-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()
      
  //     abc.getLogEntry(id).then(data => {
  //       console.log(data)
  //     })

  //   })
  // },

  // handlerTestPutLogEntry: () => {
  //   $("#test-put-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()
      
  //     let logEntryId = "12"
  //     let message = "this is a log entry :D"
  //     let date = "11-09-15"
  //     let logId = "12"

  //     let jsonData = JSON.stringify({
  //       "logEntryId": logEntryId,
  //       "message": message,
  //       "date": date,
  //       "logId": logId
  //     })

  //     abc.putLogEntry(id, jsonData).then(data => {
  //       console.log(data)
  //     })
  //   })
  // },

  // handlerTestDeleteLogEntry: id => {
  //   $("#test-delete-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()
      
  //     abc.deleteLogEntry(id).then(() => {
  //       console.log("deleted!")
  //     })

  //   })
  // },

  // getLogEntries: () => {
  //   let deferred = $.ajax({
  //     type: "GET",
  //     url: `${abc.apiurl}/logEntries`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("getLogEntries() Error")}
  //   }).promise()

  //   return deferred
  // },

  // createLogEntry: jsonData => {
  //   let deferred = $.ajax({
  //     type: "POST",
  //     url: `${abc.apiurl}/logEntries`,
  //     data: abc.convertJsonToFormData(jsonData),
  //     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //     success: (data, status, jqXHR) => {},
  //     error: (jqXHR, status) => {
  //       ebot.notify("error creating a log entry")
  //       console.log(jqXHR)
  //     }
  //   }).promise()

  //   return deferred
  // },

  // getLogEntry: id => {
  //   let deferred = $.ajax({
  //     type: "GET",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("getLogEntry() Error")}
  //   }).promise()

  //   return deferred
  // },

  // putLogEntry: (id, jsonData) => {
  //   let deferred = $.ajax({
  //     type: "PUT",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     data: abc.convertJsonToFormData(jsonData),
  //     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //     success: (data, status, jqXHR) => {},
  //     error: (jqXHR, status) => {
  //       ebot.notify("error updating a log entry")
  //       console.log(jqXHR)
  //     }
  //   }).promise()

  //   return deferred
  // },

  // deleteLogEntry: id => {
  //   let deferred = $.ajax({
  //     type: "DELETE",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("deleteLogEntry() Error")}
  //   }).promise()

  //   return deferred
  // },

  convertJsonToFormData: json => {
    let string = ``

    json = JSON.parse(json)

    for(let prop in json) {
      let converted = `${prop}=${encodeURI(json[prop])}&`
      converted = converted.replace(/%20/g, "+")
      string += converted
    }
    string = string.replace(/&$/g, "")

    return string
  },

  apiurl: "http://localhost:8082",





















































  handlerTestCreatures: () => {
      $("#test-creatures").click(e => {
        abc.getCreatures().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreateCreature: () => {
      $("#test-create-creature").click(e => {
        let creatureId = ":)"
        let name = ":)"
        let race = ":)"
        let hp = ":)"
        let ac = ":)"
        let will = ":)"
        let reflex = ":)"
        let goldValue = ":)"
        let xpValue = ":)"
        let level = ":)"
        let baseToHitAc = ":)"
        let baseToHitWill = ":)"
        let baseToHitReflex = ":)"
        let damageModifier = ":)"
        let speed = ":)"
        let initiative = ":)"
        let imageFilename = ":)"

        let jsonData = JSON.stringify({
          "creatureId": creatureId,
          "name": name,
          "race": race,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "goldValue": goldValue,
          "xpValue": xpValue,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "imageFilename": imageFilename
        })

        abc.createCreature(jsonData).then(data => {
          console.log(data)
          $("#creature-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetCreature: () => {
      $("#test-get-creature").click(e => {
        let id = $("#creature-id").html()
        
        abc.getCreature(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutCreature: () => {
      $("#test-put-creature").click(e => {
        let id = $("#creature-id").html()

        let creatureId = ":D"
        let name = ":D"
        let race = ":D"
        let hp = ":D"
        let ac = ":D"
        let will = ":D"
        let reflex = ":D"
        let goldValue = ":D"
        let xpValue = ":D"
        let level = ":D"
        let baseToHitAc = ":D"
        let baseToHitWill = ":D"
        let baseToHitReflex = ":D"
        let damageModifier = ":D"
        let speed = ":D"
        let initiative = ":D"
        let imageFilename = ":D"

        let jsonData = JSON.stringify({
          "creatureId": creatureId,
          "name": name,
          "race": race,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "goldValue": goldValue,
          "xpValue": xpValue,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "imageFilename": imageFilename
        })

        abc.putCreature(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeleteCreature: id => {
      $("#test-delete-creature").click(e => {
        let id = $("#creature-id").html()
        
        abc.deleteCreature(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getCreatures: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/creatures`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getCreatures() Error")}
      }).promise()

      return deferred
    },

    createCreature: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/creatures`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Creature")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getCreature: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/creatures/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getCreature() Error")}
      }).promise()

      return deferred
    },

    putCreature: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/creatures/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Creature")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deleteCreature: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/creatures/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deleteCreature() Error")}
      }).promise()

      return deferred
    },

    handlerTestNonPlayerCharacters: () => {
      $("#test-non-player-characters").click(e => {
        abc.getNonPlayerCharacters().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreateNonPlayerCharacter: () => {
      $("#test-create-non-player-character").click(e => {
        let nonPlayerCharacterId = ":)"
        let playerName = ":)"
        let characterName = ":)"
        let race = ":)"
        let gClass = ":)"
        let hp = ":)"
        let ac = ":)"
        let will = ":)"
        let reflex = ":)"
        let strength = ":)"
        let constitution = ":)"
        let dexterity = ":)"
        let intelligence = ":)"
        let wisdom = ":)"
        let charisma = ":)"
        let gold = ":)"
        let xp = ":)"
        let level = ":)"
        let baseToHitAc = ":)"
        let baseToHitWill = ":)"
        let baseToHitReflex = ":)"
        let damageModifier = ":)"
        let speed = ":)"
        let initiative = ":)"
        let actionPoints = ":)"
        let imageFilename = ":)"

        let jsonData = JSON.stringify({
          "nonPlayerCharacterId": nonPlayerCharacterId,
          "playerName": playerName,
          "characterName": characterName,
          "race": race,
          "gClass": gClass,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "strength": strength,
          "constitution": constitution,
          "dexterity": dexterity,
          "intelligence": intelligence,
          "wisdom": wisdom,
          "charisma": charisma,
          "gold": gold,
          "xp": xp,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "actionPoints": actionPoints,
          "imageFilename": imageFilename
        })

        abc.createNonPlayerCharacter(jsonData).then(data => {
          console.log(data)
          $("#non-player-character-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetNonPlayerCharacter: () => {
      $("#test-get-non-player-character").click(e => {
        let id = $("#non-player-character-id").html()
        
        abc.getNonPlayerCharacter(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutNonPlayerCharacter: () => {
      $("#test-put-non-player-character").click(e => {
        let id = $("#non-player-character-id").html()

        let nonPlayerCharacterId = ":D"
        let playerName = ":D"
        let characterName = ":D"
        let race = ":D"
        let gClass = ":D"
        let hp = ":D"
        let ac = ":D"
        let will = ":D"
        let reflex = ":D"
        let strength = ":D"
        let constitution = ":D"
        let dexterity = ":D"
        let intelligence = ":D"
        let wisdom = ":D"
        let charisma = ":D"
        let gold = ":D"
        let xp = ":D"
        let level = ":D"
        let baseToHitAc = ":D"
        let baseToHitWill = ":D"
        let baseToHitReflex = ":D"
        let damageModifier = ":D"
        let speed = ":D"
        let initiative = ":D"
        let actionPoints = ":D"
        let imageFilename = ":D"

        let jsonData = JSON.stringify({
          "nonPlayerCharacterId": nonPlayerCharacterId,
          "playerName": playerName,
          "characterName": characterName,
          "race": race,
          "gClass": gClass,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "strength": strength,
          "constitution": constitution,
          "dexterity": dexterity,
          "intelligence": intelligence,
          "wisdom": wisdom,
          "charisma": charisma,
          "gold": gold,
          "xp": xp,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "actionPoints": actionPoints,
          "imageFilename": imageFilename
        })

        abc.putNonPlayerCharacter(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeleteNonPlayerCharacter: id => {
      $("#test-delete-non-player-character").click(e => {
        let id = $("#non-player-character-id").html()
        
        abc.deleteNonPlayerCharacter(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getNonPlayerCharacters: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/nonPlayerCharacters`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getNonPlayerCharacters() Error")}
      }).promise()

      return deferred
    },

    createNonPlayerCharacter: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/nonPlayerCharacters`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Non player character")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getNonPlayerCharacter: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/nonPlayerCharacters/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getNonPlayerCharacter() Error")}
      }).promise()

      return deferred
    },

    putNonPlayerCharacter: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/nonPlayerCharacters/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Non player character")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deleteNonPlayerCharacter: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/nonPlayerCharacters/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deleteNonPlayerCharacter() Error")}
      }).promise()

      return deferred
    },

    handlerTestItems: () => {
      $("#test-items").click(e => {
        abc.getItems().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreateItem: () => {
      $("#test-create-item").click(e => {
        let itemId = ":)"
        let name = ":)"
        let cost = ":)"
        let flavorText = ":)"
        let effect = ":)"
        let imageFilename = ":)"

        let jsonData = JSON.stringify({
          "itemId": itemId,
          "name": name,
          "cost": cost,
          "flavorText": flavorText,
          "effect": effect,
          "imageFilename": imageFilename
        })

        abc.createItem(jsonData).then(data => {
          console.log(data)
          $("#item-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetItem: () => {
      $("#test-get-item").click(e => {
        let id = $("#item-id").html()
        
        abc.getItem(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutItem: () => {
      $("#test-put-item").click(e => {
        let id = $("#item-id").html()

        let itemId = ":D"
        let name = ":D"
        let cost = ":D"
        let flavorText = ":D"
        let effect = ":D"
        let imageFilename = ":D"

        let jsonData = JSON.stringify({
          "itemId": itemId,
          "name": name,
          "cost": cost,
          "flavorText": flavorText,
          "effect": effect,
          "imageFilename": imageFilename
        })

        abc.putItem(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeleteItem: id => {
      $("#test-delete-item").click(e => {
        let id = $("#item-id").html()
        
        abc.deleteItem(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getItems: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/items`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getItems() Error")}
      }).promise()

      return deferred
    },

    createItem: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/items`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Item")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getItem: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/items/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getItem() Error")}
      }).promise()

      return deferred
    },

    putItem: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/items/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Item")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deleteItem: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/items/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deleteItem() Error")}
      }).promise()

      return deferred
    },

    handlerTestPlayerCharacters: () => {
      $("#test-player-characters").click(e => {
        abc.getPlayerCharacters().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreatePlayerCharacter: () => {
      $("#test-create-player-character").click(e => {
        let playerCharacterId = ":)"
        let playerName = ":)"
        let characterName = ":)"
        let race = ":)"
        let gClass = ":)"
        let hp = ":)"
        let ac = ":)"
        let will = ":)"
        let reflex = ":)"
        let strength = ":)"
        let constitution = ":)"
        let dexterity = ":)"
        let intelligence = ":)"
        let wisdom = ":)"
        let charisma = ":)"
        let gold = ":)"
        let xp = ":)"
        let level = ":)"
        let baseToHitAc = ":)"
        let baseToHitWill = ":)"
        let baseToHitReflex = ":)"
        let damageModifier = ":)"
        let speed = ":)"
        let initiative = ":)"
        let actionPoints = ":)"
        let imageFilename = ":)"

        let jsonData = JSON.stringify({
          "playerCharacterId": playerCharacterId,
          "playerName": playerName,
          "characterName": characterName,
          "race": race,
          "gClass": gClass,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "strength": strength,
          "constitution": constitution,
          "dexterity": dexterity,
          "intelligence": intelligence,
          "wisdom": wisdom,
          "charisma": charisma,
          "gold": gold,
          "xp": xp,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "actionPoints": actionPoints,
          "imageFilename": imageFilename
        })

        abc.createPlayerCharacter(jsonData).then(data => {
          console.log(data)
          $("#player-character-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetPlayerCharacter: () => {
      $("#test-get-player-character").click(e => {
        let id = $("#player-character-id").html()
        
        abc.getPlayerCharacter(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutPlayerCharacter: () => {
      $("#test-put-player-character").click(e => {
        let id = $("#player-character-id").html()

        let playerCharacterId = ":D"
        let playerName = ":D"
        let characterName = ":D"
        let race = ":D"
        let gClass = ":D"
        let hp = ":D"
        let ac = ":D"
        let will = ":D"
        let reflex = ":D"
        let strength = ":D"
        let constitution = ":D"
        let dexterity = ":D"
        let intelligence = ":D"
        let wisdom = ":D"
        let charisma = ":D"
        let gold = ":D"
        let xp = ":D"
        let level = ":D"
        let baseToHitAc = ":D"
        let baseToHitWill = ":D"
        let baseToHitReflex = ":D"
        let damageModifier = ":D"
        let speed = ":D"
        let initiative = ":D"
        let actionPoints = ":D"
        let imageFilename = ":D"

        let jsonData = JSON.stringify({
          "playerCharacterId": playerCharacterId,
          "playerName": playerName,
          "characterName": characterName,
          "race": race,
          "gClass": gClass,
          "hp": hp,
          "ac": ac,
          "will": will,
          "reflex": reflex,
          "strength": strength,
          "constitution": constitution,
          "dexterity": dexterity,
          "intelligence": intelligence,
          "wisdom": wisdom,
          "charisma": charisma,
          "gold": gold,
          "xp": xp,
          "level": level,
          "baseToHitAc": baseToHitAc,
          "baseToHitWill": baseToHitWill,
          "baseToHitReflex": baseToHitReflex,
          "damageModifier": damageModifier,
          "speed": speed,
          "initiative": initiative,
          "actionPoints": actionPoints,
          "imageFilename": imageFilename
        })

        abc.putPlayerCharacter(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeletePlayerCharacter: id => {
      $("#test-delete-player-character").click(e => {
        let id = $("#player-character-id").html()
        
        abc.deletePlayerCharacter(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getPlayerCharacters: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/playerCharacters`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getPlayerCharacters() Error")}
      }).promise()

      return deferred
    },

    createPlayerCharacter: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/playerCharacters`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Player character")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getPlayerCharacter: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/playerCharacters/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getPlayerCharacter() Error")}
      }).promise()

      return deferred
    },

    putPlayerCharacter: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/playerCharacters/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Player character")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deletePlayerCharacter: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/playerCharacters/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deletePlayerCharacter() Error")}
      }).promise()

      return deferred
    },

    handlerTestLogEntries: () => {
      $("#test-log-entries").click(e => {
        abc.getLogEntries().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreateLogEntry: () => {
      $("#test-create-log-entry").click(e => {
        let logEntryId = ":)"
        let message = ":)"
        let date = ":)"
        let logId = ":)"

        let jsonData = JSON.stringify({
          "logEntryId": logEntryId,
          "message": message,
          "date": date,
          "logId": logId
        })

        abc.createLogEntry(jsonData).then(data => {
          console.log(data)
          $("#log-entry-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetLogEntry: () => {
      $("#test-get-log-entry").click(e => {
        let id = $("#log-entry-id").html()
        
        abc.getLogEntry(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutLogEntry: () => {
      $("#test-put-log-entry").click(e => {
        let id = $("#log-entry-id").html()

        let logEntryId = ":D"
        let message = ":D"
        let date = ":D"
        let logId = ":D"

        let jsonData = JSON.stringify({
          "logEntryId": logEntryId,
          "message": message,
          "date": date,
          "logId": logId
        })

        abc.putLogEntry(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeleteLogEntry: id => {
      $("#test-delete-log-entry").click(e => {
        let id = $("#log-entry-id").html()
        
        abc.deleteLogEntry(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getLogEntries: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/logEntries`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getLogEntries() Error")}
      }).promise()

      return deferred
    },

    createLogEntry: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/logEntries`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Log entry")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getLogEntry: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/logEntries/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getLogEntry() Error")}
      }).promise()

      return deferred
    },

    putLogEntry: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/logEntries/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Log entry")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deleteLogEntry: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/logEntries/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deleteLogEntry() Error")}
      }).promise()

      return deferred
    },

    handlerTestPowers: () => {
      $("#test-powers").click(e => {
        abc.getPowers().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreatePower: () => {
      $("#test-create-power").click(e => {
        let powerId = ":)"
        let name = ":)"
        let type = ":)"
        let flavorText = ":)"
        let attackType = ":)"
        let damage = ":)"
        let effect = ":)"
        let description = ":)"
        let upgrade = ":)"
        let imageFilename = ":)"

        let jsonData = JSON.stringify({
          "powerId": powerId,
          "name": name,
          "type": type,
          "flavorText": flavorText,
          "attackType": attackType,
          "damage": damage,
          "effect": effect,
          "description": description,
          "upgrade": upgrade,
          "imageFilename": imageFilename
        })

        abc.createPower(jsonData).then(data => {
          console.log(data)
          $("#power-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetPower: () => {
      $("#test-get-power").click(e => {
        let id = $("#power-id").html()
        
        abc.getPower(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutPower: () => {
      $("#test-put-power").click(e => {
        let id = $("#power-id").html()

        let powerId = ":D"
        let name = ":D"
        let type = ":D"
        let flavorText = ":D"
        let attackType = ":D"
        let damage = ":D"
        let effect = ":D"
        let description = ":D"
        let upgrade = ":D"
        let imageFilename = ":D"

        let jsonData = JSON.stringify({
          "powerId": powerId,
          "name": name,
          "type": type,
          "flavorText": flavorText,
          "attackType": attackType,
          "damage": damage,
          "effect": effect,
          "description": description,
          "upgrade": upgrade,
          "imageFilename": imageFilename
        })

        abc.putPower(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeletePower: id => {
      $("#test-delete-power").click(e => {
        let id = $("#power-id").html()
        
        abc.deletePower(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getPowers: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/powers`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getPowers() Error")}
      }).promise()

      return deferred
    },

    createPower: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/powers`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Power")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getPower: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/powers/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getPower() Error")}
      }).promise()

      return deferred
    },

    putPower: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/powers/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Power")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deletePower: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/powers/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deletePower() Error")}
      }).promise()

      return deferred
    },

    handlerTestLogs: () => {
      $("#test-logs").click(e => {
        abc.getLogs().then(data => {
          console.log(data)
        })
      })
    },

    handlerTestCreateLog: () => {
      $("#test-create-log").click(e => {
        let logId = ":)"
        let logName = ":)"
        let playerCharacterId = ":)"

        let jsonData = JSON.stringify({
          "logId": logId,
          "logName": logName,
          "playerCharacterId": playerCharacterId
        })

        abc.createLog(jsonData).then(data => {
          console.log(data)
          $("#log-id").html(data.obj._id)
        })
      })
    },

    handlerTestGetLog: () => {
      $("#test-get-log").click(e => {
        let id = $("#log-id").html()
        
        abc.getLog(id).then(data => {
          console.log(data)
        })

      })
    },

    handlerTestPutLog: () => {
      $("#test-put-log").click(e => {
        let id = $("#log-id").html()

        let logId = ":D"
        let logName = ":D"
        let playerCharacterId = ":D"

        let jsonData = JSON.stringify({
          "logId": logId,
          "logName": logName,
          "playerCharacterId": playerCharacterId
        })

        abc.putLog(id, jsonData).then(data => {
          console.log(data)
        })
      })
    },

    handlerTestDeleteLog: id => {
      $("#test-delete-log").click(e => {
        let id = $("#log-id").html()
        
        abc.deleteLog(id).then(() => {
          console.log("deleted!")
        })

      })
    },

    getLogs: () => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/logs`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getLogs() Error")}
      }).promise()

      return deferred
    },

    createLog: jsonData => {
      let deferred = $.ajax({
        type: "POST",
        url: `${abc.apiurl}/logs`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error creating a Log")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    getLog: id => {
      let deferred = $.ajax({
        type: "GET",
        url: `${abc.apiurl}/logs/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("getLog() Error")}
      }).promise()

      return deferred
    },

    putLog: (id, jsonData) => {
      let deferred = $.ajax({
        type: "PUT",
        url: `${abc.apiurl}/logs/${id}`,
        data: abc.convertJsonToFormData(jsonData),
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (data, status, jqXHR) => {},
        error: (jqXHR, status) => {
          ebot.notify("error updating a Log")
          console.log(jqXHR)
        }
      }).promise()

      return deferred
    },

    deleteLog: id => {
      let deferred = $.ajax({
        type: "DELETE",
        url: `${abc.apiurl}/logs/${id}`,
        success: function(data, status, jqXHR) {},
        error: function(jqXHR, status) {console.log("deleteLog() Error")}
      }).promise()

      return deferred
    }











}

