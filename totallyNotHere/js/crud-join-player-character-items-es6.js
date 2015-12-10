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
    abc.handlerJoinPlayerCharacterItemCreateButton()
    abc.getJoinPlayerCharacterItems().then(joinPlayerCharacterItems => {
      abc.joinPlayerCharacterItems = joinPlayerCharacterItems
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='join-player-character-item-table' class='table'>`

    htmlString += `
    <tr>
      <th>Join Player Character Item Id</th>
      <th>Item Id</th>
      <th>Player Character Id</th>
      <th>Count</th>
      <th></th>
      <th></th>
    </tr>`

    abc.joinPlayerCharacterItems.forEach(joinPlayerCharacterItem => {
      htmlString += `<tr data-id='${joinPlayerCharacterItem._id}'>`
      htmlString += `<td>${joinPlayerCharacterItem.joinPlayerCharacterItemId}</td>`
      htmlString += `<td>${joinPlayerCharacterItem.itemId}</td>`
      htmlString += `<td>${joinPlayerCharacterItem.playerCharacterId}</td>`
      htmlString += `<td>${joinPlayerCharacterItem.count}</td>`
      htmlString += `<td><button class='btn btn-sm update-join-player-character-item' data-id='${joinPlayerCharacterItem._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-join-player-character-item' data-id='${joinPlayerCharacterItem._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#join-player-character-item-table-wrapper").html(htmlString)
    abc.handlerJoinPlayerCharacterItemTable()
  },

  handlerJoinPlayerCharacterItemTable: () => {
    $(".update-join-player-character-item").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Join Player Character Item`, abc.getJoinPlayerCharacterItemForm())
      abc.fillJoinPlayerCharacterItemFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-join-player-character-item").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerJoinPlayerCharacterItemCreateButton: () => {
    $("#join-player-character-item-create-button").click(e => {
      ebot.showModal("New Join Player Character Item", abc.getJoinPlayerCharacterItemForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "joinPlayerCharacterItemId": $("#join-player-character-item-id").val(),
        "itemId": $("#item-id").val(),
        "playerCharacterId": $("#player-character-id").val(),
        "count": $("#count").val()
      })

      abc.createJoinPlayerCharacterItem(jsonData).then(data => {
        abc.getJoinPlayerCharacterItems().then(joinPlayerCharacterItems => {
          abc.joinPlayerCharacterItems = joinPlayerCharacterItems
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "joinPlayerCharacterItemId": $("#join-player-character-item-id").val(),
        "itemId": $("#item-id").val(),
        "playerCharacterId": $("#player-character-id").val(),
        "count": $("#count").val()
      })

      abc.updateJoinPlayerCharacterItem(id, jsonData).then(data => {
        abc.getJoinPlayerCharacterItems().then(joinPlayerCharacterItems => {
          abc.joinPlayerCharacterItems = joinPlayerCharacterItems
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
      abc.deleteJoinPlayerCharacterItem(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getJoinPlayerCharacterItemForm: () => {
    let htmlString = `
    <label>Join Player Character Item Id</label> <input id='join-player-character-item-id' type='number' class='form-control'><br />
    <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />
    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />
    <label>Count</label> <input id='count' type='number' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillJoinPlayerCharacterItemFormWithOldData: id => {
    abc.getJoinPlayerCharacterItem(id).then(data => {
      $("#join-player-character-item-id").val(data.joinPlayerCharacterItemId),
      $("#item-id").val(data.itemId),
      $("#player-character-id").val(data.playerCharacterId),
      $("#count").val(data.count)
    })
  },

  getJoinPlayerCharacterItems: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/joinPlayerCharacterItems`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getJoinPlayerCharacterItems() Error")}
    }).promise()

    return deferred
  },

  createJoinPlayerCharacterItem: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: `${abc.apiurl}/joinPlayerCharacterItems`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a Join Player Character Item")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  getJoinPlayerCharacterItem: id => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/joinPlayerCharacterItems/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getJoinPlayerCharacterItem() Error")}
    }).promise()

    return deferred
  },

  updateJoinPlayerCharacterItem: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: `${abc.apiurl}/joinPlayerCharacterItems/${id}`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a Join Player Character Item")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  deleteJoinPlayerCharacterItem: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: `${abc.apiurl}/joinPlayerCharacterItems/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("deleteJoinPlayerCharacterItem() Error")}
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

  joinPlayerCharacterItems: []

}