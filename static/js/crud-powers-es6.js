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
    abc.handlerPowerCreateButton()
    abc.getPowers().then(powers => {
      abc.powers = powers
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='power-table' class='table'>`

    htmlString += `
    <tr>
      <th>Power Id</th>
      <th>Name</th>
      <th>Type</th>
      <th>Flavor Text</th>
      <th>Attack Type</th>
      <th>Damage</th>
      <th>Effect</th>
      <th>Description</th>
      <th>Upgrade</th>
      <th>Image Filename</th>
      <th></th>
      <th></th>
    </tr>`

    abc.powers.forEach(power => {
      htmlString += `<tr data-id='${power._id}'>`
      htmlString += `<td>${power.powerId}</td>`
      htmlString += `<td>${power.name}</td>`
      htmlString += `<td>${power.type}</td>`
      htmlString += `<td>${power.flavorText}</td>`
      htmlString += `<td>${power.attackType}</td>`
      htmlString += `<td>${power.damage}</td>`
      htmlString += `<td>${power.effect}</td>`
      htmlString += `<td>${power.description}</td>`
      htmlString += `<td>${power.upgrade}</td>`
      htmlString += `<td>${power.imageFilename}</td>`
      htmlString += `<td><button class='btn btn-sm update-power' data-id='${power._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-power' data-id='${power._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#power-table-wrapper").html(htmlString)
    abc.handlerPowerTable()
  },

  handlerPowerTable: () => {
    $(".update-power").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Power`, abc.getPowerForm())
      abc.fillPowerFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-power").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerPowerCreateButton: () => {
    $("#power-create-button").click(e => {
      ebot.showModal("New Power", abc.getPowerForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "powerId": $("#power-id").val(),
        "name": $("#name").val(),
        "type": $("#type").val(),
        "flavorText": $("#flavor-text").val(),
        "attackType": $("#attack-type").val(),
        "damage": $("#damage").val(),
        "effect": $("#effect").val(),
        "description": $("#description").val(),
        "upgrade": $("#upgrade").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.createPower(jsonData).then(data => {
        abc.getPowers().then(powers => {
          abc.powers = powers
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "powerId": $("#power-id").val(),
        "name": $("#name").val(),
        "type": $("#type").val(),
        "flavorText": $("#flavor-text").val(),
        "attackType": $("#attack-type").val(),
        "damage": $("#damage").val(),
        "effect": $("#effect").val(),
        "description": $("#description").val(),
        "upgrade": $("#upgrade").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.updatePower(id, jsonData).then(data => {
        abc.getPowers().then(powers => {
          abc.powers = powers
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
      abc.deletePower(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getPowerForm: () => {
    let htmlString = `
    <label>Power Id</label> <input id='power-id' type='number' class='form-control'><br />
    <label>Name</label> <input id='name' class='form-control'><br />
    <label>Type</label> <input id='type' class='form-control'><br />
    <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />
    <label>Attack Type</label> <input id='attack-type' class='form-control'><br />
    <label>Damage</label> <input id='damage' class='form-control'><br />
    <label>Effect</label> <input id='effect' class='form-control'><br />
    <label>Description</label> <textarea id='description' class='form-control'></textarea><br /><br />
    <label>Upgrade</label> <textarea id='upgrade' class='form-control'></textarea><br /><br />
    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillPowerFormWithOldData: id => {
    abc.getPower(id).then(data => {
      $("#power-id").val(data.powerId),
      $("#name").val(data.name),
      $("#type").val(data.type),
      $("#flavor-text").val(data.flavorText),
      $("#attack-type").val(data.attackType),
      $("#damage").val(data.damage),
      $("#effect").val(data.effect),
      $("#description").val(data.description),
      $("#upgrade").val(data.upgrade),
      $("#image-filename").val(data.imageFilename)
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
    console.log(jsonData)
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

  updatePower: (id, jsonData) => {
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

  powers: []

}