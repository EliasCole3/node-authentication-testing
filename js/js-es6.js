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

    try {
      let user = JSON.parse($("#data-for-you").html())
      console.log(user)

      let DMs = ["a"]
      let players = ["a", "b", "c"]

      if(DMs.indexOf(user.local.username) > -1) {
        abc.userIsDM = true
      }

      if(players.indexOf(user.local.username) > -1) {
        abc.userIsPlayer = true
      }

      if(!abc.userIsDM && !abc.userIsPlayer) {
        alert("why are you here? 0.o")
      }

      $.when.apply($, abc.retrieveInitialModels()).done(() => {
        abc.fillRightDrawer()
        abc.fillLeftDrawer()
      })
    } catch(e) {
      console.log(`error parsing authentication data: ${e}`)
    }

	  
  },

  assignInitialHandlers: () => {
    abc.handlersSocketEventReceived()
    abc.makeDrawers()
    

  },

  handlersSocketEventReceived: () => {

    abc.socket.on('element dragged', emitObj => {
      $('#' + emitObj.id).css("top", emitObj.y)
      $('#' + emitObj.id).css("left", emitObj.x)
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

    abc.socket.on('token added', emitObj => {
      abc.addTokenItem(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })
  },

  retrieveInitialModels: () => {
    let deferreds = []

    deferreds.push(ebot.retrieveEntity(abc, "items"))

    return deferreds
  },

  fillLeftDrawer: () => {
    if(abc.userIsPlayer) {
      $(`#left-drawer-contents`).html(abc.getLeftDrawerHtml())
      abc.handlerLeftDrawerContents()
    } else {
      $(`#left-drawer-contents`).html("Unauthorized user detected!")
    }
  },

  getLeftDrawerHtml: () => {
    let htmlString = `
    <button id='toggle-lines' class='btn btn-md'>Toggle Lines</button>
    `

    return htmlString
  },

  handlerLeftDrawerContents: () => {
    $("#toggle-lines").click(e => {
      $("#lines").velocity({opacity: "0"})
    })
  },

  fillRightDrawer: () => {
    if(abc.userIsDM) {
      $(`#right-drawer-contents`).html(abc.getRightDrawerHtml())
      abc.handlerRightDrawerContents()
    } else {
      $(`#right-drawer-contents`).html("Players don't get to add items lolololol")
    }
  },

  getRightDrawerHtml: () => {
    let htmlString = ``

    abc.items.forEach(item => {
      htmlString += `<button class='add-item-button' item-id='${item._id}' item-image-filename='${item.imageFilename}'><img src='items/${item.imageFilename}'></button>`
    })

    return htmlString
  },

  handlerRightDrawerContents: () => {
    $(".add-item-button").click(e => {
      let button = $(e.currentTarget)
      let imageFilename = button.attr("item-image-filename")
      let ranTop = ebot.getRandomInt(2, 10) * 50
      let ranLeft = ebot.getRandomInt(2, 10) * 50
      abc.addTokenItem(imageFilename, ranTop, ranLeft)

      let emitObj = {
        imageFilename: imageFilename,
        ranTop: ranTop,
        ranLeft: ranLeft
      }

      abc.socket.emit('token added', emitObj)
    })
  },

  addTokenItem: (imageFilename, ranTop, ranLeft) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='items/${imageFilename}'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)
    abc.currentDynamicDivId++
  },

  makeDrawers: () => {
    let opacity = 0.9
    ebot.drawerify({
      fromThe: "top",
      selector: "#top-drawer",
      contents: "#top-drawer-contents",
      opacity: opacity
    })

    ebot.drawerify({
      fromThe: "left",
      selector: "#left-drawer",
      contents: "#left-drawer-contents",
      opacity: opacity
    })

    ebot.drawerify({
      fromThe: "bottom",
      selector: "#bottom-drawer",
      contents: "#bottom-drawer-contents",
      opacity: opacity
    })

    ebot.drawerify({
      fromThe: "right",
      selector: "#right-drawer",
      contents: "#right-drawer-contents",
      opacity: opacity
    })
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

  draggableOptionsToken: {
    drag: (event, ui) => {
      let emitObj = {
        id: ui.helper[0].id,
        x: $(ui.helper[0]).css("left"),
        y: $(ui.helper[0]).css("top")
      }

      abc.socket.emit('element dragged', emitObj)
    },
    grid:[50, 50]
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

  getItems: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/items`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getItems() Error")}
    }).promise()

    return deferred
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

}

