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
    abc.handlerLogCreateButton();
    abc.getLogs().then(function (logs) {
      abc.logs = logs;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='log-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Log Id</th>\n      <th>Log Name</th>\n      <th>Player Character Id</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.logs.forEach(function (log) {
      htmlString += "<tr data-id='" + log._id + "'>";
      htmlString += "<td>" + log.logId + "</td>";
      htmlString += "<td>" + log.logName + "</td>";
      htmlString += "<td>" + log.playerCharacterId + "</td>";
      htmlString += "<td><button class='btn btn-sm update-log' data-id='" + log._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-log' data-id='" + log._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#log-table-wrapper").html(htmlString);
    abc.handlerLogTable();
  },

  handlerLogTable: function handlerLogTable() {
    $(".update-log").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Log", abc.getLogForm());
      abc.fillLogFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-log").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerLogCreateButton: function handlerLogCreateButton() {
    $("#log-create-button").click(function (e) {
      ebot.showModal("New Log", abc.getLogForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "logId": $("#log-id").val(),
        "logName": $("#log-name").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.createLog(jsonData).then(function (data) {
        abc.getLogs().then(function (logs) {
          abc.logs = logs;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "logId": $("#log-id").val(),
        "logName": $("#log-name").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.updateLog(id, jsonData).then(function (data) {
        abc.getLogs().then(function (logs) {
          abc.logs = logs;
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
      abc.deleteLog(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getLogForm: function getLogForm() {
    var htmlString = "\n    <label>Log Id</label> <input id='log-id' type='number' class='form-control'><br />\n    <label>Log Name</label> <input id='log-name' class='form-control'><br />\n    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillLogFormWithOldData: function fillLogFormWithOldData(id) {
    abc.getLog(id).then(function (data) {
      $("#log-id").val(data.logId), $("#log-name").val(data.logName), $("#player-character-id").val(data.playerCharacterId);
    });
  },

  getLogs: function getLogs() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/logs",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getLogs() Error");
      }
    }).promise();

    return deferred;
  },

  createLog: function createLog(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/logs",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Log");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getLog: function getLog(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/logs/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getLog() Error");
      }
    }).promise();

    return deferred;
  },

  updateLog: function updateLog(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/logs/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Log");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteLog: function deleteLog(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/logs/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteLog() Error");
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

  logs: []

};
//# sourceMappingURL=crud-logs.js.map
