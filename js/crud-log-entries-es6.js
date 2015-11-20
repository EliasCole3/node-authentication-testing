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
    abc.handlerLogEntryCreateButton()
    abc.getLogEntries().then(logEntries => {
      abc.logEntries = logEntries
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='log-entry-table' class='table'>`

    htmlString += `
    <tr>
      <th>Log Entry Id</th>
      <th>Message</th>
      <th>Date</th>
      <th>Log Id</th>
      <th></th>
      <th></th>
    </tr>`

    abc.logEntries.forEach(logEntry => {
      htmlString += `<tr data-id='${logEntry._id}'>`
      htmlString += `<td>${logEntry.logEntryId}</td>`
      htmlString += `<td>${logEntry.message}</td>`
      htmlString += `<td>${logEntry.date}</td>`
      htmlString += `<td>${logEntry.logId}</td>`
      htmlString += `<td><button class='btn btn-sm update-log-entry' data-id='${logEntry._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-log-entry' data-id='${logEntry._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#log-entry-table-wrapper").html(htmlString)
    abc.handlerLogEntryTable()
  },

  handlerLogEntryTable: () => {
    $(".update-log-entry").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Log Entry`, abc.getLogEntryForm())
      abc.fillLogEntryFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-log-entry").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerLogEntryCreateButton: () => {
    $("#log-entry-create-button").click(e => {
      ebot.showModal("New Log Entry", abc.getLogEntryForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "logEntryId": $("#log-entry-id").val(),
        "message": $("#message").val(),
        "date": $("#date").val(),
        "logId": $("#log-id").val()
      })

      abc.createLogEntry(jsonData).then(data => {
        abc.getLogEntries().then(logEntries => {
          abc.logEntries = logEntries
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "logEntryId": $("#log-entry-id").val(),
        "message": $("#message").val(),
        "date": $("#date").val(),
        "logId": $("#log-id").val()
      })

      abc.updateLogEntry(id, jsonData).then(data => {
        abc.getLogEntries().then(logEntries => {
          abc.logEntries = logEntries
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
      abc.deleteLogEntry(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getLogEntryForm: () => {
    let htmlString = `
    <label>Log Entry Id</label> <input id='log-entry-id' type='number' class='form-control'><br />
    <label>Message</label> <textarea id='message' class='form-control'></textarea><br /><br />
    <label>Date</label> <input id='date' type='date' class='form-control'><br />
    <label>Log Id</label> <input id='log-id' type='number' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillLogEntryFormWithOldData: id => {
    abc.getLogEntry(id).then(data => {
      $("#log-entry-id").val(data.logEntryId),
      $("#message").val(data.message),
      $("#date").val(data.date),
      $("#log-id").val(data.logId)
    })
  },

  getLogEntries: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/logEntries`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getLogEntrys() Error")}
    }).promise()

    return deferred
  },

  createLogEntry: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: `${abc.apiurl}/logEntries`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a Log Entry")
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

  updateLogEntry: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: `${abc.apiurl}/logEntries/${id}`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a Log Entry")
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

  logEntries: []

}