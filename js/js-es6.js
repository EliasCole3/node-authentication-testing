$(() => {
  ebot.insertModalHtml("modal-lg")
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

      abc.setCurrentPlayerCharacterId(user)

      let DMs = ["a", "bliss"]
      let players = ["a", "b", "c", "bliss", "laurana", "andros", "skjor", "placeholder", "ares"]

      if(DMs.indexOf(user.local.username) > -1) {
        abc.userIsDM = true
      }

      if(players.indexOf(user.local.username) > -1) {
        abc.userIsPlayer = true
      }

      if(!abc.userIsDM && !abc.userIsPlayer) {
        alert("whoooo aaaarrrre yoooouuuu? 0.o")
      }

      $.when.apply($, abc.retrieveInitialModels()).done(() => {
        abc.fillTopDrawer()
        abc.fillRightDrawer()
        abc.fillLeftDrawer()
        abc.fillBottomDrawer()
      })
    } catch(e) {
      console.log(`error parsing authentication data: ${e}`)
    }

	  
  },

  setCurrentPlayerCharacterId: user => {

    switch(user.local.username) {
      case "laurana":
        abc.currentPlayerCharacterId = 1
        break
      case "andros":
        abc.currentPlayerCharacterId = 2
        break
      case "skjor":
        abc.currentPlayerCharacterId = 3
        break
      case "placeholder":
        abc.currentPlayerCharacterId = 4
        break
      case "ares":
        abc.currentPlayerCharacterId = 5
        break
      case "bliss":
        abc.currentPlayerCharacterId = 0
        break
      default:
        console.log(`setCurrentPlayerCharacterId() fell out of switch statement. Fix me plox. Current user:`)
        console.log(user)
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

    abc.socket.on('item token added', emitObj => {
      abc.addTokenItem(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })

    abc.socket.on('player character token added', emitObj => {
      abc.addTokenPlayerCharacter(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })

    abc.socket.on('creature token added', emitObj => {
      abc.addTokenCreature(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })

    abc.socket.on('background changed', emitObj => {
      abc.changeBackground(emitObj.background)
    })

    abc.socket.on('hp changed', emitObj => {
      abc.changeHp(emitObj.id, emitObj.val)
    })
  },

  retrieveInitialModels: () => {
    let deferreds = []

    deferreds.push(ebot.retrieveEntity(abc, "items"))
    deferreds.push(ebot.retrieveEntity(abc, "powers"))
    deferreds.push(ebot.retrieveEntity(abc, "creatures"))
    deferreds.push(ebot.retrieveEntity(abc, "playerCharacters"))
    deferreds.push(ebot.retrieveEntity(abc, "nonPlayerCharacters"))
    deferreds.push(ebot.retrieveEntity(abc, "joinPlayerCharacterItems"))
    deferreds.push(ebot.retrieveEntity(abc, "joinPlayerCharacterPowers"))
    deferreds.push(ebot.retrieveEntity(abc, "characterDetails"))

    return deferreds
  },



  fillTopDrawer: () => {
    if(abc.userIsPlayer) {
      $(`#top-drawer-contents`).html(abc.getTopDrawerHtml())
      abc.handlerTopDrawerContents()
    } else {
      $(`#top-drawer-contents`).html("Unauthorized user detected!")
    }
  },

  getTopDrawerHtml: () => {
    let htmlString = `<table id='player-stats-table' class="table-condensed">`

    htmlString += `<tr>
      <th>Player Name</th>
      <th>Character Name</th>
      <th>Current HP</th>
      <th>Max HP</th>
      <th>AC</th>
      <th>Will</th>
      <th>Reflex</th>
      <th>To hit AC</th>
      <th>To hit Will</th>
      <th>To hit Reflex</th>
      <th>Damage Modifier</th>
      <th>Speed</th>
      <th>Initiative</th>
      <th>Action Points</th>
      <th>Gold</th>
      <th>XP</th>
    </tr>`

    abc.playerCharacters.forEach(player => {
      htmlString += `<tr>
      <td>${player.playerName}</td>
      <td>${player.characterName}</td>
      <td><input id='current-hp-input-${player.playerCharacterId}' class='current-hp-input form-control' type='number' value='${player.hp}'></td>
      <td>${player.hp}</td>
      <td>${player.ac}</td>
      <td>${player.will}</td>
      <td>${player.reflex}</td>
      <td>${player.baseToHitAc}</td>
      <td>${player.baseToHitWill}</td>
      <td>${player.baseToHitReflex}</td>
      <td>${player.damageModifier}</td>
      <td>${player.speed}</td>
      <td>${player.initiative}</td>
      <td>${player.actionPoints}</td>
      <td>${player.gold}</td>
      <td>${player.xp}</td>

    </tr>`
    })

    htmlString += `</table>`

    return htmlString
  },

  handlerTopDrawerContents: () => {
    $(".current-hp-input").on("change", e => {
      let element = $(e.currentTarget)
      let id = element.attr("id")
      let val = element.val()
      abc.socket.emit('hp changed', {id: id, val: val})
    })
  },



  fillBottomDrawer: () => {
    if(abc.userIsPlayer) {
      $(`#bottom-drawer-contents`).html(abc.getBottomDrawerHtml())
      abc.handlerBottomDrawerContents()
    } else {
      $(`#bottom-drawer-contents`).html("Unauthorized user detected!")
    }
  },

  getBottomDrawerHtml: () => {
    let htmlString = ``

    return htmlString
  },

  handlerBottomDrawerContents: () => {
    

  
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
    <button id='toggle-lines' class='btn btn-md btn-info'>Toggle Lines</button> <br><br>
    <button id='show-all-powers' class='btn btn-md btn-info'>Show All Powers</button>
    `

    if(abc.userIsPlayer && !abc.userIsDM) {
      htmlString += `
      <br><br><button id='show-backstory' class='btn btn-md btn-info'>Show My Backstory</button>
      <br><br><button id='show-my-powers' class='btn btn-md btn-info'>Show My Powers</button>
      `
    }

    if(abc.userIsDM) {
      htmlString += `<br><br>
      <select id='background-select' data-placeholder='Choose a background...'>
        <option value=''></option>
        <option value='blank'>Blank</option>
        <option value='river.jpg'>River</option>
        <option value='twooth-library.png'>Twooth Library</option>
        <option value='slime-cave.png'>Slim Cave</option>
        <option value='andora-tavern.jpg'>Andora Tavern</option>
        <option value='andora-gates.png'>Andora Gates</option>
      </select>
      `
    }

    return htmlString
  },

  handlerLeftDrawerContents: () => {
    $("#toggle-lines").click(e => {
      if($("#lines").css("opacity") === "0.3") {
        $("#lines").velocity({opacity: "0"})
      } else {
        $("#lines").velocity({opacity: "0.3"})
      }
    })

    $("#show-all-powers").click(e => {
      ebot.showModal("All Powers", abc.viewAllPowers())
    })

    $("#background-select").chosen(ebot.chosenOptions).change(e => {
      let element = $(e.currentTarget)
      abc.changeBackground(element.val())
      abc.socket.emit('background changed', {background: element.val()})
    })

    $("#show-backstory").click(e => {
      let detailText = abc.characterDetails.filter(detail => {
        return detail.playerCharacterId == abc.currentPlayerCharacterId
      })[0].backstory
      
      // detailText = `<pre>${detailText}</pre>`

      detailText = `<div style="white-space: pre-wrap;">${detailText}</div>`

      ebot.showModal("Backstory", detailText)
    })

    $("#show-my-powers").click(e => {
      let htmlString = ``

      let relevantPowerJoins = abc.joinPlayerCharacterPowers.filter(join => {
        return join.playerCharacterId == abc.currentPlayerCharacterId
      })

      relevantPowerJoins.forEach(join => {
        let relevantPower = abc.powers.filter(power => {
          return power.powerId == join.powerId
        })[0]

        htmlString += `
        <div class='power-view'>

          <h4>${relevantPower.name}</h4>
          Type: ${relevantPower.type} <br>
          Attack Type: ${relevantPower.attackType} <br>
          Damage: ${relevantPower.damage} <br>
          Effect: ${relevantPower.effect} <br>
          Description: ${relevantPower.description} <br>
          Flavor: ${relevantPower.flavorText} <br>
          Upgrade Effects: ${relevantPower.upgrade} <br>

        </div><br><br>`
      })

      ebot.showModal("My Powers", htmlString)
    })
  },



  fillRightDrawer: () => {
    if(abc.userIsDM) {
      $(`#right-drawer-contents`).html(abc.getRightDrawerHtmlDM())
      abc.handlerRightDrawerContents()
    } else if(abc.userIsPlayer) {
      $(`#right-drawer-contents`).html(abc.getRightDrawerHtmlPlayer())
    } else {
      $(`#right-drawer-contents`).html("Unauthorized user detected!")
    }
  },

  getRightDrawerHtmlDM: () => {
    let htmlString = ``

    abc.items.forEach(item => {
      htmlString += `<button class='add-item-button' item-id='${item._id}' item-image-filename='${item.imageFilename}'><img src='items/${item.imageFilename}'></button>`
    })

    htmlString += `<br><br><br>`

    abc.playerCharacters.forEach(pc => {
      htmlString += `<button class='add-player-character-button' player-character-id='${pc._id}' player-character-image-filename='${pc.imageFilename}'><img src='player-characters/${pc.imageFilename}'></button>`
    })

    htmlString += `<br><br><br>`

    abc.creatures.forEach(creature => {
      htmlString += `<button class='add-creature-button' player-character-id='${creature._id}' creature-image-filename='${creature.imageFilename}'><img src='creatures/${creature.imageFilename}'></button>`
    })

    return htmlString
  },

  getRightDrawerHtmlPlayer: () => {
    let htmlString = ``
  
    let relevantItemJoins = abc.joinPlayerCharacterItems.filter(join => {
      return join.playerCharacterId == abc.currentPlayerCharacterId
    })

    relevantItemJoins.forEach(join => {
      let relevantItem = abc.items.filter(item => {
        return item.itemId == join.itemId
      })[0]

      htmlString += `<img src='items/${relevantItem.imageFilename}' class='player-item'> x ${join.count}<br>`
    })

    return htmlString
  },

  handlerRightDrawerContents: () => {

    if(abc.userIsDM) {
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

        abc.socket.emit('item token added', emitObj)
      })

      $(".add-player-character-button").click(e => {
        let button = $(e.currentTarget)
        let imageFilename = button.attr("player-character-image-filename")
        let ranTop = ebot.getRandomInt(2, 10) * 50
        let ranLeft = ebot.getRandomInt(2, 10) * 50
        abc.addTokenPlayerCharacter(imageFilename, ranTop, ranLeft)
      
        let emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft
        }

        abc.socket.emit('player character token added', emitObj)
      })

      $(".add-creature-button").click(e => {
        let button = $(e.currentTarget)
        let imageFilename = button.attr("creature-image-filename")
        let ranTop = ebot.getRandomInt(2, 10) * 50
        let ranLeft = ebot.getRandomInt(2, 10) * 50
        abc.addTokenCreature(imageFilename, ranTop, ranLeft)
      
        let emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft
        }

        abc.socket.emit('creature token added', emitObj)
      })

    } else if(abc.userIsPlayer) {
      $(`#right-drawer-contents`).html(abc.getRightDrawerHtmlPlayer())
    } else {
      
    }

    
  },




  changeBackground: background => {
    if(background !== "blank") {
      $("#wrapper").css("background-image", `url(backgrounds/${background})`).css("background-repeat", "no-repeat")  
    } else {
      $("#wrapper").css("background-image", ``)
    }
    
  },

  changeHp: (id, val) => {
    $(`#${id}`).val(val)
  },





  viewAllPowers: () => {
    let htmlString = ``

    abc.powers.forEach(power => {
      htmlString += `
      <div class='power-view'>

        <h4>${power.name}</h4>
        Type: ${power.type} <br>
        Attack Type: ${power.attackType} <br>
        Damage: ${power.damage} <br>
        Effect: ${power.effect} <br>
        Description: ${power.description} <br>
        Flavor: ${power.flavorText} <br>
        Upgrade Effects: ${power.upgrade} <br>

      </div><br><br>`
    })

    return htmlString
  },







  addTokenItem: (imageFilename, ranTop, ranLeft) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='items/${imageFilename}'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)
    abc.currentDynamicDivId++
  },

  addTokenPlayerCharacter: (imageFilename, ranTop, ranLeft) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='player-characters/${imageFilename}'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)
    abc.currentDynamicDivId++
  },

  addTokenCreature: (imageFilename, ranTop, ranLeft) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='creatures/${imageFilename}'></div>`
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

  currentPlayerCharacterId: 0,

  items: [],

  powers: [],

  creatures: [],

  playerCharacters: [],

  nonPlayerCharacters: [],

  joinPlayerCharacterItems: [],

  joinPlayerCharacterPowers: [],

  characterDetails: []

}

