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
    abc.handlerNonPlayerCharacterCreateButton();
    abc.getNonPlayerCharacters().then(function (nonPlayerCharacters) {
      abc.nonPlayerCharacters = nonPlayerCharacters;
      abc.createTable();
    });
  },

  createTable: function createTable() {
    var htmlString = "<table id='non-player-character-table' class='table'>";

    htmlString += "\n    <tr>\n      <th>Non Player Character Id</th>\n      <th>Player Name</th>\n      <th>Character Name</th>\n      <th>Race</th>\n      <th>G Class</th>\n      <th>Hp</th>\n      <th>Ac</th>\n      <th>Will</th>\n      <th>Reflex</th>\n      <th>Strength</th>\n      <th>Constitution</th>\n      <th>Dexterity</th>\n      <th>Intelligence</th>\n      <th>Wisdom</th>\n      <th>Charisma</th>\n      <th>Gold</th>\n      <th>Xp</th>\n      <th>Level</th>\n      <th>Base to Hit Ac</th>\n      <th>Base to Hit Will</th>\n      <th>Base to Hit Reflex</th>\n      <th>Damage Modifier</th>\n      <th>Speed</th>\n      <th>Initiative</th>\n      <th>Action Points</th>\n      <th>Image Filename</th>\n      <th></th>\n      <th></th>\n    </tr>";

    abc.nonPlayerCharacters.forEach(function (nonPlayerCharacter) {
      htmlString += "<tr data-id='" + nonPlayerCharacter._id + "'>";
      htmlString += "<td>" + nonPlayerCharacter.nonPlayerCharacterId + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.playerName + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.characterName + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.race + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.gClass + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.hp + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.ac + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.will + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.reflex + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.strength + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.constitution + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.dexterity + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.intelligence + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.wisdom + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.charisma + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.gold + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.xp + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.level + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.baseToHitAc + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.baseToHitWill + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.baseToHitReflex + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.damageModifier + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.speed + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.initiative + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.actionPoints + "</td>";
      htmlString += "<td>" + nonPlayerCharacter.imageFilename + "</td>";
      htmlString += "<td><button class='btn btn-sm update-non-player-character' data-id='" + nonPlayerCharacter._id + "'>Update</button></td>";
      htmlString += "<td><button class='btn btn-sm delete-non-player-character' data-id='" + nonPlayerCharacter._id + "'>Delete</button></td>";
      htmlString += "</tr>";
    });

    htmlString += "</table>";
    $("#non-player-character-table-wrapper").html(htmlString);
    abc.handlerNonPlayerCharacterTable();
  },

  handlerNonPlayerCharacterTable: function handlerNonPlayerCharacterTable() {
    $(".update-non-player-character").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Update Non Player Character", abc.getNonPlayerCharacterForm());
      abc.fillNonPlayerCharacterFormWithOldData(id);
      abc.handlerUpdate(id);
    });

    $(".delete-non-player-character").click(function (e) {
      var button = $(e.currentTarget);
      var id = button.attr("data-id");
      ebot.showModal("Are you sure?", "<button id='submit-deletion' class='btn btn-lg form-control' data-id='" + id + "' type='submit'>Yes</button>");
      abc.handlerDelete();
    });
  },

  handlerNonPlayerCharacterCreateButton: function handlerNonPlayerCharacterCreateButton() {
    $("#non-player-character-create-button").click(function (e) {
      ebot.showModal("New Non Player Character", abc.getNonPlayerCharacterForm());
      abc.handlerCreate();
    });
  },

  handlerCreate: function handlerCreate() {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "nonPlayerCharacterId": $("#non-player-character-id").val(),
        "playerName": $("#player-name").val(),
        "characterName": $("#character-name").val(),
        "race": $("#race").val(),
        "gClass": $("#g-class").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "strength": $("#strength").val(),
        "constitution": $("#constitution").val(),
        "dexterity": $("#dexterity").val(),
        "intelligence": $("#intelligence").val(),
        "wisdom": $("#wisdom").val(),
        "charisma": $("#charisma").val(),
        "gold": $("#gold").val(),
        "xp": $("#xp").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "actionPoints": $("#action-points").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.createNonPlayerCharacter(jsonData).then(function (data) {
        abc.getNonPlayerCharacters().then(function (nonPlayerCharacters) {
          abc.nonPlayerCharacters = nonPlayerCharacters;
          abc.createTable();
          ebot.hideModal();
        });
      });
    });
  },

  handlerUpdate: function handlerUpdate(id) {
    $("#submit").click(function (e) {
      var jsonData = JSON.stringify({
        "nonPlayerCharacterId": $("#non-player-character-id").val(),
        "playerName": $("#player-name").val(),
        "characterName": $("#character-name").val(),
        "race": $("#race").val(),
        "gClass": $("#g-class").val(),
        "hp": $("#hp").val(),
        "ac": $("#ac").val(),
        "will": $("#will").val(),
        "reflex": $("#reflex").val(),
        "strength": $("#strength").val(),
        "constitution": $("#constitution").val(),
        "dexterity": $("#dexterity").val(),
        "intelligence": $("#intelligence").val(),
        "wisdom": $("#wisdom").val(),
        "charisma": $("#charisma").val(),
        "gold": $("#gold").val(),
        "xp": $("#xp").val(),
        "level": $("#level").val(),
        "baseToHitAc": $("#base-to-hit-ac").val(),
        "baseToHitWill": $("#base-to-hit-will").val(),
        "baseToHitReflex": $("#base-to-hit-reflex").val(),
        "damageModifier": $("#damage-modifier").val(),
        "speed": $("#speed").val(),
        "initiative": $("#initiative").val(),
        "actionPoints": $("#action-points").val(),
        "imageFilename": $("#image-filename").val()
      });

      abc.updateNonPlayerCharacter(id, jsonData).then(function (data) {
        abc.getNonPlayerCharacters().then(function (nonPlayerCharacters) {
          abc.nonPlayerCharacters = nonPlayerCharacters;
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
      abc.deleteNonPlayerCharacter(id).then(function () {
        ebot.hideModal();
        $("tr[data-id=" + id + "]").remove();
      });
    });
  },

  getNonPlayerCharacterForm: function getNonPlayerCharacterForm() {
    var htmlString = "\n    <label>Non Player Character Id</label> <input id='non-player-character-id' type='number' class='form-control'><br />\n    <label>Player Name</label> <input id='player-name' class='form-control'><br />\n    <label>Character Name</label> <input id='character-name' class='form-control'><br />\n    <label>Race</label> <input id='race' class='form-control'><br />\n    <label>G Class</label> <input id='g-class' class='form-control'><br />\n    <label>Hp</label> <input id='hp' type='number' class='form-control'><br />\n    <label>Ac</label> <input id='ac' type='number' class='form-control'><br />\n    <label>Will</label> <input id='will' type='number' class='form-control'><br />\n    <label>Reflex</label> <input id='reflex' type='number' class='form-control'><br />\n    <label>Strength</label> <input id='strength' type='number' class='form-control'><br />\n    <label>Constitution</label> <input id='constitution' type='number' class='form-control'><br />\n    <label>Dexterity</label> <input id='dexterity' type='number' class='form-control'><br />\n    <label>Intelligence</label> <input id='intelligence' type='number' class='form-control'><br />\n    <label>Wisdom</label> <input id='wisdom' type='number' class='form-control'><br />\n    <label>Charisma</label> <input id='charisma' type='number' class='form-control'><br />\n    <label>Gold</label> <input id='gold' type='number' class='form-control'><br />\n    <label>Xp</label> <input id='xp' type='number' class='form-control'><br />\n    <label>Level</label> <input id='level' type='number' class='form-control'><br />\n    <label>Base to Hit Ac</label> <input id='base-to-hit-ac' type='number' class='form-control'><br />\n    <label>Base to Hit Will</label> <input id='base-to-hit-will' type='number' class='form-control'><br />\n    <label>Base to Hit Reflex</label> <input id='base-to-hit-reflex' type='number' class='form-control'><br />\n    <label>Damage Modifier</label> <input id='damage-modifier' type='number' class='form-control'><br />\n    <label>Speed</label> <input id='speed' type='number' class='form-control'><br />\n    <label>Initiative</label> <input id='initiative' type='number' class='form-control'><br />\n    <label>Action Points</label> <input id='action-points' type='number' class='form-control'><br />\n    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />\n    <button id='submit' class='form-control' type='submit'>Submit</button>";
    return htmlString;
  },

  fillNonPlayerCharacterFormWithOldData: function fillNonPlayerCharacterFormWithOldData(id) {
    abc.getNonPlayerCharacter(id).then(function (data) {
      $("#non-player-character-id").val(data.nonPlayerCharacterId), $("#player-name").val(data.playerName), $("#character-name").val(data.characterName), $("#race").val(data.race), $("#g-class").val(data.gClass), $("#hp").val(data.hp), $("#ac").val(data.ac), $("#will").val(data.will), $("#reflex").val(data.reflex), $("#strength").val(data.strength), $("#constitution").val(data.constitution), $("#dexterity").val(data.dexterity), $("#intelligence").val(data.intelligence), $("#wisdom").val(data.wisdom), $("#charisma").val(data.charisma), $("#gold").val(data.gold), $("#xp").val(data.xp), $("#level").val(data.level), $("#base-to-hit-ac").val(data.baseToHitAc), $("#base-to-hit-will").val(data.baseToHitWill), $("#base-to-hit-reflex").val(data.baseToHitReflex), $("#damage-modifier").val(data.damageModifier), $("#speed").val(data.speed), $("#initiative").val(data.initiative), $("#action-points").val(data.actionPoints), $("#image-filename").val(data.imageFilename);
    });
  },

  getNonPlayerCharacters: function getNonPlayerCharacters() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/nonPlayerCharacters",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getNonPlayerCharacters() Error");
      }
    }).promise();

    return deferred;
  },

  createNonPlayerCharacter: function createNonPlayerCharacter(jsonData) {
    console.log(jsonData);
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/nonPlayerCharacters",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Non Player Character");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getNonPlayerCharacter: function getNonPlayerCharacter(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/nonPlayerCharacters/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getNonPlayerCharacter() Error");
      }
    }).promise();

    return deferred;
  },

  updateNonPlayerCharacter: function updateNonPlayerCharacter(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/nonPlayerCharacters/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Non Player Character");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deleteNonPlayerCharacter: function deleteNonPlayerCharacter(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/nonPlayerCharacters/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deleteNonPlayerCharacter() Error");
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

  nonPlayerCharacters: []

};
//# sourceMappingURL=crud-non-player-characters.js.map
