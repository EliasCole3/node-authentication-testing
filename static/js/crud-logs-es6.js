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
    abc.handlerLogCreateButton()
    abc.getLogs().then(logs => {
      abc.logs = logs
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='log-table' class='table'>`

    htmlString += `
    <tr>
      <th>Log Id</th>
      <th>Log Name</th>
      <th>Player Character Id</th>
      <th></th>
      <th></th>
    </tr>`

    abc.logs.forEach(log => {
      htmlString += `<tr data-id='${log._id}'>`
      htmlString += `<td>${log.logId}</td>`
      htmlString += `<td>${log.logName}</td>`
      htmlString += `<td>${log.playerCharacterId}</td>`
      htmlString += `<td><button class='btn btn-sm update-log' data-id='${log._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-log' data-id='${log._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#log-table-wrapper").html(htmlString)
    abc.handlerLogTable()
  },

  handlerLogTable: () => {
    $(".update-log").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Log`, abc.getLogForm())
      abc.fillLogFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-log").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerLogCreateButton: () => {
    $("#log-create-button").click(e => {
      ebot.showModal("New Log", abc.getLogForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "logId": $("#log-id").val(),
        "logName": $("#log-name").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.createLog(jsonData).then(data => {
        abc.getLogs().then(logs => {
          abc.logs = logs
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "logId": $("#log-id").val(),
        "logName": $("#log-name").val(),
        "playerCharacterId": $("#player-character-id").val()
      })

      abc.updateLog(id, jsonData).then(data => {
        abc.getLogs().then(logs => {
          abc.logs = logs
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
      abc.deleteLog(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getLogForm: () => {
    let htmlString = `
    <label>Log Id</label> <input id='log-id' type='number' class='form-control'><br />
    <label>Log Name</label> <input id='log-name' class='form-control'><br />
    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillLogFormWithOldData: id => {
    abc.getLog(id).then(data => {
      $("#log-id").val(data.logId),
      $("#log-name").val(data.logName),
      $("#player-character-id").val(data.playerCharacterId)
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
    console.log(jsonData)
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

  updateLog: (id, jsonData) => {
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

  logs: []

}