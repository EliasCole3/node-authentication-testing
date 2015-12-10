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
    abc.handlerCharacterDetailCreateButton()
    abc.getCharacterDetails().then(characterDetails => {
      abc.characterDetails = characterDetails
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='character-detail-table' class='table'>`

    htmlString += `
    <tr>
      <th>Character Detail Id</th>
      <th>Backstory</th>
      <th>Player Character Id</th>
      <th></th>
      <th></th>
    </tr>`

    abc.characterDetails.forEach(characterDetail => {
      htmlString += `<tr data-id='${characterDetail._id}'>`
      htmlString += `<td>${characterDetail.characterDetailId}</td>`
      htmlString += `<td>${characterDetail.backstory}</td>`
      htmlString += `<td>${characterDetail.playerCharacterId}</td>`
      htmlString += `<td><button class='btn btn-sm update-character-detail' data-id='${characterDetail._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-character-detail' data-id='${characterDetail._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#character-detail-table-wrapper").html(htmlString)
    abc.handlerCharacterDetailTable()
  },

  handlerCharacterDetailTable: () => {
    $(".update-character-detail").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Character Detail`, abc.getCharacterDetailForm())
      abc.fillCharacterDetailFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-character-detail").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerCharacterDetailCreateButton: () => {
    $("#character-detail-create-button").click(e => {
      ebot.showModal("New Character Detail", abc.getCharacterDetailForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "characterDetailId": $("#character-detail-id").val(),
        "backstory": $("#backstory").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.createCharacterDetail(jsonData).then(data => {
        abc.getCharacterDetails().then(characterDetails => {
          abc.characterDetails = characterDetails
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "characterDetailId": $("#character-detail-id").val(),
        "backstory": $("#backstory").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.updateCharacterDetail(id, jsonData).then(data => {
        abc.getCharacterDetails().then(characterDetails => {
          abc.characterDetails = characterDetails
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
      abc.deleteCharacterDetail(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getCharacterDetailForm: () => {
    let htmlString = `
    <label>Character Detail Id</label> <input id='character-detail-id' type='number' class='form-control'><br />
    <label>Backstory</label> <textarea id='backstory' class='form-control'></textarea><br /><br />
    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillCharacterDetailFormWithOldData: id => {
    abc.getCharacterDetail(id).then(data => {
      $("#character-detail-id").val(data.characterDetailId),
      $("#backstory").val(data.backstory),
      $("#player-character-id").val(data.playerCharacterId)
    })
  },

  getCharacterDetails: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/characterDetails`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getCharacterDetails() Error")}
    }).promise()

    return deferred
  },

  createCharacterDetail: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: `${abc.apiurl}/characterDetails`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a Character Detail")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  getCharacterDetail: id => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/characterDetails/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getCharacterDetail() Error")}
    }).promise()

    return deferred
  },

  updateCharacterDetail: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: `${abc.apiurl}/characterDetails/${id}`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a Character Detail")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  deleteCharacterDetail: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: `${abc.apiurl}/characterDetails/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("deleteCharacterDetail() Error")}
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

  characterDetails: []

}