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
    abc.handlerJoinPlayerCharacterItemCreateButton();
    abc.getJoinPlayerCharacterItems().then(function (joinPlayerCharacterItems) {
      abc.joinPlayerCharacterItems = joinPlayerCharacterItems;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='join-player-character-item-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Join Player Character Item Id</th>\n      <th>Item Id</th>\n      <th>Player Character Id</th>\n      <th>Count</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.joinPlayerCharacterItems.forEach(function (joinPlayerCharacterItem) {
      htmlString += "<tr data-id='" + joinPlayerCharacterItem._id + "'>";
      htmlString += "<td>" + joinPlayerCharacterItem.joinPlayerCharacterItemId + "</td>";
      htmlString += "<td>" + joinPlayerCharacterItem.itemId + "</td>";
      htmlString += "<td>" + joinPlayerCharacterItem.playerCharacterId + "</td>";
      htmlString += "<td>" + joinPlayerCharacterItem.count + "</td>";
      htmlString += "<td><button class='btn btn-sm update-join-player-character-item' data-id='" + joinPlayerCharacterItem._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-join-player-character-item' data-id='" + joinPlayerCharacterItem._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#join-player-character-item-table-wrapper").html(htmlString);
    abc.handlerJoinPlayerCharacterItemTable();
  },

  handlerJoinPlayerCharacterItemTable: function handlerJoinPlayerCharacterItemTable() {
    $(".update-join-player-character-item").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Join Player Character Item", abc.getJoinPlayerCharacterItemForm());
      abc.fillJoinPlayerCharacterItemFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-join-player-character-item").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerJoinPlayerCharacterItemCreateButton: function handlerJoinPlayerCharacterItemCreateButton() {
    $("#join-player-character-item-create-button").click(function (e) {
      ebot.showModal("New Join Player Character Item", abc.getJoinPlayerCharacterItemForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "joinPlayerCharacterItemId": $("#join-player-character-item-id").val(),
        "itemId": $("#item-id").val(),
        "playerCharacterId": $("#player-character-id").val(),
        "count": $("#count").val()
      });

      abc.createJoinPlayerCharacterItem(jsonData).then(function (data) {
        abc.getJoinPlayerCharacterItems().then(function (joinPlayerCharacterItems) {
          abc.joinPlayerCharacterItems = joinPlayerCharacterItems;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "joinPlayerCharacterItemId": $("#join-player-character-item-id").val(),
        "itemId": $("#item-id").val(),
        "playerCharacterId": $("#player-character-id").val(),
        "count": $("#count").val()
      });

      abc.updateJoinPlayerCharacterItem(id, jsonData).then(function (data) {
        abc.getJoinPlayerCharacterItems().then(function (joinPlayerCharacterItems) {
          abc.joinPlayerCharacterItems = joinPlayerCharacterItems;
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
      abc.deleteJoinPlayerCharacterItem(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getJoinPlayerCharacterItemForm: function getJoinPlayerCharacterItemForm() {
    var htmlString = "\n    <label>Join Player Character Item Id</label> <input id='join-player-character-item-id' type='number' class='form-control'><br />\n    <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />\n    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />\n    <label>Count</label> <input id='count' type='number' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillJoinPlayerCharacterItemFormWithOldData: function fillJoinPlayerCharacterItemFormWithOldData(id) {
    abc.getJoinPlayerCharacterItem(id).then(function (data) {
      $("#join-player-character-item-id").val(data.joinPlayerCharacterItemId), $("#item-id").val(data.itemId), $("#player-character-id").val(data.playerCharacterId), $("#count").val(data.count);
    });
  },

  getJoinPlayerCharacterItems: function getJoinPlayerCharacterItems() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/joinPlayerCharacterItems",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getJoinPlayerCharacterItems() Error");
      }
    }).promise();

    return deferred;
  },

  createJoinPlayerCharacterItem: function createJoinPlayerCharacterItem(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/joinPlayerCharacterItems",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Join Player Character Item");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getJoinPlayerCharacterItem: function getJoinPlayerCharacterItem(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/joinPlayerCharacterItems/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getJoinPlayerCharacterItem() Error");
      }
    }).promise();

    return deferred;
  },

  updateJoinPlayerCharacterItem: function updateJoinPlayerCharacterItem(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/joinPlayerCharacterItems/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Join Player Character Item");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteJoinPlayerCharacterItem: function deleteJoinPlayerCharacterItem(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/joinPlayerCharacterItems/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteJoinPlayerCharacterItem() Error");
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

  joinPlayerCharacterItems: []

};
//# sourceMappingURL=crud-join-player-character-items.js.map
