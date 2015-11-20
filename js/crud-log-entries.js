"use strict";

$(function () {
  abc.initialize();
  // ebot.updateDocumentation(abc)
});

var abc = {

  initialize: function initialize() {
    abc.assignInitialHandlers();
    ebot.insertModalHtml();
  },

  assignInitialHandlers: function assignInitialHandlers() {
    abc.handlerLogEntryCreateButton();
    abc.getLogEntries().then(function (logEntries) {
      abc.logEntries = logEntries;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='log-entry-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Log Entry Id</th>\n      <th>Message</th>\n      <th>Date</th>\n      <th>Log Id</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.logEntries.forEach(function (logEntry) {
      htmlString += "<tr data-id='" + logEntry._id + "'>";
      htmlString += "<td>" + logEntry.logEntryId + "</td>";
      htmlString += "<td>" + logEntry.message + "</td>";
      htmlString += "<td>" + logEntry.date + "</td>";
      htmlString += "<td>" + logEntry.logId + "</td>";
      htmlString += "<td><button class='btn btn-sm update-log-entry' data-id='" + logEntry._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-log-entry' data-id='" + logEntry._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#log-entry-table-wrapper").html(htmlString);
    abc.handlerLogEntryTable();
  },

  handlerLogEntryTable: function handlerLogEntryTable() {
    $(".update-log-entry").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Log Entry", abc.getLogEntryForm());
      abc.fillLogEntryFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-log-entry").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerLogEntryCreateButton: function handlerLogEntryCreateButton() {
    $("#log-entry-create-button").click(function (e) {
      ebot.showModal("New Log Entry", abc.getLogEntryForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "logEntryId": $("#log-entry-id").val(),
        "message": $("#message").val(),
        "date": $("#date").val(),
        "logId": $("#log-id").val()
      });

      abc.createLogEntry(jsonData).then(function (data) {
        abc.getLogEntries().then(function (logEntries) {
          abc.logEntries = logEntries;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "logEntryId": $("#log-entry-id").val(),
        "message": $("#message").val(),
        "date": $("#date").val(),
        "logId": $("#log-id").val()
      });

      abc.updateLogEntry(id, jsonData).then(function (data) {
        abc.getLogEntries().then(function (logEntries) {
          abc.logEntries = logEntries;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerDelete: function handlerDelete() {
    $("#submit-deletion").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      abc.deleteLogEntry(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getLogEntryForm: function getLogEntryForm() {
    var htmlString = "\n    <label>Log Entry Id</label> <input id='log-entry-id' type='number' class='form-control'><br />\n    <label>Message</label> <textarea id='message' class='form-control'></textarea><br /><br />\n    <label>Date</label> <input id='date' type='date' class='form-control'><br />\n    <label>Log Id</label> <input id='log-id' type='number' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillLogEntryFormWithOldData: function fillLogEntryFormWithOldData(id) {
    abc.getLogEntry(id).then(function (data) {
      $("#log-entry-id").val(data.logEntryId), $("#message").val(data.message), $("#date").val(data.date), $("#log-id").val(data.logId);
    });
  },

  getLogEntries: function getLogEntries() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/logEntries",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getLogEntrys() Error");
      }
    }).promise();

    return deferred;
  },

  createLogEntry: function createLogEntry(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/logEntries",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Log Entry");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getLogEntry: function getLogEntry(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/logEntries/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getLogEntry() Error");
      }
    }).promise();

    return deferred;
  },

  updateLogEntry: function updateLogEntry(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/logEntries/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Log Entry");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteLogEntry: function deleteLogEntry(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/logEntries/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteLogEntry() Error");
      }
    }).promise();

    return deferred;
  },

  convertJsonToFormData: function convertJsonToFormData(json) {
    var string = "";

    json = JSON.parse(json);

    for (var prop in json) {
      var converted = prop + "=" + encodeURI(json[prop]) + "&";
      converted = converted.replace(/%20/g, "+");
      string += converted;
    }
    string = string.replace(/&$/g, "");

    return string;
  },

  // apiurl: "http://localhost:8082",
  apiurl: "http://192.241.203.33:8082",

  logEntries: []

};
//# sourceMappingURL=crud-log-entries.js.map
