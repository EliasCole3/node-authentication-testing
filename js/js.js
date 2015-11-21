"use strict";

$(function () {
  ebot.insertModalHtml("modal-lg");
  abc.initialize();
  // ebot.updateDocumentation(abc)
});

/**
 * initialize()
 * assignInitialHandlers()
 * handlerDrag()
 * handlerAddDiv()
 * createNewWireframeDiv()
 *
 * dragDelay
 * dragCounter
 * socket
 * currentDynamicDivId
 * draggableOptions
 * resizableOptions
 */
var abc = {

  initialize: function initialize() {
    abc.socket = io();
    abc.assignInitialHandlers();

    try {
      var user = JSON.parse($("#data-for-you").html());
      console.log(user);

      abc.setCurrentPlayerCharacterId(user);

      var DMs = ["a", "bliss"];
      var players = ["a", "b", "c", "bliss", "laurana", "andros", "skjor", "placeholder", "ares"];

      if (DMs.indexOf(user.local.username) > -1) {
        abc.userIsDM = true;
      }

      if (players.indexOf(user.local.username) > -1) {
        abc.userIsPlayer = true;
      }

      if (!abc.userIsDM && !abc.userIsPlayer) {
        alert("whoooo aaaarrrre yoooouuuu? 0.o");
      }

      $.when.apply($, abc.retrieveInitialModels()).done(function () {
        abc.fillTopDrawer();
        abc.fillRightDrawer();
        abc.fillLeftDrawer();
        abc.fillBottomDrawer();
      });
    } catch (e) {
      console.log("error parsing authentication data: " + e);
    }
  },

  setCurrentPlayerCharacterId: function setCurrentPlayerCharacterId(user) {

    switch (user.local.username) {
      case "laurana":
        abc.currentPlayerCharacterId = 1;
        break;
      case "andros":
        abc.currentPlayerCharacterId = 2;
        break;
      case "skjor":
        abc.currentPlayerCharacterId = 3;
        break;
      case "placeholder":
        abc.currentPlayerCharacterId = 4;
        break;
      case "ares":
        abc.currentPlayerCharacterId = 5;
        break;
      case "bliss":
        abc.currentPlayerCharacterId = 0;
        break;
      default:
        console.log("setCurrentPlayerCharacterId() fell out of switch statement. Fix me plox. Current user:");
        console.log(user);
    }
  },

  assignInitialHandlers: function assignInitialHandlers() {
    abc.handlersSocketEventReceived();
    abc.makeDrawers();
  },

  handlersSocketEventReceived: function handlersSocketEventReceived() {

    abc.socket.on('element dragged', function (emitObj) {
      $('#' + emitObj.id).css("top", emitObj.y);
      $('#' + emitObj.id).css("left", emitObj.x);
    });

    abc.socket.on('element resized', function (emitObj) {
      $("#" + emitObj.id).css("width", emitObj.width).css("height", emitObj.height);
    });

    abc.socket.on('user connected', function () {
      abc.playSound("me-user-connected");
    });

    abc.socket.on('user disconnected', function () {
      abc.playSound("me-user-disconnected");
    });

    abc.socket.on('token added', function (emitObj) {
      abc.addTokenItem(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft);
    });

    abc.socket.on('background changed', function (emitObj) {
      abc.changeBackground(emitObj.background);
    });

    abc.socket.on('hp changed', function (emitObj) {
      abc.changeHp(emitObj.id, emitObj.val);
    });
  },

  retrieveInitialModels: function retrieveInitialModels() {
    var deferreds = [];

    deferreds.push(ebot.retrieveEntity(abc, "items"));
    deferreds.push(ebot.retrieveEntity(abc, "powers"));
    deferreds.push(ebot.retrieveEntity(abc, "creatures"));
    deferreds.push(ebot.retrieveEntity(abc, "playerCharacters"));
    deferreds.push(ebot.retrieveEntity(abc, "nonPlayerCharacters"));
    deferreds.push(ebot.retrieveEntity(abc, "joinPlayerCharacterItems"));

    return deferreds;
  },

  fillTopDrawer: function fillTopDrawer() {
    if (abc.userIsPlayer) {
      $("#top-drawer-contents").html(abc.getTopDrawerHtml());
      abc.handlerTopDrawerContents();
    } else {
      $("#top-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getTopDrawerHtml: function getTopDrawerHtml() {
    var htmlString = "<table id='player-stats-table' class=\"table-condensed\">";

    htmlString += "<tr>\n      <th>Player Name</th>\n      <th>Character Name</th>\n      <th>Current HP</th>\n      <th>Max HP</th>\n      <th>AC</th>\n      <th>Will</th>\n      <th>Reflex</th>\n      <th>To hit AC</th>\n      <th>To hit Will</th>\n      <th>To hit Reflex</th>\n      <th>Damage Modifier</th>\n      <th>Speed</th>\n      <th>Initiative</th>\n      <th>Action Points</th>\n      <th>Gold</th>\n      <th>XP</th>\n    </tr>";

    abc.playerCharacters.forEach(function (player) {
      htmlString += "<tr>\n      <td>" + player.playerName + "</td>\n      <td>" + player.characterName + "</td>\n      <td><input id='current-hp-input-" + player.playerCharacterId + "' class='current-hp-input form-control' type='number' value='" + player.hp + "'></td>\n      <td>" + player.hp + "</td>\n      <td>" + player.ac + "</td>\n      <td>" + player.will + "</td>\n      <td>" + player.reflex + "</td>\n      <td>" + player.baseToHitAc + "</td>\n      <td>" + player.baseToHitWill + "</td>\n      <td>" + player.baseToHitReflex + "</td>\n      <td>" + player.damageModifier + "</td>\n      <td>" + player.speed + "</td>\n      <td>" + player.initiative + "</td>\n      <td>" + player.actionPoints + "</td>\n      <td>" + player.gold + "</td>\n      <td>" + player.xp + "</td>\n\n    </tr>";
    });

    htmlString += "</table>";

    return htmlString;
  },

  handlerTopDrawerContents: function handlerTopDrawerContents() {
    $(".current-hp-input").on("change", function (e) {
      var element = $(e.currentTarget);
      var id = element.attr("id");
      var val = element.val();
      abc.socket.emit('hp changed', { id: id, val: val });
    });
  },

  fillBottomDrawer: function fillBottomDrawer() {
    if (abc.userIsPlayer) {
      $("#bottom-drawer-contents").html(abc.getBottomDrawerHtml());
      abc.handlerBottomDrawerContents();
    } else {
      $("#bottom-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getBottomDrawerHtml: function getBottomDrawerHtml() {
    var htmlString = "";

    return htmlString;
  },

  handlerBottomDrawerContents: function handlerBottomDrawerContents() {},

  fillLeftDrawer: function fillLeftDrawer() {
    if (abc.userIsPlayer) {
      $("#left-drawer-contents").html(abc.getLeftDrawerHtml());
      abc.handlerLeftDrawerContents();
    } else {
      $("#left-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getLeftDrawerHtml: function getLeftDrawerHtml() {
    var htmlString = "\n    <button id='toggle-lines' class='btn btn-md btn-info'>Toggle Lines</button> <br><br>\n    <button id='show-all-powers' class='btn btn-md btn-info'>Show All Powers</button>\n    ";

    if (abc.userIsDM) {
      htmlString += "<br><br>\n      <select id='background-select' data-placeholder='Choose a background...'>\n        <option value=''></option>\n        <option value='blank'>Blank</option>\n        <option value='river.jpg'>River</option>\n        <option value='twooth-library.png'>Twooth Library</option>\n        <option value='slime-cave.png'>Slim Cave</option>\n      </select>\n      ";
    }

    return htmlString;
  },

  handlerLeftDrawerContents: function handlerLeftDrawerContents() {
    $("#toggle-lines").click(function (e) {
      if ($("#lines").css("opacity") === "0.3") {
        $("#lines").velocity({ opacity: "0" });
      } else {
        $("#lines").velocity({ opacity: "0.3" });
      }
    });

    $("#show-all-powers").click(function (e) {
      ebot.showModal("All Powers", abc.viewAllPowers());
    });

    $("#background-select").chosen(ebot.chosenOptions).change(function (e) {
      var element = $(e.currentTarget);
      abc.changeBackground(element.val());
      abc.socket.emit('background changed', { background: element.val() });
    });
  },

  fillRightDrawer: function fillRightDrawer() {
    if (abc.userIsDM) {
      $("#right-drawer-contents").html(abc.getRightDrawerHtmlDM());
      abc.handlerRightDrawerContents();
    } else if (abc.userIsPlayer) {
      $("#right-drawer-contents").html(abc.getRightDrawerHtmlPlayer());
    } else {
      $("#right-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getRightDrawerHtmlDM: function getRightDrawerHtmlDM() {
    var htmlString = "";

    abc.items.forEach(function (item) {
      htmlString += "<button class='add-item-button' item-id='" + item._id + "' item-image-filename='" + item.imageFilename + "'><img src='items/" + item.imageFilename + "'></button>";
    });

    return htmlString;
  },

  getRightDrawerHtmlPlayer: function getRightDrawerHtmlPlayer() {
    var htmlString = "";

    console.log(abc.joinPlayerCharacterItems);

    var relevantItemJoins = abc.joinPlayerCharacterItems.filter(function (join) {
      return join.playerCharacterId == abc.currentPlayerCharacterId;
    });

    console.log(relevantItemJoins);

    relevantItemJoins.forEach(function (join) {
      var relevantItem = abc.items.filter(function (item) {
        console.log(item.itemId);
        console.log(join.itemId);
        item.itemId == join.itemId;
      })[0];

      console.log(relevantItem);

      htmlString += "<img src='items/" + relevantItem.imageFilename + "' class='player-item'> x " + join.count + "<br>";
    });

    return htmlString;
  },

  handlerRightDrawerContents: function handlerRightDrawerContents() {

    if (abc.userIsDM) {
      $(".add-item-button").click(function (e) {
        var button = $(e.currentTarget);
        var imageFilename = button.attr("item-image-filename");
        var ranTop = ebot.getRandomInt(2, 10) * 50;
        var ranLeft = ebot.getRandomInt(2, 10) * 50;
        abc.addTokenItem(imageFilename, ranTop, ranLeft);

        var emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft
        };

        abc.socket.emit('token added', emitObj);
      });
    } else if (abc.userIsPlayer) {
      $("#right-drawer-contents").html(abc.getRightDrawerHtmlPlayer());
    } else {}
  },

  changeBackground: function changeBackground(background) {
    if (background !== "blank") {
      $("#wrapper").css("background-image", "url(backgrounds/" + background + ")").css("background-repeat", "no-repeat");
    } else {
      $("#wrapper").css("background-image", "");
    }
  },

  changeHp: function changeHp(id, val) {
    $("#" + id).val(val);
  },

  viewAllPowers: function viewAllPowers() {
    var htmlString = "";

    abc.powers.forEach(function (power) {
      htmlString += "\n      <div class='power-view'>\n\n        <h4>" + power.name + "</h4>\n        Type: " + power.type + " <br>\n        Attack Type: " + power.attackType + " <br>\n        Damage: " + power.damage + " <br>\n        Effect: " + power.effect + " <br>\n        Description: " + power.description + " <br>\n        Flavor: " + power.flavorText + " <br>\n        Upgrade Effects: " + power.upgrade + " <br>\n\n      </div>";
    });

    return htmlString;
  },

  addTokenItem: function addTokenItem(imageFilename, ranTop, ranLeft) {
    var id = "dynamically-added-div-" + abc.currentDynamicDivId;
    var htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px;'><img src='items/" + imageFilename + "'></div>";
    $("#wrapper").append(htmlString);
    $("#" + id).draggable(abc.draggableOptionsToken);
    abc.currentDynamicDivId++;
  },

  makeDrawers: function makeDrawers() {
    var opacity = 0.9;
    ebot.drawerify({
      fromThe: "top",
      selector: "#top-drawer",
      contents: "#top-drawer-contents",
      opacity: opacity
    });

    ebot.drawerify({
      fromThe: "left",
      selector: "#left-drawer",
      contents: "#left-drawer-contents",
      opacity: opacity
    });

    ebot.drawerify({
      fromThe: "bottom",
      selector: "#bottom-drawer",
      contents: "#bottom-drawer-contents",
      opacity: opacity
    });

    ebot.drawerify({
      fromThe: "right",
      selector: "#right-drawer",
      contents: "#right-drawer-contents",
      opacity: opacity
    });
  },

  playSound: function playSound(sound) {
    var soundUnique = new Howl({
      urls: ["/sounds/" + sound + ".wav"]
    }).play();
  },

  draggableOptions: {
    drag: function drag(event, ui) {
      var emitObj = {
        id: ui.helper[0].id,
        x: $(ui.helper[0]).css("left"),
        y: $(ui.helper[0]).css("top")
      };

      abc.socket.emit('element dragged', emitObj);
    }
  },

  draggableOptionsToken: {
    drag: function drag(event, ui) {
      var emitObj = {
        id: ui.helper[0].id,
        x: $(ui.helper[0]).css("left"),
        y: $(ui.helper[0]).css("top")
      };

      abc.socket.emit('element dragged', emitObj);
    },
    grid: [50, 50]
  },

  resizableOptions: {
    resize: function resize(event, ui) {
      var emitObj = {
        id: ui.element[0].id,
        height: ui.size.height,
        width: ui.size.width
      };

      abc.socket.emit('element resized', emitObj);
    }
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

  dragDelay: 1,

  dragCounter: 0,

  socket: {},

  currentDynamicDivId: 1,

  // apiurl: "http://localhost:8082",
  apiurl: "http://192.241.203.33:8082",

  userIsPlayer: false,

  userIsDM: false,

  currentPlayerCharacterId: 0,

  items: [],

  powers: [],

  creatures: [],

  playerCharacters: [],

  nonPlayerCharacters: [],

  joinPlayerCharacterItems: []

};
//# sourceMappingURL=js.js.map
