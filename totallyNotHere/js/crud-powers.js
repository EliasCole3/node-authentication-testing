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
    abc.handlerPowerCreateButton();
    abc.getPowers().then(function (powers) {
      abc.powers = powers;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='power-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Power Id</th>\n      <th>Name</th>\n      <th>Type</th>\n      <th>Flavor Text</th>\n      <th>Attack Type</th>\n      <th>Damage</th>\n      <th>Effect</th>\n      <th>Description</th>\n      <th>Upgrade</th>\n      <th>Image Filename</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.powers.forEach(function (power) {
      htmlString += "<tr data-id='" + power._id + "'>";
      htmlString += "<td>" + power.powerId + "</td>";
      htmlString += "<td>" + power.name + "</td>";
      htmlString += "<td>" + power.type + "</td>";
      htmlString += "<td>" + power.flavorText + "</td>";
      htmlString += "<td>" + power.attackType + "</td>";
      htmlString += "<td>" + power.damage + "</td>";
      htmlString += "<td>" + power.effect + "</td>";
      htmlString += "<td>" + power.description + "</td>";
      htmlString += "<td>" + power.upgrade + "</td>";
      htmlString += "<td>" + power.imageFilename + "</td>";
      htmlString += "<td><button class='btn btn-sm update-power' data-id='" + power._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-power' data-id='" + power._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#power-table-wrapper").html(htmlString);
    abc.handlerPowerTable();
  },

  handlerPowerTable: function handlerPowerTable() {
    $(".update-power").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Power", abc.getPowerForm());
      abc.fillPowerFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-power").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerPowerCreateButton: function handlerPowerCreateButton() {
    $("#power-create-button").click(function (e) {
      ebot.showModal("New Power", abc.getPowerForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "powerId": $("#power-id").val(),
        "name": $("#name").val(),
        "type": $("#type").val(),
        "flavorText": $("#flavor-text").val(),
        "attackType": $("#attack-type").val(),
        "damage": $("#damage").val(),
        "effect": $("#effect").val(),
        "description": $("#description").val(),
        "upgrade": $("#upgrade").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.createPower(jsonData).then(function (data) {
        abc.getPowers().then(function (powers) {
          abc.powers = powers;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "powerId": $("#power-id").val(),
        "name": $("#name").val(),
        "type": $("#type").val(),
        "flavorText": $("#flavor-text").val(),
        "attackType": $("#attack-type").val(),
        "damage": $("#damage").val(),
        "effect": $("#effect").val(),
        "description": $("#description").val(),
        "upgrade": $("#upgrade").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.updatePower(id, jsonData).then(function (data) {
        abc.getPowers().then(function (powers) {
          abc.powers = powers;
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
      abc.deletePower(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getPowerForm: function getPowerForm() {
    var htmlString = "\n    <label>Power Id</label> <input id='power-id' type='number' class='form-control'><br />\n    <label>Name</label> <input id='name' class='form-control'><br />\n    <label>Type</label> <input id='type' class='form-control'><br />\n    <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />\n    <label>Attack Type</label> <input id='attack-type' class='form-control'><br />\n    <label>Damage</label> <input id='damage' class='form-control'><br />\n    <label>Effect</label> <input id='effect' class='form-control'><br />\n    <label>Description</label> <textarea id='description' class='form-control'></textarea><br /><br />\n    <label>Upgrade</label> <textarea id='upgrade' class='form-control'></textarea><br /><br />\n    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillPowerFormWithOldData: function fillPowerFormWithOldData(id) {
    abc.getPower(id).then(function (data) {
      $("#power-id").val(data.powerId), $("#name").val(data.name), $("#type").val(data.type), $("#flavor-text").val(data.flavorText), $("#attack-type").val(data.attackType), $("#damage").val(data.damage), $("#effect").val(data.effect), $("#description").val(data.description), $("#upgrade").val(data.upgrade), $("#image-filename").val(data.imageFilename);
    });
  },

  getPowers: function getPowers() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/powers",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getPowers() Error");
      }
    }).promise();

    return deferred;
  },

  createPower: function createPower(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/powers",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Power");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getPower: function getPower(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/powers/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getPower() Error");
      }
    }).promise();

    return deferred;
  },

  updatePower: function updatePower(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/powers/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Power");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deletePower: function deletePower(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/powers/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deletePower() Error");
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

  powers: []

};
//# sourceMappingURL=crud-powers.js.map
