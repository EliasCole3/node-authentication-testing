$(() => {
  abc.initialize()
  // ebot.updateDocumentation(abc)
})

let abc = {
  
  initialize: () => {
    abc.assignInitialHandlers()
    ebot.insertModalHtml()
  },

  assignInitialHandlers: () => {
    abc.handlerCreatureCreateButton()
    abc.getCreatures().then(creatures => {
      abc.creatures = creatures
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='creature-table' class='table'>`

    htmlString += `
    <tr>
      <th>Creature Id</th>
      <th>Name</th>
      <th>Race</th>
      <th>Hp</th>
      <th>Ac</th>
      <th>Will</th>
      <th>Reflex</th>
      <th>Gold Value</th>
      <th>Xp Value</th>
      <th>Level</th>
      <th>Base to Hit Ac</th>
      <th>Base to Hit Will</th>
      <th>Base to Hit Reflex</th>
      <th>Damage Modifier</th>
      <th>Speed</th>
      <th>Initiative</th>
      <th>Image Filename</th>
      <th></th>
      <th></th>
    </tr>`

    abc.creatures.forEach(creature => {
      htmlString += `<tr data-id='${creature._id}'>`
      htmlString += `<td>${creature.creatureId}</td>`
      htmlString += `<td>${creature.name}</td>`
      htmlString += `<td>${creature.race}</td>`
      htmlString += `<td>${creature.hp}</td>`
      htmlString += `<td>${creature.ac}</td>`
      htmlString += `<td>${creature.will}</td>`
      htmlString += `<td>${creature.reflex}</td>`
      htmlString += `<td>${creature.goldValue}</td>`
      htmlString += `<td>${creature.xpValue}</td>`
      htmlString += `<td>${creature.level}</td>`
      htmlString += `<td>${creature.baseToHitAc}</td>`
      htmlString += `<td>${creature.baseToHitWill}</td>`
      htmlString += `<td>${creature.baseToHitReflex}</td>`
      htmlString += `<td>${creature.damageModifier}</td>`
      htmlString += `<td>${creature.speed}</td>`
      htmlString += `<td>${creature.initiative}</td>`
      htmlString += `<td>${creature.imageFilename}</td>`
      htmlString += `<td><button class='btn btn-sm update-creature' data-id='${creature._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-creature' data-id='${creature._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#creature-table-wrapper").html(htmlString)
    abc.handlerCreatureTable()
  },

  handlerCreatureTable: () => {
    $(".update-creature").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Creature`, abc.getCreatureForm())
      abc.fillCreatureFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-creature").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerCreatureCreateButton: () => {
    $("#creature-create-button").click(e => {
      ebot.showModal("New Creature", abc.getCreatureForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "creatureId": $("#creature-id").val(),
        "name": $("#name").val(),
        "race": $("#race").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "goldValue": $("#gold-value").val(),
        "xpValue": $("#xp-value").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.createCreature(jsonData).then(data => {
        abc.getCreatures().then(creatures => {
          abc.creatures = creatures
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "creatureId": $("#creature-id").val(),
        "name": $("#name").val(),
        "race": $("#race").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "goldValue": $("#gold-value").val(),
        "xpValue": $("#xp-value").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.updateCreature(id, jsonData).then(data => {
        abc.getCreatures().then(creatures => {
          abc.creatures = creatures
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
      abc.deleteCreature(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getCreatureForm: () => {
    let htmlString = `
    <label>Creature Id</label> <input id='creature-id' type='number' class='form-control'><br />
    <label>Name</label> <input id='name' class='form-control'><br />
    <label>Race</label> <input id='race' class='form-control'><br />
    <label>Hp</label> <input id='hp' type='number' class='form-control'><br />
    <label>Ac</label> <input id='ac' type='number' class='form-control'><br />
    <label>Will</label> <input id='will' type='number' class='form-control'><br />
    <label>Reflex</label> <input id='reflex' type='number' class='form-control'><br />
    <label>Gold Value</label> <input id='gold-value' type='number' class='form-control'><br />
    <label>Xp Value</label> <input id='xp-value' type='number' class='form-control'><br />
    <label>Level</label> <input id='level' type='number' class='form-control'><br />
    <label>Base to Hit Ac</label> <input id='base-to-hit-ac' type='number' class='form-control'><br />
    <label>Base to Hit Will</label> <input id='base-to-hit-will' type='number' class='form-control'><br />
    <label>Base to Hit Reflex</label> <input id='base-to-hit-reflex' type='number' class='form-control'><br />
    <label>Damage Modifier</label> <input id='damage-modifier' type='number' class='form-control'><br />
    <label>Speed</label> <input id='speed' type='number' class='form-control'><br />
    <label>Initiative</label> <input id='initiative' type='number' class='form-control'><br />
    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillCreatureFormWithOldData: id => {
    abc.getCreature(id).then(data => {
      $("#creature-id").val(data.creatureId),
      $("#name").val(data.name),
      $("#race").val(data.race),
      $("#hp").val(data.hp),
      $("#ac").val(data.ac),
      $("#will").val(data.will),
      $("#reflex").val(data.reflex),
      $("#gold-value").val(data.goldValue),
      $("#xp-value").val(data.xpValue),
      $("#level").val(data.level),
      $("#base-to-hit-ac").val(data.baseToHitAc),
      $("#base-to-hit-will").val(data.baseToHitWill),
      $("#base-to-hit-reflex").val(data.baseToHitReflex),
      $("#damage-modifier").val(data.damageModifier),
      $("#speed").val(data.speed),
      $("#initiative").val(data.initiative),
      $("#image-filename").val(data.imageFilename)
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
    console.log(jsonData)
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

  updateCreature: (id, jsonData) => {
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

  // apiurl: "http://localhost:8082",
  apiurl: "http://192.241.203.33:8082",

  creatures: []

}