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
    abc.handlerItemCreateButton();
    abc.getItems().then(function (items) {
      abc.items = items;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='item-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Item Id</th>\n      <th>Name</th>\n      <th>Cost</th>\n      <th>Flavor Text</th>\n      <th>Effect</th>\n      <th>Image Filename</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.items.forEach(function (item) {
      htmlString += "<tr data-id='" + item._id + "'>";
      htmlString += "<td>" + item.itemId + "</td>";
      htmlString += "<td>" + item.name + "</td>";
      htmlString += "<td>" + item.cost + "</td>";
      htmlString += "<td>" + item.flavorText + "</td>";
      htmlString += "<td>" + item.effect + "</td>";
      htmlString += "<td>" + item.imageFilename + "</td>";
      htmlString += "<td><button class='btn btn-sm update-item' data-id='" + item._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-item' data-id='" + item._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#item-table-wrapper").html(htmlString);
    abc.handlerItemTable();
  },

  handlerItemTable: function handlerItemTable() {
    $(".update-item").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Item", abc.getItemForm());
      abc.fillItemFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-item").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerItemCreateButton: function handlerItemCreateButton() {
    $("#item-create-button").click(function (e) {
      ebot.showModal("New Item", abc.getItemForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "itemId": $("#item-id").val(),
        "name": $("#name").val(),
        "cost": $("#cost").val(),
        "flavorText": $("#flavor-text").val(),
        "effect": $("#effect").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.createItem(jsonData).then(function (data) {
        abc.getItems().then(function (items) {
          abc.items = items;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "itemId": $("#item-id").val(),
        "name": $("#name").val(),
        "cost": $("#cost").val(),
        "flavorText": $("#flavor-text").val(),
        "effect": $("#effect").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.updateItem(id, jsonData).then(function (data) {
        abc.getItems().then(function (items) {
          abc.items = items;
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
      abc.deleteItem(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getItemForm: function getItemForm() {
    var htmlString = "\n    <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />\n    <label>Name</label> <input id='name' class='form-control'><br />\n    <label>Cost</label> <input id='cost' class='form-control'><br />\n    <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />\n    <label>Effect</label> <input id='effect' class='form-control'><br />\n    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillItemFormWithOldData: function fillItemFormWithOldData(id) {
    abc.getItem(id).then(function (data) {
      $("#item-id").val(data.itemId), $("#name").val(data.name), $("#cost").val(data.cost), $("#flavor-text").val(data.flavorText), $("#effect").val(data.effect), $("#image-filename").val(data.imageFilename);
    });
  },

  getItems: function getItems() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/items",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getItems() Error");
      }
    }).promise();

    return deferred;
  },

  createItem: function createItem(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/items",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Item");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getItem: function getItem(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/items/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getItem() Error");
      }
    }).promise();

    return deferred;
  },

  updateItem: function updateItem(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/items/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Item");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteItem: function deleteItem(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/items/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteItem() Error");
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

  items: []

};
//# sourceMappingURL=crud-items.js.map
