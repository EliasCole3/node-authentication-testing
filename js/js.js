'use strict';

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

    $.when.apply($, abc.retrieveInitialModels()).done(function () {
      // abc.fillAttendanceAreas()
      // alert('all loaded!')
      abc.fillRightDrawer();
    });

    abc.handlerTestSound();

    try {
      var user = JSON.parse($("#data-for-you").html());
      console.log(user);
      alert('hello ' + user.local.username);
    } catch (e) {
      console.log('error parsing authentication data: ' + e);
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
      $('#' + emitObj.id).css("width", emitObj.width).css("height", emitObj.height);
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
    $('#right-drawer-contents').html(abc.getRightDrawerHtml());
    $(".add-item-button").click(function (e) {
      var button = $(e.currentTarget);
      var imageFilename = button.attr(item - image - filename);
      var ranTop = ebot.getRandomInt(100, 500);
      var ranLeft = ebot.getRandomInt(100, 500);
      var id = 'dynamically-added-div-' + abc.currentDynamicDivId;
      var htmlString = '<div id=\'' + id + '\' style=\'position:absolute; top:' + ranTop + 'px; left:' + ranLeft + 'px; width: 50px; height: 50px;\'><img src=\'items/' + imageFilename + '\'></div>';
      $("#wrapper").append(htmlString);
      $('#' + id).draggable(abc.draggableOptionsToken);
      abc.currentDynamicDivId++;
    });
  },

  getRightDrawerHtml: function getRightDrawerHtml() {
    var htmlString = '';

    abc.items.forEach(function (item) {
      // htmlString += `<img src='items/${item.imageFilename}'>`
      htmlString += '<button class=\'add-item-button\' item-id=\'' + item._id + '\' item-image-filename=\'' + item.imageFilename + '\'><img src=\'items/' + item.imageFilename + '\'></button>';
    });
    // htmlString += `<img src='loading.gif'>`
    // htmlString += `<img src='items/${item.imageFilename}'>`

    return htmlString;
  },

  handlerRightDrawerContents: function handlerRightDrawerContents() {},

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
    var randomColor = 'rgba(' + ebot.getRandomInt(0, 255) + ', ' + ebot.getRandomInt(0, 255) + ', ' + ebot.getRandomInt(0, 255) + ', 0.8)';
    var id = 'dynamically-added-div-' + abc.currentDynamicDivId;
    var htmlString = '<div id=\'' + id + '\' style=\'position:absolute; top:' + ranTop + 'px; left:' + ranLeft + 'px; background-color: ' + randomColor + '; width: 100px; height: 100px;\'></div>';
    $("#wrapper").append(htmlString);
    $('#' + id).resizable(abc.resizableOptions).draggable(abc.draggableOptions);
    abc.currentDynamicDivId++;
  },

  handlerTestSound: function handlerTestSound() {
    $("#test").click(function (e) {
      abc.playSoundDing();
    });
  },

  playSoundDing: function playSoundDing() {
    var sound = new Howl({
      urls: ['/sounds/me-ding.wav']
    }).play();
  },

  playSound: function playSound(sound) {
    var soundUnique = new Howl({
      urls: ['/sounds/' + sound + '.wav']
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
      url: abc.apiurl + '/items',
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

  items: []

};
//# sourceMappingURL=js.js.map
