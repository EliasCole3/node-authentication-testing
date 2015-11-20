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
    abc.handlerCreatureCreateButton();
    abc.getCreatures().then(function (creatures) {
      abc.creatures = creatures;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='creature-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Creature Id</th>\n      <th>Name</th>\n      <th>Race</th>\n      <th>Hp</th>\n      <th>Ac</th>\n      <th>Will</th>\n      <th>Reflex</th>\n      <th>Gold Value</th>\n      <th>Xp Value</th>\n      <th>Level</th>\n      <th>Base to Hit Ac</th>\n      <th>Base to Hit Will</th>\n      <th>Base to Hit Reflex</th>\n      <th>Damage Modifier</th>\n      <th>Speed</th>\n      <th>Initiative</th>\n      <th>Image Filename</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.creatures.forEach(function (creature) {
      htmlString += "<tr data-id='" + creature._id + "'>";
      htmlString += "<td>" + creature.creatureId + "</td>";
      htmlString += "<td>" + creature.name + "</td>";
      htmlString += "<td>" + creature.race + "</td>";
      htmlString += "<td>" + creature.hp + "</td>";
      htmlString += "<td>" + creature.ac + "</td>";
      htmlString += "<td>" + creature.will + "</td>";
      htmlString += "<td>" + creature.reflex + "</td>";
      htmlString += "<td>" + creature.goldValue + "</td>";
      htmlString += "<td>" + creature.xpValue + "</td>";
      htmlString += "<td>" + creature.level + "</td>";
      htmlString += "<td>" + creature.baseToHitAc + "</td>";
      htmlString += "<td>" + creature.baseToHitWill + "</td>";
      htmlString += "<td>" + creature.baseToHitReflex + "</td>";
      htmlString += "<td>" + creature.damageModifier + "</td>";
      htmlString += "<td>" + creature.speed + "</td>";
      htmlString += "<td>" + creature.initiative + "</td>";
      htmlString += "<td>" + creature.imageFilename + "</td>";
      htmlString += "<td><button class='btn btn-sm update-creature' data-id='" + creature._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-creature' data-id='" + creature._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#creature-table-wrapper").html(htmlString);
    abc.handlerCreatureTable();
  },

  handlerCreatureTable: function handlerCreatureTable() {
    $(".update-creature").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Creature", abc.getCreatureForm());
      abc.fillCreatureFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-creature").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerCreatureCreateButton: function handlerCreatureCreateButton() {
    $("#creature-create-button").click(function (e) {
      ebot.showModal("New Creature", abc.getCreatureForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "creatureId": $("#creature-id").val(),
        "name": $("#name").val(),
        "race": $("#race").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "goldValue": $("#gold-value").val(),
        "xpValue": $("#xp-value").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.createCreature(jsonData).then(function (data) {
        abc.getCreatures().then(function (creatures) {
          abc.creatures = creatures;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "creatureId": $("#creature-id").val(),
        "name": $("#name").val(),
        "race": $("#race").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "goldValue": $("#gold-value").val(),
        "xpValue": $("#xp-value").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.updateCreature(id, jsonData).then(function (data) {
        abc.getCreatures().then(function (creatures) {
          abc.creatures = creatures;
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
      abc.deleteCreature(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getCreatureForm: function getCreatureForm() {
    var htmlString = "\n    <label>Creature Id</label> <input id='creature-id' type='number' class='form-control'><br />\n    <label>Name</label> <input id='name' class='form-control'><br />\n    <label>Race</label> <input id='race' class='form-control'><br />\n    <label>Hp</label> <input id='hp' type='number' class='form-control'><br />\n    <label>Ac</label> <input id='ac' type='number' class='form-control'><br />\n    <label>Will</label> <input id='will' type='number' class='form-control'><br />\n    <label>Reflex</label> <input id='reflex' type='number' class='form-control'><br />\n    <label>Gold Value</label> <input id='gold-value' type='number' class='form-control'><br />\n    <label>Xp Value</label> <input id='xp-value' type='number' class='form-control'><br />\n    <label>Level</label> <input id='level' type='number' class='form-control'><br />\n    <label>Base to Hit Ac</label> <input id='base-to-hit-ac' type='number' class='form-control'><br />\n    <label>Base to Hit Will</label> <input id='base-to-hit-will' type='number' class='form-control'><br />\n    <label>Base to Hit Reflex</label> <input id='base-to-hit-reflex' type='number' class='form-control'><br />\n    <label>Damage Modifier</label> <input id='damage-modifier' type='number' class='form-control'><br />\n    <label>Speed</label> <input id='speed' type='number' class='form-control'><br />\n    <label>Initiative</label> <input id='initiative' type='number' class='form-control'><br />\n    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillCreatureFormWithOldData: function fillCreatureFormWithOldData(id) {
    abc.getCreature(id).then(function (data) {
      $("#creature-id").val(data.creatureId), $("#name").val(data.name), $("#race").val(data.race), $("#hp").val(data.hp), $("#ac").val(data.ac), $("#will").val(data.will), $("#reflex").val(data.reflex), $("#gold-value").val(data.goldValue), $("#xp-value").val(data.xpValue), $("#level").val(data.level), $("#base-to-hit-ac").val(data.baseToHitAc), $("#base-to-hit-will").val(data.baseToHitWill), $("#base-to-hit-reflex").val(data.baseToHitReflex), $("#damage-modifier").val(data.damageModifier), $("#speed").val(data.speed), $("#initiative").val(data.initiative), $("#image-filename").val(data.imageFilename);
    });
  },

  getCreatures: function getCreatures() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/creatures",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getCreatures() Error");
      }
    }).promise();

    return deferred;
  },

  createCreature: function createCreature(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/creatures",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Creature");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getCreature: function getCreature(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/creatures/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getCreature() Error");
      }
    }).promise();

    return deferred;
  },

  updateCreature: function updateCreature(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/creatures/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Creature");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteCreature: function deleteCreature(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/creatures/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteCreature() Error");
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

  creatures: []

};
//# sourceMappingURL=crud-creatures.js.map
