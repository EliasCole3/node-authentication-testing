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
    abc.handlerJoinPlayerCharacterPowerCreateButton()
    abc.getJoinPlayerCharacterPowers().then(joinPlayerCharacterPowers => {
      abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='join-player-character-power-table' class='table'>`

    htmlString += `
    <tr>
      <th>Join Player Character Power Id</th>
      <th>Power Id</th>
      <th>Player Character Id</th>
      <th></th>
      <th></th>
    </tr>`

    abc.joinPlayerCharacterPowers.forEach(joinPlayerCharacterPower => {
      htmlString += `<tr data-id='${joinPlayerCharacterPower._id}'>`
      htmlString += `<td>${joinPlayerCharacterPower.joinPlayerCharacterPowerId}</td>`
      htmlString += `<td>${joinPlayerCharacterPower.powerId}</td>`
      htmlString += `<td>${joinPlayerCharacterPower.playerCharacterId}</td>`
      htmlString += `<td><button class='btn btn-sm update-join-player-character-power' data-id='${joinPlayerCharacterPower._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-join-player-character-power' data-id='${joinPlayerCharacterPower._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#join-player-character-power-table-wrapper").html(htmlString)
    abc.handlerJoinPlayerCharacterPowerTable()
  },

  handlerJoinPlayerCharacterPowerTable: () => {
    $(".update-join-player-character-power").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Join Player Character Power`, abc.getJoinPlayerCharacterPowerForm())
      abc.fillJoinPlayerCharacterPowerFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-join-player-character-power").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerJoinPlayerCharacterPowerCreateButton: () => {
    $("#join-player-character-power-create-button").click(e => {
      ebot.showModal("New Join Player Character Power", abc.getJoinPlayerCharacterPowerForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "joinPlayerCharacterPowerId": $("#join-player-character-power-id").val(),
        "powerId": $("#power-id").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.createJoinPlayerCharacterPower(jsonData).then(data => {
        abc.getJoinPlayerCharacterPowers().then(joinPlayerCharacterPowers => {
          abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "joinPlayerCharacterPowerId": $("#join-player-character-power-id").val(),
        "powerId": $("#power-id").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.updateJoinPlayerCharacterPower(id, jsonData).then(data => {
        abc.getJoinPlayerCharacterPowers().then(joinPlayerCharacterPowers => {
          abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers
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
      abc.deleteJoinPlayerCharacterPower(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getJoinPlayerCharacterPowerForm: () => {
    let htmlString = `
    <label>Join Player Character Power Id</label> <input id='join-player-character-power-id' type='number' class='form-control'><br />
    <label>Power Id</label> <input id='power-id' type='number' class='form-control'><br />
    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillJoinPlayerCharacterPowerFormWithOldData: id => {
    abc.getJoinPlayerCharacterPower(id).then(data => {
      $("#join-player-character-power-id").val(data.joinPlayerCharacterPowerId),
      $("#power-id").val(data.powerId),
      $("#player-character-id").val(data.playerCharacterId)
    })
  },

  getJoinPlayerCharacterPowers: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/joinPlayerCharacterPowers`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getJoinPlayerCharacterPowers() Error")}
    }).promise()

    return deferred
  },

  createJoinPlayerCharacterPower: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: `${abc.apiurl}/joinPlayerCharacterPowers`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a Join Player Character Power")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  getJoinPlayerCharacterPower: id => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/joinPlayerCharacterPowers/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getJoinPlayerCharacterPower() Error")}
    }).promise()

    return deferred
  },

  updateJoinPlayerCharacterPower: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: `${abc.apiurl}/joinPlayerCharacterPowers/${id}`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a Join Player Character Power")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  deleteJoinPlayerCharacterPower: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: `${abc.apiurl}/joinPlayerCharacterPowers/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("deleteJoinPlayerCharacterPower() Error")}
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

  joinPlayerCharacterPowers: []

}