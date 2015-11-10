"use strict";

$(function () {
  abc.initialize();
  // ebot.updateDocumentation(abc)
});

/**
 * initialize()
 * assignInitialHandlers()
 * handlerTestLogEntries()
 * handlerTestCreateLogEntry()
 * handlerTestGetLogEntry()
 * handlerTestPutLogEntry()
 * handlerTestDeleteLogEntry()
 * getLogEntries()
 * createLogEntry()
 * getLogEntry()
 * putLogEntry()
 * deleteLogEntry()
 * convertJsonToFormData()
 *
 * apiurl
 */
var abc = {

  initialize: function initialize() {
    abc.assignInitialHandlers();
  },

  assignInitialHandlers: function assignInitialHandlers() {
    // abc.handlerTestLogEntries()
    // abc.handlerTestCreateLogEntry()
    // abc.handlerTestGetLogEntry()
    // abc.handlerTestPutLogEntry()
    // abc.handlerTestDeleteLogEntry()

    abc.handlerTestCreatures();
    abc.handlerTestCreateCreature();
    abc.handlerTestGetCreature();
    abc.handlerTestPutCreature();
    abc.handlerTestDeleteCreature();
    abc.handlerTestNonPlayerCharacters();
    abc.handlerTestCreateNonPlayerCharacter();
    abc.handlerTestGetNonPlayerCharacter();
    abc.handlerTestPutNonPlayerCharacter();
    abc.handlerTestDeleteNonPlayerCharacter();
    abc.handlerTestItems();
    abc.handlerTestCreateItem();
    abc.handlerTestGetItem();
    abc.handlerTestPutItem();
    abc.handlerTestDeleteItem();
    abc.handlerTestPlayerCharacters();
    abc.handlerTestCreatePlayerCharacter();
    abc.handlerTestGetPlayerCharacter();
    abc.handlerTestPutPlayerCharacter();
    abc.handlerTestDeletePlayerCharacter();
    abc.handlerTestLogs();
    abc.handlerTestCreateLog();
    abc.handlerTestGetLog();
    abc.handlerTestPutLog();
    abc.handlerTestDeleteLog();
    abc.handlerTestLogEntries();
    abc.handlerTestCreateLogEntry();
    abc.handlerTestGetLogEntry();
    abc.handlerTestPutLogEntry();
    abc.handlerTestDeleteLogEntry();
    abc.handlerTestPowers();
    abc.handlerTestCreatePower();
    abc.handlerTestGetPower();
    abc.handlerTestPutPower();
    abc.handlerTestDeletePower();
  },

  // handlerTestLogEntries: () => {
  //   $("#test-log-entries").click(e => {
  //     abc.getLogEntries().then(data => {
  //       console.log(data)
  //     })
  //   })
  // },

  // handlerTestCreateLogEntry: () => {
  //   $("#test-create-log-entry").click(e => {
  //     let logEntryId = "1"
  //     let message = "this is a log entry"
  //     let date = "11-09-15"
  //     let logId = "1"

  //     let jsonData = JSON.stringify({
  //       "logEntryId": logEntryId,
  //       "message": message,
  //       "date": date,
  //       "logId": logId
  //     })

  //     abc.createLogEntry(jsonData).then(data => {
  //       console.log(data)
  //       $("#log-entry-id").html(data.obj._id)
  //     })
  //   })
  // },

  // handlerTestGetLogEntry: () => {
  //   $("#test-get-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()

  //     abc.getLogEntry(id).then(data => {
  //       console.log(data)
  //     })

  //   })
  // },

  // handlerTestPutLogEntry: () => {
  //   $("#test-put-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()

  //     let logEntryId = "12"
  //     let message = "this is a log entry :D"
  //     let date = "11-09-15"
  //     let logId = "12"

  //     let jsonData = JSON.stringify({
  //       "logEntryId": logEntryId,
  //       "message": message,
  //       "date": date,
  //       "logId": logId
  //     })

  //     abc.putLogEntry(id, jsonData).then(data => {
  //       console.log(data)
  //     })
  //   })
  // },

  // handlerTestDeleteLogEntry: id => {
  //   $("#test-delete-log-entry").click(e => {
  //     let id = $("#log-entry-id").html()

  //     abc.deleteLogEntry(id).then(() => {
  //       console.log("deleted!")
  //     })

  //   })
  // },

  // getLogEntries: () => {
  //   let deferred = $.ajax({
  //     type: "GET",
  //     url: `${abc.apiurl}/logEntries`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("getLogEntries() Error")}
  //   }).promise()

  //   return deferred
  // },

  // createLogEntry: jsonData => {
  //   let deferred = $.ajax({
  //     type: "POST",
  //     url: `${abc.apiurl}/logEntries`,
  //     data: abc.convertJsonToFormData(jsonData),
  //     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //     success: (data, status, jqXHR) => {},
  //     error: (jqXHR, status) => {
  //       ebot.notify("error creating a log entry")
  //       console.log(jqXHR)
  //     }
  //   }).promise()

  //   return deferred
  // },

  // getLogEntry: id => {
  //   let deferred = $.ajax({
  //     type: "GET",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("getLogEntry() Error")}
  //   }).promise()

  //   return deferred
  // },

  // putLogEntry: (id, jsonData) => {
  //   let deferred = $.ajax({
  //     type: "PUT",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     data: abc.convertJsonToFormData(jsonData),
  //     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //     success: (data, status, jqXHR) => {},
  //     error: (jqXHR, status) => {
  //       ebot.notify("error updating a log entry")
  //       console.log(jqXHR)
  //     }
  //   }).promise()

  //   return deferred
  // },

  // deleteLogEntry: id => {
  //   let deferred = $.ajax({
  //     type: "DELETE",
  //     url: `${abc.apiurl}/logEntries/${id}`,
  //     success: function(data, status, jqXHR) {},
  //     error: function(jqXHR, status) {console.log("deleteLogEntry() Error")}
  //   }).promise()

  //   return deferred
  // },

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

  apiurl: "http://localhost:8082",

  handlerTestCreatures: function handlerTestCreatures() {
    $("#test-creatures").click(function (e) {
      abc.getCreatures().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreateCreature: function handlerTestCreateCreature() {
    $("#test-create-creature").click(function (e) {
      var creatureId = ":)";
      var name = ":)";
      var race = ":)";
      var hp = ":)";
      var ac = ":)";
      var will = ":)";
      var reflex = ":)";
      var goldValue = ":)";
      var xpValue = ":)";
      var level = ":)";
      var baseToHitAc = ":)";
      var baseToHitWill = ":)";
      var baseToHitReflex = ":)";
      var damageModifier = ":)";
      var speed = ":)";
      var initiative = ":)";
      var imageFilename = ":)";

      var jsonData = JSON.stringify({
        "creatureId": creatureId,
        "name": name,
        "race": race,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "goldValue": goldValue,
        "xpValue": xpValue,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "imageFilename": imageFilename
      });

      abc.createCreature(jsonData).then(function (data) {
        console.log(data);
        $("#creature-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetCreature: function handlerTestGetCreature() {
    $("#test-get-creature").click(function (e) {
      var id = $("#creature-id").html();

      abc.getCreature(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutCreature: function handlerTestPutCreature() {
    $("#test-put-creature").click(function (e) {
      var id = $("#creature-id").html();

      var creatureId = ":D";
      var name = ":D";
      var race = ":D";
      var hp = ":D";
      var ac = ":D";
      var will = ":D";
      var reflex = ":D";
      var goldValue = ":D";
      var xpValue = ":D";
      var level = ":D";
      var baseToHitAc = ":D";
      var baseToHitWill = ":D";
      var baseToHitReflex = ":D";
      var damageModifier = ":D";
      var speed = ":D";
      var initiative = ":D";
      var imageFilename = ":D";

      var jsonData = JSON.stringify({
        "creatureId": creatureId,
        "name": name,
        "race": race,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "goldValue": goldValue,
        "xpValue": xpValue,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "imageFilename": imageFilename
      });

      abc.putCreature(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeleteCreature: function handlerTestDeleteCreature(id) {
    $("#test-delete-creature").click(function (e) {
      var id = $("#creature-id").html();

      abc.deleteCreature(id).then(function () {
        console.log("deleted!");
      });
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

  putCreature: function putCreature(id, jsonData) {
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

  handlerTestNonPlayerCharacters: function handlerTestNonPlayerCharacters() {
    $("#test-non-player-characters").click(function (e) {
      abc.getNonPlayerCharacters().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreateNonPlayerCharacter: function handlerTestCreateNonPlayerCharacter() {
    $("#test-create-non-player-character").click(function (e) {
      var nonPlayerCharacterId = ":)";
      var playerName = ":)";
      var characterName = ":)";
      var race = ":)";
      var gClass = ":)";
      var hp = ":)";
      var ac = ":)";
      var will = ":)";
      var reflex = ":)";
      var strength = ":)";
      var constitution = ":)";
      var dexterity = ":)";
      var intelligence = ":)";
      var wisdom = ":)";
      var charisma = ":)";
      var gold = ":)";
      var xp = ":)";
      var level = ":)";
      var baseToHitAc = ":)";
      var baseToHitWill = ":)";
      var baseToHitReflex = ":)";
      var damageModifier = ":)";
      var speed = ":)";
      var initiative = ":)";
      var actionPoints = ":)";
      var imageFilename = ":)";

      var jsonData = JSON.stringify({
        "nonPlayerCharacterId": nonPlayerCharacterId,
        "playerName": playerName,
        "characterName": characterName,
        "race": race,
        "gClass": gClass,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "strength": strength,
        "constitution": constitution,
        "dexterity": dexterity,
        "intelligence": intelligence,
        "wisdom": wisdom,
        "charisma": charisma,
        "gold": gold,
        "xp": xp,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "actionPoints": actionPoints,
        "imageFilename": imageFilename
      });

      abc.createNonPlayerCharacter(jsonData).then(function (data) {
        console.log(data);
        $("#non-player-character-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetNonPlayerCharacter: function handlerTestGetNonPlayerCharacter() {
    $("#test-get-non-player-character").click(function (e) {
      var id = $("#non-player-character-id").html();

      abc.getNonPlayerCharacter(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutNonPlayerCharacter: function handlerTestPutNonPlayerCharacter() {
    $("#test-put-non-player-character").click(function (e) {
      var id = $("#non-player-character-id").html();

      var nonPlayerCharacterId = ":D";
      var playerName = ":D";
      var characterName = ":D";
      var race = ":D";
      var gClass = ":D";
      var hp = ":D";
      var ac = ":D";
      var will = ":D";
      var reflex = ":D";
      var strength = ":D";
      var constitution = ":D";
      var dexterity = ":D";
      var intelligence = ":D";
      var wisdom = ":D";
      var charisma = ":D";
      var gold = ":D";
      var xp = ":D";
      var level = ":D";
      var baseToHitAc = ":D";
      var baseToHitWill = ":D";
      var baseToHitReflex = ":D";
      var damageModifier = ":D";
      var speed = ":D";
      var initiative = ":D";
      var actionPoints = ":D";
      var imageFilename = ":D";

      var jsonData = JSON.stringify({
        "nonPlayerCharacterId": nonPlayerCharacterId,
        "playerName": playerName,
        "characterName": characterName,
        "race": race,
        "gClass": gClass,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "strength": strength,
        "constitution": constitution,
        "dexterity": dexterity,
        "intelligence": intelligence,
        "wisdom": wisdom,
        "charisma": charisma,
        "gold": gold,
        "xp": xp,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "actionPoints": actionPoints,
        "imageFilename": imageFilename
      });

      abc.putNonPlayerCharacter(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeleteNonPlayerCharacter: function handlerTestDeleteNonPlayerCharacter(id) {
    $("#test-delete-non-player-character").click(function (e) {
      var id = $("#non-player-character-id").html();

      abc.deleteNonPlayerCharacter(id).then(function () {
        console.log("deleted!");
      });
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
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/nonPlayerCharacters",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Non player character");
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

  putNonPlayerCharacter: function putNonPlayerCharacter(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/nonPlayerCharacters/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Non player character");
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

  handlerTestItems: function handlerTestItems() {
    $("#test-items").click(function (e) {
      abc.getItems().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreateItem: function handlerTestCreateItem() {
    $("#test-create-item").click(function (e) {
      var itemId = ":)";
      var name = ":)";
      var cost = ":)";
      var flavorText = ":)";
      var effect = ":)";
      var imageFilename = ":)";

      var jsonData = JSON.stringify({
        "itemId": itemId,
        "name": name,
        "cost": cost,
        "flavorText": flavorText,
        "effect": effect,
        "imageFilename": imageFilename
      });

      abc.createItem(jsonData).then(function (data) {
        console.log(data);
        $("#item-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetItem: function handlerTestGetItem() {
    $("#test-get-item").click(function (e) {
      var id = $("#item-id").html();

      abc.getItem(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutItem: function handlerTestPutItem() {
    $("#test-put-item").click(function (e) {
      var id = $("#item-id").html();

      var itemId = ":D";
      var name = ":D";
      var cost = ":D";
      var flavorText = ":D";
      var effect = ":D";
      var imageFilename = ":D";

      var jsonData = JSON.stringify({
        "itemId": itemId,
        "name": name,
        "cost": cost,
        "flavorText": flavorText,
        "effect": effect,
        "imageFilename": imageFilename
      });

      abc.putItem(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeleteItem: function handlerTestDeleteItem(id) {
    $("#test-delete-item").click(function (e) {
      var id = $("#item-id").html();

      abc.deleteItem(id).then(function () {
        console.log("deleted!");
      });
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

  putItem: function putItem(id, jsonData) {
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

  handlerTestPlayerCharacters: function handlerTestPlayerCharacters() {
    $("#test-player-characters").click(function (e) {
      abc.getPlayerCharacters().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreatePlayerCharacter: function handlerTestCreatePlayerCharacter() {
    $("#test-create-player-character").click(function (e) {
      var playerCharacterId = ":)";
      var playerName = ":)";
      var characterName = ":)";
      var race = ":)";
      var gClass = ":)";
      var hp = ":)";
      var ac = ":)";
      var will = ":)";
      var reflex = ":)";
      var strength = ":)";
      var constitution = ":)";
      var dexterity = ":)";
      var intelligence = ":)";
      var wisdom = ":)";
      var charisma = ":)";
      var gold = ":)";
      var xp = ":)";
      var level = ":)";
      var baseToHitAc = ":)";
      var baseToHitWill = ":)";
      var baseToHitReflex = ":)";
      var damageModifier = ":)";
      var speed = ":)";
      var initiative = ":)";
      var actionPoints = ":)";
      var imageFilename = ":)";

      var jsonData = JSON.stringify({
        "playerCharacterId": playerCharacterId,
        "playerName": playerName,
        "characterName": characterName,
        "race": race,
        "gClass": gClass,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "strength": strength,
        "constitution": constitution,
        "dexterity": dexterity,
        "intelligence": intelligence,
        "wisdom": wisdom,
        "charisma": charisma,
        "gold": gold,
        "xp": xp,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "actionPoints": actionPoints,
        "imageFilename": imageFilename
      });

      abc.createPlayerCharacter(jsonData).then(function (data) {
        console.log(data);
        $("#player-character-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetPlayerCharacter: function handlerTestGetPlayerCharacter() {
    $("#test-get-player-character").click(function (e) {
      var id = $("#player-character-id").html();

      abc.getPlayerCharacter(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutPlayerCharacter: function handlerTestPutPlayerCharacter() {
    $("#test-put-player-character").click(function (e) {
      var id = $("#player-character-id").html();

      var playerCharacterId = ":D";
      var playerName = ":D";
      var characterName = ":D";
      var race = ":D";
      var gClass = ":D";
      var hp = ":D";
      var ac = ":D";
      var will = ":D";
      var reflex = ":D";
      var strength = ":D";
      var constitution = ":D";
      var dexterity = ":D";
      var intelligence = ":D";
      var wisdom = ":D";
      var charisma = ":D";
      var gold = ":D";
      var xp = ":D";
      var level = ":D";
      var baseToHitAc = ":D";
      var baseToHitWill = ":D";
      var baseToHitReflex = ":D";
      var damageModifier = ":D";
      var speed = ":D";
      var initiative = ":D";
      var actionPoints = ":D";
      var imageFilename = ":D";

      var jsonData = JSON.stringify({
        "playerCharacterId": playerCharacterId,
        "playerName": playerName,
        "characterName": characterName,
        "race": race,
        "gClass": gClass,
        "hp": hp,
        "ac": ac,
        "will": will,
        "reflex": reflex,
        "strength": strength,
        "constitution": constitution,
        "dexterity": dexterity,
        "intelligence": intelligence,
        "wisdom": wisdom,
        "charisma": charisma,
        "gold": gold,
        "xp": xp,
        "level": level,
        "baseToHitAc": baseToHitAc,
        "baseToHitWill": baseToHitWill,
        "baseToHitReflex": baseToHitReflex,
        "damageModifier": damageModifier,
        "speed": speed,
        "initiative": initiative,
        "actionPoints": actionPoints,
        "imageFilename": imageFilename
      });

      abc.putPlayerCharacter(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeletePlayerCharacter: function handlerTestDeletePlayerCharacter(id) {
    $("#test-delete-player-character").click(function (e) {
      var id = $("#player-character-id").html();

      abc.deletePlayerCharacter(id).then(function () {
        console.log("deleted!");
      });
    });
  },

  getPlayerCharacters: function getPlayerCharacters() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/playerCharacters",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getPlayerCharacters() Error");
      }
    }).promise();

    return deferred;
  },

  createPlayerCharacter: function createPlayerCharacter(jsonData) {
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/playerCharacters",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Player character");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  getPlayerCharacter: function getPlayerCharacter(id) {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/playerCharacters/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getPlayerCharacter() Error");
      }
    }).promise();

    return deferred;
  },

  putPlayerCharacter: function putPlayerCharacter(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/playerCharacters/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Player character");
        console.log(jqXHR);
      }
    }).promise();

    return deferred;
  },

  deletePlayerCharacter: function deletePlayerCharacter(id) {
    var deferred = $.ajax({
      type: "DELETE",
      url: abc.apiurl + "/playerCharacters/" + id,
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("deletePlayerCharacter() Error");
      }
    }).promise();

    return deferred;
  },

  handlerTestLogEntries: function handlerTestLogEntries() {
    $("#test-log-entries").click(function (e) {
      abc.getLogEntries().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreateLogEntry: function handlerTestCreateLogEntry() {
    $("#test-create-log-entry").click(function (e) {
      var logEntryId = ":)";
      var message = ":)";
      var date = ":)";
      var logId = ":)";

      var jsonData = JSON.stringify({
        "logEntryId": logEntryId,
        "message": message,
        "date": date,
        "logId": logId
      });

      abc.createLogEntry(jsonData).then(function (data) {
        console.log(data);
        $("#log-entry-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetLogEntry: function handlerTestGetLogEntry() {
    $("#test-get-log-entry").click(function (e) {
      var id = $("#log-entry-id").html();

      abc.getLogEntry(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutLogEntry: function handlerTestPutLogEntry() {
    $("#test-put-log-entry").click(function (e) {
      var id = $("#log-entry-id").html();

      var logEntryId = ":D";
      var message = ":D";
      var date = ":D";
      var logId = ":D";

      var jsonData = JSON.stringify({
        "logEntryId": logEntryId,
        "message": message,
        "date": date,
        "logId": logId
      });

      abc.putLogEntry(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeleteLogEntry: function handlerTestDeleteLogEntry(id) {
    $("#test-delete-log-entry").click(function (e) {
      var id = $("#log-entry-id").html();

      abc.deleteLogEntry(id).then(function () {
        console.log("deleted!");
      });
    });
  },

  getLogEntries: function getLogEntries() {
    var deferred = $.ajax({
      type: "GET",
      url: abc.apiurl + "/logEntries",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        console.log("getLogEntries() Error");
      }
    }).promise();

    return deferred;
  },

  createLogEntry: function createLogEntry(jsonData) {
    var deferred = $.ajax({
      type: "POST",
      url: abc.apiurl + "/logEntries",
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error creating a Log entry");
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

  putLogEntry: function putLogEntry(id, jsonData) {
    var deferred = $.ajax({
      type: "PUT",
      url: abc.apiurl + "/logEntries/" + id,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function success(data, status, jqXHR) {},
      error: function error(jqXHR, status) {
        ebot.notify("error updating a Log entry");
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

  handlerTestPowers: function handlerTestPowers() {
    $("#test-powers").click(function (e) {
      abc.getPowers().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreatePower: function handlerTestCreatePower() {
    $("#test-create-power").click(function (e) {
      var powerId = ":)";
      var name = ":)";
      var type = ":)";
      var flavorText = ":)";
      var attackType = ":)";
      var damage = ":)";
      var effect = ":)";
      var description = ":)";
      var upgrade = ":)";
      var imageFilename = ":)";

      var jsonData = JSON.stringify({
        "powerId": powerId,
        "name": name,
        "type": type,
        "flavorText": flavorText,
        "attackType": attackType,
        "damage": damage,
        "effect": effect,
        "description": description,
        "upgrade": upgrade,
        "imageFilename": imageFilename
      });

      abc.createPower(jsonData).then(function (data) {
        console.log(data);
        $("#power-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetPower: function handlerTestGetPower() {
    $("#test-get-power").click(function (e) {
      var id = $("#power-id").html();

      abc.getPower(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutPower: function handlerTestPutPower() {
    $("#test-put-power").click(function (e) {
      var id = $("#power-id").html();

      var powerId = ":D";
      var name = ":D";
      var type = ":D";
      var flavorText = ":D";
      var attackType = ":D";
      var damage = ":D";
      var effect = ":D";
      var description = ":D";
      var upgrade = ":D";
      var imageFilename = ":D";

      var jsonData = JSON.stringify({
        "powerId": powerId,
        "name": name,
        "type": type,
        "flavorText": flavorText,
        "attackType": attackType,
        "damage": damage,
        "effect": effect,
        "description": description,
        "upgrade": upgrade,
        "imageFilename": imageFilename
      });

      abc.putPower(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeletePower: function handlerTestDeletePower(id) {
    $("#test-delete-power").click(function (e) {
      var id = $("#power-id").html();

      abc.deletePower(id).then(function () {
        console.log("deleted!");
      });
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

  putPower: function putPower(id, jsonData) {
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

  handlerTestLogs: function handlerTestLogs() {
    $("#test-logs").click(function (e) {
      abc.getLogs().then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestCreateLog: function handlerTestCreateLog() {
    $("#test-create-log").click(function (e) {
      var logId = ":)";
      var logName = ":)";
      var playerCharacterId = ":)";

      var jsonData = JSON.stringify({
        "logId": logId,
        "logName": logName,
        "playerCharacterId": playerCharacterId
      });

      abc.createLog(jsonData).then(function (data) {
        console.log(data);
        $("#log-id").html(data.obj._id);
      });
    });
  },

  handlerTestGetLog: function handlerTestGetLog() {
    $("#test-get-log").click(function (e) {
      var id = $("#log-id").html();

      abc.getLog(id).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestPutLog: function handlerTestPutLog() {
    $("#test-put-log").click(function (e) {
      var id = $("#log-id").html();

      var logId = ":D";
      var logName = ":D";
      var playerCharacterId = ":D";

      var jsonData = JSON.stringify({
        "logId": logId,
        "logName": logName,
        "playerCharacterId": playerCharacterId
      });

      abc.putLog(id, jsonData).then(function (data) {
        console.log(data);
      });
    });
  },

  handlerTestDeleteLog: function handlerTestDeleteLog(id) {
    $("#test-delete-log").click(function (e) {
      var id = $("#log-id").html();

      abc.deleteLog(id).then(function () {
        console.log("deleted!");
      });
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

  putLog: function putLog(id, jsonData) {
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
  }

};
//# sourceMappingURL=testing.js.map
