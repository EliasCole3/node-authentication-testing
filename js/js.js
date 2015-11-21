"use strict";

$(function () {
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
      console.log("hello " + user.local.username);
      var DMs = ["a"];
      var players = ["b", "c"];

      if (DMs.indexOf(user.local.username) > -1) {
        abc.userIsDM = true;
      }

      if (players.indexOf(user.local.username) > -1) {
        abc.userIsPlayer = true;
      }

      if (!abc.userIsDM && !abc.userIsPlayer) {
        alert("why are you here? 0.o");
      }

      $.when.apply($, abc.retrieveInitialModels()).done(function () {
        abc.fillRightDrawer();
      });
    } catch (e) {
      console.log("error parsing authentication data: " + e);
    }
  },

  assignInitialHandlers: function assignInitialHandlers() {
    abc.handlerDrag();
    abc.handlerAddDiv();
    abc.handlersSocketEventReceived();
    abc.makeDrawers();
  },

  handlersSocketEventReceived: function handlersSocketEventReceived() {

    abc.socket.on('element dragged', function (emitObj) {
      $('#' + emitObj.id).css("top", emitObj.y);
      $('#' + emitObj.id).css("left", emitObj.x);
    });

    abc.socket.on('div added', function () {
      abc.createNewWireframeDiv();
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
  },

  retrieveInitialModels: function retrieveInitialModels() {
    var deferreds = [];

    deferreds.push(ebot.retrieveEntity(abc, "items"));

    return deferreds;
  },

  fillRightDrawer: function fillRightDrawer() {
    if (abc.userIsDM) {
      $("#right-drawer-contents").html(abc.getRightDrawerHtml());
      abc.handlerRightDrawerContents();
    } else {
      $("#right-drawer-contents").html("Players don't get to add items lolololol");
    }
  },

  getRightDrawerHtml: function getRightDrawerHtml() {
    var htmlString = "";

    abc.items.forEach(function (item) {
      htmlString += "<button class='add-item-button' item-id='" + item._id + "' item-image-filename='" + item.imageFilename + "'><img src='items/" + item.imageFilename + "'></button>";
    });

    return htmlString;
  },

  handlerRightDrawerContents: function handlerRightDrawerContents() {
    $(".add-item-button").click(function (e) {
      var button = $(e.currentTarget);
      var imageFilename = button.attr("item-image-filename");
      var ranTop = ebot.getRandomInt(2, 10) * 50;
      var ranLeft = ebot.getRandomInt(2, 10) * 5;
      var id = "dynamically-added-div-" + abc.currentDynamicDivId;
      var htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; width: 50px; height: 50px;'><img src='items/" + imageFilename + "'></div>";
      $("#wrapper").append(htmlString);
      $("#" + id).draggable(abc.draggableOptionsToken);
      abc.currentDynamicDivId++;
    });
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

  handlerDrag: function handlerDrag() {
    $("#draggable").draggable(abc.draggableOptions);
  },

  handlerAddDiv: function handlerAddDiv() {
    $("#add-div").click(function (e) {
      abc.createNewWireframeDiv();
      abc.socket.emit('div added');
    });
  },

  createNewWireframeDiv: function createNewWireframeDiv() {
    var ranTop = ebot.getRandomInt(100, 500);
    var ranLeft = ebot.getRandomInt(100, 500);
    var randomColor = "rgba(" + ebot.getRandomInt(0, 255) + ", " + ebot.getRandomInt(0, 255) + ", " + ebot.getRandomInt(0, 255) + ", 0.8)";
    var id = "dynamically-added-div-" + abc.currentDynamicDivId;
    var htmlString = "<div id='" + id + "' style='position:absolute; top:" + ranTop + "px; left:" + ranLeft + "px; background-color: " + randomColor + "; width: 100px; height: 100px;'></div>";
    $("#wrapper").append(htmlString);
    $("#" + id).resizable(abc.resizableOptions).draggable(abc.draggableOptions);
    abc.currentDynamicDivId++;
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

  items: []

};
//# sourceMappingURL=js.js.map
