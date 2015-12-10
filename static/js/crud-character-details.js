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
    abc.handlerCharacterDetailCreateButton();
    abc.getCharacterDetails().then(function (characterDetails) {
      abc.characterDetails = characterDetails;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='character-detail-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Character Detail Id</th>\n      <th>Backstory</th>\n      <th>Player Character Id</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.characterDetails.forEach(function (characterDetail) {
      htmlString += "<tr data-id='" + characterDetail._id + "'>";
      htmlString += "<td>" + characterDetail.characterDetailId + "</td>";
      htmlString += "<td>" + characterDetail.backstory + "</td>";
      htmlString += "<td>" + characterDetail.playerCharacterId + "</td>";
      htmlString += "<td><button class='btn btn-sm update-character-detail' data-id='" + characterDetail._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-character-detail' data-id='" + characterDetail._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#character-detail-table-wrapper").html(htmlString);
    abc.handlerCharacterDetailTable();
  },

  handlerCharacterDetailTable: function handlerCharacterDetailTable() {
    $(".update-character-detail").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Character Detail", abc.getCharacterDetailForm());
      abc.fillCharacterDetailFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-character-detail").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerCharacterDetailCreateButton: function handlerCharacterDetailCreateButton() {
    $("#character-detail-create-button").click(function (e) {
      ebot.showModal("New Character Detail", abc.getCharacterDetailForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "characterDetailId": $("#character-detail-id").val(),
        "backstory": $("#backstory").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.createCharacterDetail(jsonData).then(function (data) {
        abc.getCharacterDetails().then(function (characterDetails) {
          abc.characterDetails = characterDetails;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "characterDetailId": $("#character-detail-id").val(),
        "backstory": $("#backstory").val(),
        "playerCharacterId": $("#player-character-id").val()
      });

      abc.updateCharacterDetail(id, jsonData).then(function (data) {
        abc.getCharacterDetails().then(function (characterDetails) {
          abc.characterDetails = characterDetails;
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
      abc.deleteCharacterDetail(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getCharacterDetailForm: function getCharacterDetailForm() {
    var htmlString = "\n    <label>Character Detail Id</label> <input id='character-detail-id' type='number' class='form-control'><br />\n    <label>Backstory</label> <textarea id='backstory' class='form-control'></textarea><br /><br />\n    <label>Player Character Id</label> <input id='player-character-id' type='number' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillCharacterDetailFormWithOldData: function fillCharacterDetailFormWithOldData(id) {
    abc.getCharacterDetail(id).then(function (data) {
      $("#character-detail-id").val(data.characterDetailId), $("#backstory").val(data.backstory), $("#player-character-id").val(data.playerCharacterId);
    });
  },

  getCharacterDetails: function getCharacterDetails() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/characterDetails",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getCharacterDetails() Error");
      }
    }).promise();

    return deferred;
  },

  createCharacterDetail: function createCharacterDetail(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/characterDetails",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Character Detail");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getCharacterDetail: function getCharacterDetail(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/characterDetails/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getCharacterDetail() Error");
      }
    }).promise();

    return deferred;
  },

  updateCharacterDetail: function updateCharacterDetail(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/characterDetails/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Character Detail");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteCharacterDetail: function deleteCharacterDetail(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/characterDetails/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteCharacterDetail() Error");
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

  characterDetails: []

};
//# sourceMappingURL=crud-character-details.js.map
