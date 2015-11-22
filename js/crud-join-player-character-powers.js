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
    abc.handlerJoinPlayerCharacterPowerCreateButton();
    abc.getJoinPlayerCharacterPowers().then(function (joinPlayerCharacterPowers) {
      abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='join-player-character-power-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Join Player Character Power Id</th>\n      <th>Power Id</th>\n      <th>Player Character Id</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.joinPlayerCharacterPowers.forEach(function (joinPlayerCharacterPower) {
      htmlString += "<tr data-id='" + joinPlayerCharacterPower._id + "'>";
      htmlString += "<td>" + joinPlayerCharacterPower.joinPlayerCharacterPowerId + "</td>";
      htmlString += "<td>" + joinPlayerCharacterPower.powerId + "</td>";
      htmlString += "<td>" + joinPlayerCharacterPower.playerCharacterId + "</td>";
      htmlString += "<td><button class='btn btn-sm update-join-player-character-power' data-id='" + joinPlayerCharacterPower._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-join-player-character-power' data-id='" + joinPlayerCharacterPower._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#join-player-character-power-table-wrapper").html(htmlString);
    abc.handlerJoinPlayerCharacterPowerTable();
  },

  handlerJoinPlayerCharacterPowerTable: function handlerJoinPlayerCharacterPowerTable() {
    $(".update-join-player-character-power").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Join Player Character Power", abc.getJoinPlayerCharacterPowerForm());
      abc.fillJoinPlayerCharacterPowerFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-join-player-character-power").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerJoinPlayerCharacterPowerCreateButton: function handlerJoinPlayerCharacterPowerCreateButton() {
    $("#join-player-character-power-create-button").click(function (e) {
      ebot.showModal("New Join Player Character Power", abc.getJoinPlayerCharacterPowerForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "joinPlayerCharacterPowerId": $("#join-player-character-power-id").val(),
        "powerId": $("#power-id").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.createJoinPlayerCharacterPower(jsonData).then(function (data) {
        abc.getJoinPlayerCharacterPowers().then(function (joinPlayerCharacterPowers) {
          abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "joinPlayerCharacterPowerId": $("#join-player-character-power-id").val(),
        "powerId": $("#power-id").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.updateJoinPlayerCharacterPower(id, jsonData).then(function (data) {
        abc.getJoinPlayerCharacterPowers().then(function (joinPlayerCharacterPowers) {
          abc.joinPlayerCharacterPowers = joinPlayerCharacterPowers;
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
      abc.deleteJoinPlayerCharacterPower(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getJoinPlayerCharacterPowerForm: function getJoinPlayerCharacterPowerForm() {
    var htmlString = "\n    <label>Join Player Character Power Id</label> <input id='join-player-character-power-id' type='number' class='form-control'><br />\n    <label>Power Id</label> <input id='power-id' type='number' class='form-control'><br />\n    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillJoinPlayerCharacterPowerFormWithOldData: function fillJoinPlayerCharacterPowerFormWithOldData(id) {
    abc.getJoinPlayerCharacterPower(id).then(function (data) {
      $("#join-player-character-power-id").val(data.joinPlayerCharacterPowerId), $("#power-id").val(data.powerId), $("#player-character-id").val(data.playerCharacterId);
    });
  },

  getJoinPlayerCharacterPowers: function getJoinPlayerCharacterPowers() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/joinPlayerCharacterPowers",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getJoinPlayerCharacterPowers() Error");
      }
    }).promise();

    return deferred;
  },

  createJoinPlayerCharacterPower: function createJoinPlayerCharacterPower(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/joinPlayerCharacterPowers",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Join Player Character Power");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getJoinPlayerCharacterPower: function getJoinPlayerCharacterPower(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/joinPlayerCharacterPowers/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getJoinPlayerCharacterPower() Error");
      }
    }).promise();

    return deferred;
  },

  updateJoinPlayerCharacterPower: function updateJoinPlayerCharacterPower(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/joinPlayerCharacterPowers/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Join Player Character Power");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteJoinPlayerCharacterPower: function deleteJoinPlayerCharacterPower(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/joinPlayerCharacterPowers/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteJoinPlayerCharacterPower() Error");
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

  joinPlayerCharacterPowers: []

};
//# sourceMappingURL=crud-join-player-character-powers.js.map
