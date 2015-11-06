'use strict';

$(function () {
  abc.initialize();
  // ebot.updateDocumentation(abc)
});

/**
 * initialize()
 * assignInitialHandlers()
 * handlerChat()
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

    abc.handlerTestSound();
  },

  assignInitialHandlers: function assignInitialHandlers() {
    abc.handlerChat();
    abc.handlerDrag();
    abc.handlerAddDiv();
    abc.handlersSocketEventReceived();
  },

  handlersSocketEventReceived: function handlersSocketEventReceived() {
    abc.socket.on('chat message', function (msg) {
      $('#messages').append($('<li>').text(msg));
    });

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

  handlerChat: function handlerChat() {
    $('form').submit(function () {
      abc.socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
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

  dragDelay: 1,

  dragCounter: 0,

  socket: {},

  currentDynamicDivId: 1

};
//# sourceMappingURL=js.js.map
