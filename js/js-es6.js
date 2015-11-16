$(() => {
  abc.initialize()
  // ebot.updateDocumentation(abc)
})



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
let abc = {
  
  initialize: () => {
    abc.socket = io()
    abc.assignInitialHandlers()

    abc.handlerTestSound()
    
    try {
      let user = JSON.parse($("#data-for-you").html())
      console.log(user)
      alert(`hello ${user.local.username}`)
    } catch(e) {
      console.log(`error parsing authentication data: ${e}`)
    }

    ebot.drawerify({
      fromThe: "top",
      selector: "#top-drawer",
      contents: "#top-drawer-contents"
    })

    ebot.drawerify({
      fromThe: "left",
      selector: "#left-drawer",
      contents: "#left-drawer-contents"
    })
	  
  },

  assignInitialHandlers: () => {
    abc.handlerDrag()
    abc.handlerAddDiv()
    abc.handlersSocketEventReceived()

  },

  handlersSocketEventReceived: () => {

    abc.socket.on('element dragged', emitObj => {
      $('#' + emitObj.id).css("top", emitObj.y)
      $('#' + emitObj.id).css("left", emitObj.x)
    })

    abc.socket.on('div added', () => {
      abc.createNewWireframeDiv()
    })

    abc.socket.on('element resized', emitObj => {
      $(`#${emitObj.id}`).css("width", emitObj.width).css("height", emitObj.height)
    })

    abc.socket.on('user connected', () => {
      abc.playSound("me-user-connected")
    })

    abc.socket.on('user disconnected', () => {
      abc.playSound("me-user-disconnected")
    })
  },

  handlerDrag: () => {
    $("#draggable").draggable(abc.draggableOptions)
  },

  handlerAddDiv: () => {
    $("#add-div").click(e => {
      abc.createNewWireframeDiv()
      abc.socket.emit('div added')
    })
  },

  createNewWireframeDiv: () => {
    let ranTop = ebot.getRandomInt(100, 500)
    let ranLeft = ebot.getRandomInt(100, 500)
    let randomColor = `rgba(${ebot.getRandomInt(0, 255)}, ${ebot.getRandomInt(0, 255)}, ${ebot.getRandomInt(0, 255)}, 0.8)`
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; background-color: ${randomColor}; width: 100px; height: 100px;'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).resizable(abc.resizableOptions).draggable(abc.draggableOptions)
    abc.currentDynamicDivId++
  },

  handlerTestSound: () => {
    $("#test").click(e => {
      abc.playSoundDing()
    })
  },

  playSoundDing: () => {
    let sound = new Howl({
      urls: ['/sounds/me-ding.wav']
    }).play()
  },

  playSound: sound => {
    let soundUnique = new Howl({
      urls: [`/sounds/${sound}.wav`]
    }).play()
  },

  draggableOptions: {
    drag: (event, ui) => {
      let emitObj = {
        id: ui.helper[0].id,
        x: $(ui.helper[0]).css("left"),
        y: $(ui.helper[0]).css("top")
      }

      abc.socket.emit('element dragged', emitObj)
    }
  },

  resizableOptions: {
    resize: (event, ui) => {
      let emitObj = {
        id: ui.element[0].id,
        height: ui.size.height,
        width: ui.size.width
      }

      abc.socket.emit('element resized', emitObj)
    }
  },

  dragDelay: 1,
  
  dragCounter: 0,

  socket: {},

  currentDynamicDivId: 1

}

