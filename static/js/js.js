"use strict";

$(function () {
  ebot.insertModalHtml("modal-lg");
  abc.initialize();
  // ebot.updateDocumentation(abc)
});

/**
 * initialize()
 * addPlayerCursorDivs()
 * handlerMouseMove()
 * updateCursorImage()
 * setCurrentPlayerCharacterId()
 * assignInitialHandlers()
 * handlersSocketEventReceived()
 * retrieveInitialModels()
 *
 * fillTopDrawer()
 * getTopDrawerHtml()
 * handlerTopDrawerContents()
 * 
 * fillBottomDrawer()
 * getBottomDrawerHtml()
 * handlerBottomDrawerContents()
 *
 * toggleCursorsVisibility()
 * 
 * fillLeftDrawer()
 * getLeftDrawerHtml()
 * handlerLeftDrawerContents()
 * 
 * fillRightDrawer()
 * getRightDrawerHtmlDM()
 * getRightDrawerHtmlPlayer()
 * handlerRightDrawerContents()
 * 
 * changeBackground()
 * changeHp()
 * viewAllPowers()
 * addTokenItem()
 * addTokenPlayerCharacter()
 * addTokenCreature()
 * makeDrawers()
 * playSound()
 * draggableOptions
 * draggableOptionsToken
 * resizableOptions
 * getItems()
 * 
 * dragDelay
 * dragCounter
 * socket
 * currentDynamicDivId
 * apiurl
 * userIsPlayer
 * userIsDM
 * currentPlayerCharacterId
 * items
 * powers
 * creatures
 * playerCharacters
 * nonPlayerCharacters
 * joinPlayerCharacterItems
 * joinPlayerCharacterPowers
 * characterDetails
 * cursorDelay
 * cursorsVisible
 */
var abc = {

  initialize: function initialize() {
    abc.socket = io();
    abc.assignInitialHandlers();

    //this is a try block because the data doesn't always parse right, if the page is refreshed
    //instead of newly navigated to.
    try {
      var user = JSON.parse($("#data-for-you").html());
      console.log(user);

      abc.setCurrentPlayerCharacterId(user);

      var DMs = ["a", "bliss"];
      var players = ["a", "b", "c", "bliss", "laurana", "andros", "skjor", "greg", "ares"];

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

      abc.addPlayerCursorDivs();

      abc.handlerMouseMove();
    } catch (e) {
      console.log("error parsing authentication data: " + e);
    }
  },

  addPlayerCursorDivs: function addPlayerCursorDivs() {
    //currently hardcoded in index.ejs
  },

  handlerMouseMove: function handlerMouseMove() {
    $('body').on('mousemove', function (e) {
      if (abc.cursorsVisible) {
        abc.socket.emit('cursor moved', { playerId: abc.currentPlayerCharacterId, x: e.pageX, y: e.pageY });
      }
    });
  },

  updateCursorImage: function updateCursorImage(emitObj) {
    console.log(emitObj);
    if (abc.cursorDelay === 10) {
      $("#cursor-" + emitObj.playerId).css("top", emitObj.y).css("left", emitObj.x);
      abc.cursorDelay = 0;
    } else {
      abc.cursorDelay++;
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
      case "greg":
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
      // abc.playSound("me-user-connected")
    });

    abc.socket.on('user disconnected', function () {
      // abc.playSound("me-user-disconnected")
    });

    abc.socket.on('item token added', function (emitObj) {
      abc.addTokenItem(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft);
    });

    abc.socket.on('player character token added', function (emitObj) {
      abc.addTokenPlayerCharacter(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft);
    });

    abc.socket.on('creature token added', function (emitObj) {
      abc.addTokenCreature(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft);
    });

    abc.socket.on('background changed', function (emitObj) {
      abc.changeBackground(emitObj.background);
    });

    abc.socket.on('hp changed', function (emitObj) {
      abc.changeHp(emitObj.id, emitObj.val);
    });

    abc.socket.on('cursor moved', function (emitObj) {
      abc.updateCursorImage(emitObj);
    });

    abc.socket.on('cursors toggle visibility', function (emitObj) {
      abc.toggleCursorsVisibility(emitObj.cursorsVisible);
      abc.cursorsVisible = emitObj.cursorsVisible;
    });

    abc.socket.on('reload top drawer', function () {
      abc.reloadTopDrawer();
    });

    abc.socket.on('core', function (obj) {
      //branching logic based on what is in the object

      if (obj.event === "create-turn-counter") {
        abc.createTurnCounter();
      }
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
    deferreds.push(ebot.retrieveEntity(abc, "joinPlayerCharacterPowers"));
    deferreds.push(ebot.retrieveEntity(abc, "characterDetails"));

    return deferreds;
  },

  fillTopDrawer: function fillTopDrawer() {
    if (abc.userIsDM) {
      $("#top-drawer-contents").html(abc.getTopDrawerHtmlDM());
      abc.handlerTopDrawerContents();
    } else if (abc.userIsPlayer) {
      $("#top-drawer-contents").html(abc.getTopDrawerHtml());
      abc.handlerTopDrawerContents();
    } else {
      $("#top-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getTopDrawerHtml: function getTopDrawerHtml() {
    var htmlString = "<table id='player-stats-table' class=\"table-condensed\">";

    htmlString += "<tr>\n      <th>Player Name</th>\n      <th>Character Name</th>\n      <th>Current HP</th>\n      <th>Max HP</th>\n      <th>AC</th>\n      <th>Will</th>\n      <th>Reflex</th>\n      <th>To Hit AC/Will/Reflex</th>\n      <th>Damage Mod</th>\n      <th>Speed</th>\n      <th>Initiative</th>\n      <th>Action Points</th>\n      <th>Gold</th>\n      <th>Str</th>\n      <th>Con</th>\n      <th>Int</th>\n      <th>Wis</th>\n      <th>Dex</th>\n      <th>Cha</th>\n    </tr>";

    abc.playerCharacters.forEach(function (player) {
      if (player.playerName !== "npc") {
        htmlString += "<tr>\n          <td>" + player.playerName + "</td>\n          <td>" + player.characterName + "</td>\n          <td><input id='current-hp-input-" + player.playerCharacterId + "' class='current-hp-input form-control' type='number' value='" + player.hp + "'></td>\n          <td>" + player.hp + "</td>\n          <td>" + player.ac + "</td>\n          <td>" + player.will + "</td>\n          <td>" + player.reflex + "</td>\n          <td style=\"text-align:center;\">" + player.baseToHitAc + "/" + player.baseToHitWill + "/" + player.baseToHitReflex + "</td>\n          <td>" + player.damageModifier + "</td>\n          <td>" + player.speed + "</td>\n          <td>" + player.initiative + "</td>\n          <td>" + player.actionPoints + "</td>\n          <td>" + player.gold + "</td>\n          <td>" + player.strength + "</td>\n          <td>" + player.constitution + "</td>\n          <td>" + player.intelligence + "</td>\n          <td>" + player.wisdom + "</td>\n          <td>" + player.dexterity + "</td>\n          <td>" + player.charisma + "</td>\n\n        </tr>";
      }
    });

    htmlString += "</table>";

    return htmlString;
  },

  getTopDrawerHtmlDM: function getTopDrawerHtmlDM() {
    var htmlString = "<table id='player-stats-table' class=\"table-condensed\">";

    htmlString += "<tr>\n      <th>Player Name</th>\n      <th>Character Name</th>\n      <th>Current HP</th>\n      <th>Max HP</th>\n      <th>AC</th>\n      <th>Will</th>\n      <th>Reflex</th>\n      <th>To Hit AC/Will/Reflex</th>\n      <th>Damage Mod</th>\n      <th>Speed</th>\n      <th>Initiative</th>\n      <th>Action Points</th>\n      <th>Gold</th>\n      <th>Str</th>\n      <th>Con</th>\n      <th>Int</th>\n      <th>Wis</th>\n      <th>Dex</th>\n      <th>Cha</th>\n    </tr>";

    abc.playerCharacters.forEach(function (player) {
      if (player.playerName !== "npc") {
        htmlString += "<tr player-character-id=" + player.playerCharacterId + ">\n          <td>" + player.playerName + "</td>\n          <td>" + player.characterName + "</td>\n          <td><input id='current-hp-input-" + player.playerCharacterId + "' class='current-hp-input form-control' type='number' value='" + player.hp + "'></td>\n          <td>" + player.hp + "</td>\n          <td>" + player.ac + "</td>\n          <td>" + player.will + "</td>\n          <td>" + player.reflex + "</td>\n          <td style=\"text-align:center;\">" + player.baseToHitAc + "/" + player.baseToHitWill + "/" + player.baseToHitReflex + "</td>\n          <td>" + player.damageModifier + "</td>\n          <td>" + player.speed + "</td>\n          <td>" + player.initiative + "</td>\n          <td>" + player.actionPoints + "</td>\n          <td>" + player.gold + "</td>\n          <td>" + player.strength + "</td>\n          <td>" + player.constitution + "</td>\n          <td>" + player.intelligence + "</td>\n          <td>" + player.wisdom + "</td>\n          <td>" + player.dexterity + "</td>\n          <td>" + player.charisma + "</td>\n\n        </tr>";
      }
    });

    htmlString += "</table>";

    return htmlString;
  },

  handlerTopDrawerContents: function handlerTopDrawerContents() {
    $(".current-hp-input").off("change");

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

    if (abc.userIsPlayer && !abc.userIsDM) {
      htmlString += "";
    }

    if (abc.userIsDM) {
      htmlString += "\n        <button id='toggle-cursor-visibility' class='btn btn-md btn-info'>toggle cursors</button>\n        <button id='reload-top-drawer' class='btn btn-md btn-info'>reload top drawer</button>\n        <button id='create-turn-counter' class='btn btn-md btn-info'>create-turn-counter</button>\n      ";
    }

    return htmlString;
  },

  handlerBottomDrawerContents: function handlerBottomDrawerContents() {
    $("#toggle-cursor-visibility").on("click", function (e) {
      abc.cursorsVisible = !abc.cursorsVisible;
      abc.socket.emit('cursors toggle visibility', { cursorsVisible: abc.cursorsVisible });
    });

    $("#reload-top-drawer").on("click", function (e) {
      abc.socket.emit('reload top drawer');
    });

    $("#create-turn-counter").on("click", function (e) {
      abc.socket.emit('core', { event: 'create-turn-counter' });
    });
  },

  reloadTopDrawer: function reloadTopDrawer() {
    ebot.retrieveEntity(abc, "playerCharacters").then(function () {
      abc.fillTopDrawer();
    });
  },

  toggleCursorsVisibility: function toggleCursorsVisibility(cursorsVisible) {
    if (!cursorsVisible) {
      $(".cursor").velocity({ opacity: 0 }, { duration: 1000 }).velocity({ display: "none" }, { duration: 0 });
    } else {
      $(".cursor").velocity({ display: "block" }, { duration: 0 }).velocity({ opacity: .95 }, { duration: 1000 });
    }
  },

  fillLeftDrawer: function fillLeftDrawer() {
    if (abc.userIsPlayer) {
      $("#left-drawer-contents").html(abc.getLeftDrawerHtml());
      abc.handlerLeftDrawerContents();
    } else {
      $("#left-drawer-contents").html("Unauthorized user detected!");
    }
  },

  getLeftDrawerHtml: function getLeftDrawerHtml() {
    var htmlString = "\n    <button id='toggle-lines' class='btn btn-md btn-info'>Toggle Lines</button> \n    <br><br>\n    <button id='show-all-powers' class='btn btn-md btn-info'>Show All Powers</button>\n    <br><br>\n    <button id='helpful-info' class='btn btn-md btn-info'>Helpful Info</button>\n    \n    ";

    if (abc.userIsPlayer && !abc.userIsDM) {
      htmlString += "\n      <br><br><button id='show-backstory' class='btn btn-md btn-info'>Show My Backstory</button>\n      <br><br><button id='show-my-powers' class='btn btn-md btn-info'>Show My Powers</button>\n      ";
    }

    if (abc.userIsDM) {
      htmlString += "<br><br>\n      <select id='background-select' data-placeholder='Choose a background...'>\n        <option value=''></option>\n        <option value='blank'>Blank</option>\n        <option value='zone-map.png'>Zone Map</option>\n        <option value='river.jpg'>River</option>\n        <option value='twooth-library.png'>Twooth Library</option>\n        <option value='slime-cave.png'>Slime Cave</option>\n        <option value='andora-tavern.jpg'>Andora Tavern</option>\n        <option value='andora-gates.png'>Andora Gates</option>\n        <option value='andora.jpg'>Andora</option>\n        <option value='brement.jpg'>Brement</option>\n        <option value='dark-forest-1.jpg'>Dark Forest</option>\n        <option value='desert-1.JPG'>Desert 1</option>\n        <option value='desert-statue.jpg'>Desert Statue</option>\n        <option value='dunkar.jpg'>Dunkar</option>\n        <option value='forest-path-1.jpg'>Forest Path 1</option>\n        <option value='forest-path-2.jpg'>Forest Path 2</option>\n        <option value='forest-1.JPG'>Forest 1</option>\n        <option value='plains-1.jpg'>Plains 1</option>\n        <option value='plains-2.jpg'>Plains 2</option>\n      </select>\n      ";
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

    $("#helpful-info").click(function (e) {
      ebot.showModal("Helpful Info", abc.viewHelpfulInfo());
    });

    $("#background-select").chosen(ebot.chosenOptions).change(function (e) {
      var element = $(e.currentTarget);
      abc.changeBackground(element.val());
      abc.socket.emit('background changed', { background: element.val() });
    });

    $("#show-backstory").click(function (e) {
      var detailText = abc.characterDetails.filter(function (detail) {
        return detail.playerCharacterId == abc.currentPlayerCharacterId;
      })[0].backstory;

      // detailText = `<pre>${detailText}</pre>`

      detailText = "<div style=\"white-space: pre-wrap;\">" + detailText + "</div>";

      ebot.showModal("Backstory", detailText);
    });

    $("#show-my-powers").click(function (e) {
      var htmlString = "";

      var relevantPowerJoins = abc.joinPlayerCharacterPowers.filter(function (join) {
        return join.playerCharacterId == abc.currentPlayerCharacterId;
      });

      relevantPowerJoins.forEach(function (join) {
        var relevantPower = abc.powers.filter(function (power) {
          return power.powerId == join.powerId;
        })[0];

        htmlString += "\n        <div class='power-view'>\n\n          <h4>" + relevantPower.name + "</h4>\n          Type: " + relevantPower.type + " <br>\n          Attack Type: " + relevantPower.attackType + " <br>\n          Damage: " + relevantPower.damage + " <br>\n          Effect: " + relevantPower.effect + " <br>\n          Description: " + relevantPower.description + " <br>\n          Flavor: " + relevantPower.flavorText + " <br>\n          Upgrade Effects: " + relevantPower.upgrade + " <br>\n\n        </div><br><br>";
      });

      ebot.showModal("My Powers", htmlString);
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
      htmlString += "<button class='add-item-button' item-id='" + item._id + "' item-image-filename='" + item.imageFilename + "'><img src='images/items/" + item.imageFilename + "'></button>";
    });

    htmlString += "<br><br><br>";

    abc.playerCharacters.forEach(function (pc) {
      htmlString += "<button class='add-player-character-button' player-character-id='" + pc._id + "' player-character-image-filename='" + pc.imageFilename + "'><img src='/images/player-characters/" + pc.imageFilename + "'></button>";
    });

    htmlString += "<br><br><br>";

    abc.creatures.forEach(function (creature) {
      htmlString += "<button class='add-creature-button' player-character-id='" + creature._id + "' creature-image-filename='" + creature.imageFilename + "'><img src='/images/creatures/" + creature.imageFilename + "'></button>";
    });

    return htmlString;
  },

  getRightDrawerHtmlPlayer: function getRightDrawerHtmlPlayer() {
    var htmlString = "";

    var relevantItemJoins = abc.joinPlayerCharacterItems.filter(function (join) {
      return join.playerCharacterId == abc.currentPlayerCharacterId;
    });

    relevantItemJoins.forEach(function (join) {
      var relevantItem = abc.items.filter(function (item) {
        return item.itemId == join.itemId;
      })[0];

      htmlString += "<img src='images/items/" + relevantItem.imageFilename + "' class='player-item'> x " + join.count + "<br>";
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

        abc.socket.emit('item token added', emitObj);
      });

      $(".add-player-character-button").click(function (e) {
        var button = $(e.currentTarget);
        var imageFilename = button.attr("player-character-image-filename");
        var ranTop = ebot.getRandomInt(2, 10) * 50;
        var ranLeft = ebot.getRandomInt(2, 10) * 50;
        abc.addTokenPlayerCharacter(imageFilename, ranTop, ranLeft);

        var emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft
        };

        abc.socket.emit('player character token added', emitObj);
      });

      $(".add-creature-button").click(function (e) {
        var button = $(e.currentTarget);
        var imageFilename = button.attr("creature-image-filename");
        var ranTop = ebot.getRandomInt(2, 10) * 50;
        var ranLeft = ebot.getRandomInt(2, 10) * 50;
        abc.addTokenCreature(imageFilename, ranTop, ranLeft);

        var emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft
        };

        abc.socket.emit('creature token added', emitObj);
      });
    } else if (abc.userIsPlayer) {
      $("#right-drawer-contents").html(abc.getRightDrawerHtmlPlayer());
    } else {}
  },

  changeBackground: function changeBackground(background) {
    if (background !== "blank") {

      $("#wrapper").velocity({ opacity: 0 }, { duration: 1000, complete: function complete() {
          $("#wrapper").css("background-image", "url(images/backgrounds/" + background + ")").css("background-repeat", "no-repeat");
        } }).velocity({ opacity: 1 }, { duration: 1000 });
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
      htmlString += "\n      <div class='power-view'>\n\n        <h4>" + power.name + "</h4>\n        Type: " + power.type + " <br>\n        Attack Type: " + power.attackType + " <br>\n        Damage: " + power.damage + " <br>\n        Effect: " + power.effect + " <br>\n        Description: " + power.description + " <br>\n        Flavor: " + power.flavorText + " <br>\n        Upgrade Effects: " + power.upgrade + " <br>\n\n      </div><br><br>";
    });

    return htmlString;
  },

  viewHelpfulInfo: function viewHelpfulInfo() {
    var htmlString = "";

    htmlString += "\n    <img src='images/miscellaneous/ability-modifiers.png'>\n    <br><br>\n    <img src='images/miscellaneous/skill-table.jpg'>\n    <br><br>\n\n    ";

    return htmlString;
  },

  addTokenItem: function addTokenItem(imageFilename, ranTop, ranLeft) {

    //I'm a bad person. Fix this
    var effects = ['poison.jpg', 'ice.jpg', 'fire.jpg', 'immobile.gif', 'prone.gif'];
    var id = "dynamically-added-div-" + abc.currentDynamicDivId;
    var htmlString = "";
    if (effects.indexOf(imageFilename) > -1) {
      htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px; opacity: 0.4;'><img src='images/items/" + imageFilename + "'></div>";
    } else {
      htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px;'><img src='images/items/" + imageFilename + "'></div>";
    }
    $("#wrapper").append(htmlString);
    $("#" + id).draggable(abc.draggableOptionsToken);
    abc.currentDynamicDivId++;
  },

  addTokenPlayerCharacter: function addTokenPlayerCharacter(imageFilename, ranTop, ranLeft) {
    var id = "dynamically-added-div-" + abc.currentDynamicDivId;
    var htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px;'><img src='images/player-characters/" + imageFilename + "'></div>";
    $("#wrapper").append(htmlString);
    $("#" + id).draggable(abc.draggableOptionsToken);
    abc.currentDynamicDivId++;
  },

  addTokenCreature: function addTokenCreature(imageFilename, ranTop, ranLeft) {
    var id = "dynamically-added-div-" + abc.currentDynamicDivId;
    var htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px;'><img src='images/creatures/" + imageFilename + "'></div>";
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

  createTurnCounter: function createTurnCounter() {
    // console.log('createTurnCounter() called')
    $('#wrapper').append(abc.createTurnCounterHtml());
    abc.handlerTurnCounter();
  },

  createTurnCounterHtml: function createTurnCounterHtml() {
    var htmlString = "";

    htmlString += "\n    <div id='turn-counter-container' class=''>\n\n      <label>Current Turn:</label>\n      <span id='tc-current-turn'>0</span>\n      <button id='tc-decrement-turn' class='btn btn-sm'><i class='glyphicon glyphicon-minus'></i></button>\n      <button id='tc-increment-turn' class='btn btn-sm'><i class='glyphicon glyphicon-plus'></i></button>\n      <button id='tc-add-row' class='btn btn-sm'>Add Row</button>\n      <br>\n\n      <table id='turn-counter-table' class='table-condensed'>\n        <tr id='tc-header-row'>\n          <th>Name</th>\n          <th>Initiative</th>\n          <th>Count</th>\n          <th></th>\n          <th></th>\n        </tr>\n        \n      </table>\n    </div>\n      \n    ";

    return htmlString;
  },

  handlerTurnCounter: function handlerTurnCounter() {

    $('#turn-counter-container').draggable().resizable();

    $('#tc-add-row').click(function (e) {
      $('#turn-counter-table').append(abc.createTurnCounterRowHtml());

      $('.tc-edit-row').off('click');
      $('.tc-remove-row').off('click');

      $('.tc-edit-row').on('click', function (e) {
        var element = $(e.currentTarget);
        var randId = element.attr('rand-id');
      });

      $('.tc-remove-row').on('click', function (e) {
        var element = $(e.currentTarget);
        var randId = element.attr('rand-id');
        $("tr[id=tc-" + randId + "]").remove();
      });
    });

    $("#tc-increment-turn").click(function (e) {
      var currentTurn = +$("#tc-current-turn").text();
      $("#tc-current-turn").text(++currentTurn);
    });

    $("#tc-decrement-turn").click(function (e) {
      var currentTurn = +$("#tc-current-turn").text();
      $("#tc-current-turn").text(--currentTurn);
    });
  },

  createTurnCounterRowHtml: function createTurnCounterRowHtml() {
    var htmlString = "";
    var rand = ebot.getRandomInt(100000, 999999);

    htmlString += "\n    <tr id='tc-" + rand + "'>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td><button class='btn btn-sm tc-edit-row' rand-id='" + rand + "'><i class='glyphicon glyphicon-edit'></i></button></td>\n      <td><button class='btn btn-sm tc-remove-row' rand-id='" + rand + "'><i class='glyphicon glyphicon-minus'></i></button></td>\n    </tr>";

    return htmlString;
  },

  /*
    Utilities
  */
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

  //not currently being used
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

  //not currently used
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

  toSocket: function toSocket(obj) {
    abc.socket.emit('core', obj);
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

  joinPlayerCharacterItems: [],

  joinPlayerCharacterPowers: [],

  characterDetails: [],

  cursorDelay: 0,

  cursorsVisible: true

};
//# sourceMappingURL=js.js.map
