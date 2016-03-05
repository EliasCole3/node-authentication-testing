$(() => {
  ebot.insertModalHtml("modal-lg")
  abc.initialize()
  // ebot.updateDocumentation(abc)
})



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
let abc = {
  
  initialize: () => {
    abc.socket = io()
    abc.assignInitialHandlers()

    //this is a try block because the data doesn't always parse right, if the page is refreshed
    //instead of newly navigated to.
    try {
      let user = JSON.parse($("#data-for-you").html())
      console.log(user)

      abc.setCurrentPlayerCharacterId(user)

      let DMs = ["a", "bliss"]
      let players = ["a", "b", "c", "bliss", "laurana", "andros", "skjor", "greg", "ares", "wild"]

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

      abc.addPlayerCursorDivs()

      abc.handlerMouseMove()

    } catch(e) {
      console.log(`error parsing authentication data: ${e}`)
    }

	  
  },


  addPlayerCursorDivs: () => {
    //currently hardcoded in index.ejs
  },

  handlerMouseMove: () => {
    $('body').on('mousemove', e => {
      if(abc.cursorsVisible) {
        abc.socket.emit('cursor moved', {playerId: abc.currentPlayerCharacterId, x: e.pageX, y: e.pageY})
      }
    })
  },

  updateCursorImage: emitObj => {
    console.log(emitObj)
    if(abc.cursorDelay === 10) {
      $(`#cursor-${emitObj.playerId}`).css(`top`, emitObj.y).css(`left`, emitObj.x)
      abc.cursorDelay = 0
    } else {
      abc.cursorDelay++
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
      case "greg":
        abc.currentPlayerCharacterId = 4
        break
      case "ares":
        abc.currentPlayerCharacterId = 5
        break
      case "wild":
        abc.currentPlayerCharacterId = 8
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
      // abc.playSound("me-user-connected")
    })

    abc.socket.on('user disconnected', () => {
      // abc.playSound("me-user-disconnected")
    })

    abc.socket.on('item token added', emitObj => {
      abc.addTokenItem(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })

    abc.socket.on('player character token added', emitObj => {
      abc.addTokenPlayerCharacter(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft)
    })

    abc.socket.on('creature token added', emitObj => {
      abc.addTokenCreature(emitObj.imageFilename, emitObj.ranTop, emitObj.ranLeft, emitObj.id)
    })

    abc.socket.on('background changed', emitObj => {
      abc.changeBackground(emitObj.background)
    })

    abc.socket.on('hp changed', emitObj => {
      abc.changeHp(emitObj.id, emitObj.val)
    })

    abc.socket.on('cursor moved', emitObj => {
      abc.updateCursorImage(emitObj)
    })

    abc.socket.on('cursors toggle visibility', emitObj => {
      abc.toggleCursorsVisibility(emitObj.cursorsVisible)
      abc.cursorsVisible = emitObj.cursorsVisible
    })

    abc.socket.on('reload top drawer', () => {
      abc.reloadTopDrawer()
    })

    abc.socket.on('core', obj => {
      //branching logic based on what is in the object

      // console.log(obj)

      if(obj.event === "create-turn-counter") {
        abc.createTurnCounter()
      }

      if(obj.event === "increment-turn") {
        let currentTurn = +$("#tc-current-turn").text()
        $("#tc-current-turn").text(++currentTurn)
      }

      if(obj.event === "decrement-turn") {
        let currentTurn = +$("#tc-current-turn").text()
        $("#tc-current-turn").text(--currentTurn)
      }

      if(obj.event === "add-row-to-turn-counter") {
        abc.addRowToTurnCounter(obj.randId)
      }

      if(obj.event === "remove-turn-counter-row") {
        $(`tr[id=tc-${obj.randId}]`).remove()
      }

      if(obj.event === "update-turn-counter-row-values") {
        $(`.td-name[id=tc-name-${obj.randId}]`).html(obj.updatedName)
        $(`.td-initiative[id=tc-initiative-${obj.randId}]`).html(obj.updatedInitiative)
        $(`.td-count[id=tc-count-${obj.randId}]`).html(obj.updatedCount)
      }

      if(obj.event === "creature-table-remove-row") {
        abc.removeToken(obj.tokenId)
      }

      if(obj.event === "add-custom-token") {
        abc.addCustomToken(obj.imageFilename, obj.ranTop, obj.ranLeft, obj.height, obj.width, obj.opacity) 
      }

    



    })
  },

  removeToken: tokenId => {
    $(`#dynamically-added-div-${tokenId}`).remove()
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
    if(abc.userIsDM) {
      $(`#top-drawer-contents`).html(abc.getTopDrawerHtmlDM())
      abc.handlerTopDrawerContents()
    } else if(abc.userIsPlayer) {
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
      <th>To Hit AC/Will/Reflex</th>
      <th>Damage Mod</th>
      <th>Speed</th>
      <th>Initiative</th>
      <th>Action Points</th>
      <th>Gold</th>
      <th>Str</th>
      <th>Con</th>
      <th>Int</th>
      <th>Wis</th>
      <th>Dex</th>
      <th>Cha</th>
    </tr>`

    abc.playerCharacters.forEach(player => {
      if(abc.doNotInclude.indexOf(player.playerName) === -1) {
          htmlString += `<tr>
          <td>${player.playerName}</td>
          <td>${player.characterName}</td>
          <td><input id='current-hp-input-${player.playerCharacterId}' class='current-hp-input form-control' type='number' value='${player.hp}'></td>
          <td>${player.hp}</td>
          <td>${player.ac}</td>
          <td>${player.will}</td>
          <td>${player.reflex}</td>
          <td style="text-align:center;">${player.baseToHitAc}/${player.baseToHitWill}/${player.baseToHitReflex}</td>
          <td>${player.damageModifier}</td>
          <td>${player.speed}</td>
          <td>${player.initiative}</td>
          <td>${player.actionPoints}</td>
          <td>${player.gold}</td>
          <td>${player.strength}</td>
          <td>${player.constitution}</td>
          <td>${player.intelligence}</td>
          <td>${player.wisdom}</td>
          <td>${player.dexterity}</td>
          <td>${player.charisma}</td>

        </tr>`
      }
      
    })

    htmlString += `</table>`

    return htmlString
  },

  getTopDrawerHtmlDM: () => {
    let htmlString = `<table id='player-stats-table' class="table-condensed">`

    htmlString += `<tr>
      <th>Player Name</th>
      <th>Character Name</th>
      <th>Current HP</th>
      <th>Max HP</th>
      <th>AC</th>
      <th>Will</th>
      <th>Reflex</th>
      <th>To Hit AC/Will/Reflex</th>
      <th>Damage Mod</th>
      <th>Speed</th>
      <th>Initiative</th>
      <th>Action Points</th>
      <th>Gold</th>
      <th>Str</th>
      <th>Con</th>
      <th>Int</th>
      <th>Wis</th>
      <th>Dex</th>
      <th>Cha</th>
    </tr>`

    abc.playerCharacters.forEach(player => {
      

      if(abc.doNotInclude.indexOf(player.playerName) === -1) {
          htmlString += `<tr player-character-id=${player.playerCharacterId}>
          <td>${player.playerName}</td>
          <td>${player.characterName}</td>
          <td><input id='current-hp-input-${player.playerCharacterId}' class='current-hp-input form-control' type='number' value='${player.hp}'></td>
          <td>${player.hp}</td>
          <td>${player.ac}</td>
          <td>${player.will}</td>
          <td>${player.reflex}</td>
          <td style="text-align:center;">${player.baseToHitAc}/${player.baseToHitWill}/${player.baseToHitReflex}</td>
          <td>${player.damageModifier}</td>
          <td>${player.speed}</td>
          <td>${player.initiative}</td>
          <td>${player.actionPoints}</td>
          <td>${player.gold}</td>
          <td>${player.strength}</td>
          <td>${player.constitution}</td>
          <td>${player.intelligence}</td>
          <td>${player.wisdom}</td>
          <td>${player.dexterity}</td>
          <td>${player.charisma}</td>

        </tr>`
      }
      
    })

    htmlString += `</table>`

    return htmlString
  },

  handlerTopDrawerContents: () => {
    $(".current-hp-input").off("change")

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

    if(abc.userIsPlayer && !abc.userIsDM) {
      htmlString += ``
    }

    if(abc.userIsDM) {
      htmlString += `
        <button id='toggle-cursor-visibility' class='btn btn-md btn-info'>toggle cursors</button>
        <button id='reload-top-drawer' class='btn btn-md btn-info'>reload top drawer</button>
        <button id='create-turn-counter' class='btn btn-md btn-info'>Create Turn Counter</button>
        <button id='create-creature-table' class='btn btn-md btn-info'>Create Creature Table</button>
      `
    }

    return htmlString
  },

  handlerBottomDrawerContents: () => {
    $("#toggle-cursor-visibility").on("click", e => {
      abc.cursorsVisible = !abc.cursorsVisible
      abc.socket.emit('cursors toggle visibility', {cursorsVisible: abc.cursorsVisible})
    })

    $("#reload-top-drawer").on("click", e => {
      abc.socket.emit('reload top drawer')
    })

    $("#create-turn-counter").on("click", e => {
      abc.socket.emit('core', {event: 'create-turn-counter'})
    })

    $("#create-creature-table").on("click", e => {
      abc.createCreatureTable()
    })
  
  },

  reloadTopDrawer: () => {
    ebot.retrieveEntity(abc, "playerCharacters").then(() => {
      abc.fillTopDrawer()
    })
  },

  toggleCursorsVisibility: cursorsVisible => {
    if(!cursorsVisible) {
      $(".cursor")
        .velocity({opacity: 0}, {duration: 1000})
        .velocity({display: "none"}, {duration: 0})
    } else {
    $(".cursor")
      .velocity({display: "block"}, {duration: 0})
      .velocity({opacity: .95}, {duration: 1000})
    }
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
    <button id='toggle-lines' class='btn btn-md btn-info'>Toggle Lines</button> 
    <br><br>
    <button id='show-all-powers' class='btn btn-md btn-info'>Show All Powers</button>
    <br><br>
    <button id='show-all-powers-improved' class='btn btn-md btn-info'>Show All Powers+</button>
    <br><br>
    <button id='helpful-info' class='btn btn-md btn-info'>Helpful Info</button>
    
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
        <option value='zone-map.png'>Zone Map</option>
        <option value='river.jpg'>River</option>
        <option value='twooth-library.png'>Twooth Library</option>
        <option value='slime-cave.png'>Slime Cave</option>
        <option value='andora-tavern.jpg'>Andora Tavern</option>
        <option value='andora-gates.png'>Andora Gates</option>
        <option value='andora.jpg'>Andora</option>
        <option value='brement.jpg'>Brement</option>
        <option value='dark-forest-1.jpg'>Dark Forest</option>
        <option value='desert-1.JPG'>Desert 1</option>
        <option value='desert-statue.jpg'>Desert Statue</option>
        <option value='dunkar.jpg'>Dunkar</option>
        <option value='forest-path-1.jpg'>Forest Path 1</option>
        <option value='forest-path-2.jpg'>Forest Path 2</option>
        <option value='forest-1.JPG'>Forest 1</option>
        <option value='plains-1.jpg'>Plains 1</option>
        <option value='plains-2.jpg'>Plains 2</option>
        <option value='spider-den.jpg'>Spider Den</option>
        <option value='twooth.jpg'>Twooth</option>
        <option value='ameretis-flashback-1.jpg'>Flashback 1</option>
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

    $("#show-all-powers-improved").click(e => {
      ebot.showModal("All Powers+", abc.viewAllPowersImproved())
      abc.handlerAllPowersImproved()
    })

    $("#helpful-info").click(e => {
      ebot.showModal("Helpful Info", abc.viewHelpfulInfo())
    })

    $("#background-select").chosen(ebot.chosenOptions).change(e => {
      let element = $(e.currentTarget)
      abc.changeBackground(element.val())
      abc.socket.emit('background changed', {background: element.val()})
    })

    $('#background_select_chosen').css('width', '100%')

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
      htmlString += `<button class='add-item-button' item-id='${item._id}' item-image-filename='${item.imageFilename}'><img src='images/items/${item.imageFilename}'></button>`
    })

    htmlString += `<br><br><br>`

    abc.playerCharacters.forEach(pc => {
      htmlString += `<button class='add-player-character-button' player-character-id='${pc._id}' player-character-image-filename='${pc.imageFilename}'><img src='/images/player-characters/${pc.imageFilename}'></button>`
    })

    htmlString += `<br><br><br>`

    abc.creatures.forEach(creature => {
      htmlString += `<button class='add-creature-button' creature-id='${creature._id}' creature-image-filename='${creature.imageFilename}'><img src='/images/creatures/${creature.imageFilename}'></button>`
    })

    htmlString += `<br><br><br>`

    // add-custom-token
    htmlString += `
      <button class='add-custom-token' image-filename='test.png' token-height='100' token-width='100' opacity='.3'><img height='50' width='50' src='/images/custom/test.png'></button> <br>
      blizzard: <button class='add-custom-token' image-filename='blizzard.png' token-height='150' token-width='150' opacity='.5'><img height='50' width='50' src='/images/custom/blizzard.png'></button> <br>
      caution: <button class='add-custom-token' image-filename='caution.png' token-height='100' token-width='100' opacity='.5'><img height='50' width='50' src='/images/custom/caution.png'></button> <br>
      sorrow: <button class='add-custom-token' image-filename='sorrow.png' token-height='150' token-width='150' opacity='.5'><img height='50' width='50' src='/images/custom/sorrow.png'></button> <br>
      heals: <button class='add-custom-token' image-filename='green3.png' token-height='150' token-width='150' opacity='.5'><img height='50' width='50' src='/images/custom/green3.png'></button>
    `

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

      htmlString += `<img src='images/items/${relevantItem.imageFilename}' class='player-item'> x ${join.count}<br>`
    })

    let currentPlayerCharacter = abc.playerCharacters.filter(pc => {
      return pc.playerCharacterId == abc.currentPlayerCharacterId
    })[0]

    let items = currentPlayerCharacter.items.split(', ')
    items.forEach(item => {
      htmlString += `<br>${item}`
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
        let id = button.attr("creature-id")
        let ranTop = ebot.getRandomInt(2, 10) * 50
        let ranLeft = ebot.getRandomInt(2, 10) * 50
        abc.addTokenCreature(imageFilename, ranTop, ranLeft, id)
      
        let emitObj = {
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft,
          id: id
        }

        abc.socket.emit('creature token added', emitObj)
      })

      $(".add-custom-token").click(e => {
        let button = $(e.currentTarget)
        let imageFilename = button.attr("image-filename")
        let ranTop = ebot.getRandomInt(2, 10) * 50
        let ranLeft = ebot.getRandomInt(2, 10) * 50
        let height = button.attr("token-height")
        let width = button.attr("token-width")
        let opacity = button.attr("opacity")
        // abc.addCustomToken(imageFilename, ranTop, ranLeft, height, width)
      
        let emitObj = {
          event: 'add-custom-token',
          imageFilename: imageFilename,
          ranTop: ranTop,
          ranLeft: ranLeft,
          height: height,
          width: width,
          opacity: opacity
        }

        abc.toSocket(emitObj)
      })

    } else if(abc.userIsPlayer) {
      $(`#right-drawer-contents`).html(abc.getRightDrawerHtmlPlayer())
    } else {
      
    }

    
  },




  changeBackground: background => {
    if(background !== "blank") {
  
      $("#wrapper")
      .velocity({opacity: 0}, {duration: 1000, complete: () => {
        $("#wrapper").css("background-image", `url(images/backgrounds/${background})`).css("background-repeat", "no-repeat") 
      }})
      .velocity({opacity: 1}, {duration: 1000})

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
      <div>

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



  viewAllPowersImproved: () => {
    let htmlString = ``

    htmlString += `<br><br>`

    htmlString += `
      <label class="radio-inline">
        <input type="radio" name="power-filter-radio" id="name" value="name"> Title
      </label> 
      <label class="radio-inline">
        <input type="radio" name="power-filter-radio" id="type" value="type"> Type
      </label>
      <label class="radio-inline">
        <input type="radio" name="power-filter-radio" id="attack-type" value="attackType"> Attack Type
      </label>

      <br>

      <input id='filter-text'>
      <button id='filter' class='btn btn-sm'>Filter</button>

      <br>

      <select id='character-filter' class='form-control'>
        <option value=''>All</option>
        <option value='1'>Laurana Lightbrand</option>
        <option value='2'>Andros Vexstine</option>
        <option value='3'>Skjor the Scarred</option>
        <option value='4'>Greg Symbol</option>
        <option value='5'>Ares Icharyd</option>
        <option value='8'>WildKat</option>
        <option value='9'>Scree Lo Tal</option>
      </select>

      <label>Current Powers Shown:
        <div id='count-powers'>${abc.powers.length}</div>
      </label>

      <br><br>

      <div id='powers'>
    `






    let uniqueTypes = ebot.getUniqueFields(abc.powers, 'type')

    abc.powers.forEach(power => {
      htmlString += `
      <div class='power-view'>

        <b>${power.name}</b> <br>
        Type: ${power.type} <br>
        Attack Type: ${power.attackType} <br>
        Damage: ${power.damage} <br>
        Effect: ${power.effect} <br>
        Description: ${power.description} <br>
        Flavor: ${power.flavorText} <br>
        Upgrade Effects: ${power.upgrade} <br>

      </div>`
    })

    htmlString += `</div>`

    return htmlString
  },

  handlerAllPowersImproved: () => {
    $("#filter").click(e => {
      let htmlString = ``
      let filterText = $("#filter-text").val()
      let countPowers = 0

      let propOnWhichToFilter = $('input:radio[name=power-filter-radio]:checked').val()
      console.log(propOnWhichToFilter)
      
      if(filterText === '' || filterText === null) {
        htmlString += abc.viewAllPowersJustPowers()
        countPowers = abc.powers.length
      } else {
        abc.powers.forEach(power => {
          // if(power.type.indexOf(filterText) > -1) {
            console.log(power)
            console.log(power[propOnWhichToFilter])
          if(power[propOnWhichToFilter].indexOf(filterText) > -1) {
            countPowers++
            htmlString += `
            <div class='power-view'>

              <b>${power.name}</b> <br>
              Type: ${power.type} <br>
              Attack Type: ${power.attackType} <br>
              Damage: ${power.damage} <br>
              Effect: ${power.effect} <br>
              Description: ${power.description} <br>
              Flavor: ${power.flavorText} <br>
              Upgrade Effects: ${power.upgrade} <br>

            </div>`
          }
          
        })
      }

      $("#powers").html(htmlString)
      $('#count-powers').html(countPowers)

    })


    $("#character-filter").change(e => {
      let element = $(e.currentTarget)
      let playerCharacterId = element.val()
      let countPowers = 0
      let htmlString = ``

      if(playerCharacterId === '') {
        htmlString += abc.viewAllPowersJustPowers()
        countPowers = abc.powers.length
      } else {
        let relevantPowerJoins = abc.joinPlayerCharacterPowers.filter(join => {
          return join.playerCharacterId == playerCharacterId
        })

        relevantPowerJoins.forEach(join => {
          countPowers++
          let relevantPower = abc.powers.filter(power => {
            return power.powerId == join.powerId
          })[0]

          htmlString += `
            <div class='power-view'>

              <b>${relevantPower.name}</b> <br>
              Type: ${relevantPower.type} <br>
              Attack Type: ${relevantPower.attackType} <br>
              Damage: ${relevantPower.damage} <br>
              Effect: ${relevantPower.effect} <br>
              Description: ${relevantPower.description} <br>
              Flavor: ${relevantPower.flavorText} <br>
              Upgrade Effects: ${relevantPower.upgrade} <br>

            </div>`
        })
      }



      $("#powers").html(htmlString)
      $('#count-powers').html(countPowers)

    })
  },

  viewAllPowersJustPowers: () => {
    let htmlString = ``

    abc.powers.forEach(power => {
      htmlString += `
      <div class='power-view'>

        <b>${power.name}</b> <br>
        Type: ${power.type} <br>
        Attack Type: ${power.attackType} <br>
        Damage: ${power.damage} <br>
        Effect: ${power.effect} <br>
        Description: ${power.description} <br>
        Flavor: ${power.flavorText} <br>
        Upgrade Effects: ${power.upgrade} <br>

      </div>`
    })

    return htmlString
  },



  viewHelpfulInfo: () => {
    let htmlString = ``

    htmlString += `
    <img src='images/miscellaneous/ability-modifiers.png'>
    <br><br>
    <img src='images/miscellaneous/skill-table.jpg'>
    <br><br>

    <br> Level 2 - 2 Defense points, +1 Base damage
    <br> Level 3 - Power point + 2 x To hit +1
    <br> Level 4 - Base damage +2
    <br> Level 5 - +3 Ability Score, Power point
    <br> Level 6 - 2 Defense points, +1 Base damage
    <br> Level 7 - Power point
    <br> Level 8 - 2 Defense points
    <br> Level 9 - 2 x To hit +1
    <br> Level 10 - +1 Action point, 1 Power point, +3 Ability Score, Choose: Initiative +4, Speed +1, +3 Base damage

    
    `


    return htmlString
  },






 
  addTokenItem: (imageFilename, ranTop, ranLeft) => {

    //I'm a bad person. Fix this
    let effects = ['poison.jpg', 'ice.jpg', 'fire.jpg', 'immobile.gif', 'prone.gif']
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = ``
    if(effects.indexOf(imageFilename) > -1) {
      htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px; opacity: 0.4;'><img src='images/items/${imageFilename}'></div>`
    } else {
      htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='images/items/${imageFilename}'></div>`
    }
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)
    abc.currentDynamicDivId++
  },

  addTokenPlayerCharacter: (imageFilename, ranTop, ranLeft) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='images/player-characters/${imageFilename}'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)
    abc.currentDynamicDivId++
  },

  addTokenCreature: (imageFilename, ranTop, ranLeft, creatureId) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' token-id='${abc.currentDynamicDivId}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: 50px; height: 50px;'><img src='images/creatures/${imageFilename}'></div>`
    $("#wrapper").append(htmlString)
    $(`#${id}`).draggable(abc.draggableOptionsToken)

    if(!abc.creatureTableCreated && abc.userIsDM) {
      abc.createCreatureTable()
    }

    // testing to make sure I had unique local copies of the creatures
    // $(`#${id}`).on("click", e => {
    //   let element = $(e.currentTarget)
    //   let tokenId = +element.attr('token-id')
    //   let creature = abc.activeCreatures.filter(aCreature => {
    //     return aCreature.tokenId === tokenId
    //   })[0]

    //   console.log(creature.hp)

    // })


    let newCopy = abc.getCreature(creatureId)

    newCopy.tokenId = abc.currentDynamicDivId

    abc.activeCreatures.push(newCopy)

    if(abc.userIsDM) {
      abc.addCreatureToCreatureTable(newCopy)
    }

    abc.currentDynamicDivId++
  },

  addCustomToken: (imageFilename, ranTop, ranLeft, height, width, opacity) => {
    let id = `dynamically-added-div-${abc.currentDynamicDivId}`
    let htmlString = `<div id='${id}' style='position:absolute; top:${ranTop}px; left:${ranLeft}px; width: ${width}px; height: ${height}px; opacity: ${opacity};'><img src='images/custom/${imageFilename}'></div>`
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
  




  createTurnCounter: () => {
    $('#wrapper').append(abc.createTurnCounterHtml())
    abc.handlerTurnCounter()
  },

  createTurnCounterHtml: () => {
    let htmlString = ``

    if(abc.userIsDM) {
      htmlString += `
      <div id='turn-counter-container' class=''>

        <label>Current Turn:</label>
        <span id='tc-current-turn'>0</span>
        <button id='tc-decrement-turn' class='btn btn-sm'><i class='glyphicon glyphicon-minus'></i></button>
        <button id='tc-increment-turn' class='btn btn-sm'><i class='glyphicon glyphicon-plus'></i></button>
        <button id='tc-add-row' class='btn btn-sm'>Add Row</button>
        <br>

        <table id='turn-counter-table' class='table-condensed'>
          <tr id='tc-header-row'>
            <th>Name</th>
            <th>Initiative</th>
            <th>Count</th>
            <th></th>
            <th></th>
          </tr>
          
        </table>
      </div>`
    } else {
      htmlString += `
      <div id='turn-counter-container' class=''>

        <label>Current Turn:</label>
        <span id='tc-current-turn'>0</span>
        <br>

        <table id='turn-counter-table' class='table-condensed'>
          <tr id='tc-header-row'>
            <th>Name</th>
            <th>Initiative</th>
            <th>Count</th>
            <th></th>
            <th></th>
          </tr>
          
        </table>
      </div>`
    }
    

    return htmlString
  },

  addRowToTurnCounter: randId => {
    $('#turn-counter-table').append(abc.createTurnCounterRowHtml(randId))
    
    if(abc.userIsDM) {
      $('.tc-edit-row').off('click')
      $('.tc-remove-row').off('click')

      $('.tc-edit-row').on('click', e => {
        let element = $(e.currentTarget)
        let randId = element.attr('rand-id')
        let currentlyEditIcon = $(`button[rand-id='${randId}'][class~=tc-edit-row]`).attr('currently-edit-icon')

        if(currentlyEditIcon === 'true') { //everything is normal. Change everything to inputs
          let currentName = $(`.td-name[id=tc-name-${randId}]`).text()
          let currentInitiative = $(`.td-initiative[id=tc-initiative-${randId}]`).text()
          let currentCount = $(`.td-count[id=tc-count-${randId}]`).text()

          $(`.td-name[id=tc-name-${randId}]`).html(`<input id='temp-input-name' class='temp-input' value='${currentName}'>`)
          $(`.td-initiative[id=tc-initiative-${randId}]`).html(`<input id='temp-input-initiative' class='temp-input' value='${currentInitiative}'>`)
          $(`.td-count[id=tc-count-${randId}]`).html(`<input id='temp-input-count' class='temp-input' value='${currentCount}'>`)

          $(`button[rand-id='${randId}'][class~=tc-edit-row]`).html(`<i class='glyphicon glyphicon-floppy-disk'></i>`)
          $(`button[rand-id='${randId}'][class~=tc-edit-row]`).attr('currently-edit-icon', 'false')

        } else { //info was just updated, retrieve it and put things back to normal

          let updatedName = $(`#temp-input-name`).val()
          let updatedInitiative = $(`#temp-input-initiative`).val()
          let updatedCount = $(`#temp-input-count`).val()

          abc.toSocket({
            event: 'update-turn-counter-row-values',
            randId: randId,
            updatedName: updatedName,
            updatedInitiative: updatedInitiative,
            updatedCount: updatedCount
          })

          $(`button[rand-id='${randId}'][class~=tc-edit-row]`).html(`<i class='glyphicon glyphicon-edit'></i>`)
          $(`button[rand-id='${randId}'][class~=tc-edit-row]`).attr('currently-edit-icon', 'true')
        }
      })

      $('.tc-remove-row').on('click', e => {
        let element = $(e.currentTarget)
        let randId = element.attr('rand-id')
        abc.toSocket({event: 'remove-turn-counter-row', randId: randId})
      })
    }

    
  },

  handlerTurnCounter: () => {

    $('#turn-counter-container').draggable().resizable()

    $('#tc-add-row').click(e => {
      let randId = ebot.getRandomInt(100000, 999999)
      abc.toSocket({event: 'add-row-to-turn-counter', randId: randId})
    })

    $("#tc-increment-turn").click(e => {
      abc.toSocket({event: 'increment-turn'})
    })

    $("#tc-decrement-turn").click(e => {
      abc.toSocket({event: 'decrement-turn'})
    })

  },

  createTurnCounterRowHtml: randId => {
    let htmlString = ``

    if(abc.userIsDM) {
      htmlString += `
      <tr id='tc-${randId}'>
        <td id='tc-name-${randId}' class='td-name'>asdf</td>
        <td id='tc-initiative-${randId}' class='td-initiative'></td>
        <td id='tc-count-${randId}' class='td-count'>1</td>
        <td><button class='btn btn-sm tc-edit-row' rand-id='${randId}' currently-edit-icon='true'><i class='glyphicon glyphicon-edit'></i></button></td>
        <td><button class='btn btn-sm tc-remove-row' rand-id='${randId}'><i class='glyphicon glyphicon-minus'></i></button></td>
      </tr>`
    } else {
      htmlString += `
      <tr id='tc-${randId}'>
        <td id='tc-name-${randId}' class='td-name'>asdf</td>
        <td id='tc-initiative-${randId}' class='td-initiative'></td>
        <td id='tc-count-${randId}' class='td-count'>1</td>
        <td></td>
        <td></td>
      </tr>`
    }

    return htmlString
  },

  




  createCreatureTable: () => {
    $('#wrapper').append(abc.createCreatureTableHtml())
    abc.handlerCreatureTable()
    abc.creatureTableCreated = true
  },

  createCreatureTableHtml: () => {
    let htmlString = ``

    htmlString += `
    <div id='creature-table-container'>
      <button id='remove-creature-table' class='btn btn-md'><i class='glyphicon glyphicon-minus'></i></button>

      <table id='creature-table' class='table-condensed'>
        <tr id='ct-header-row'>
          <th>Name</th>
          <th>HP</th>
          <th>Status</th>
          <th></th>
        </tr>
      </table>

    </div>`

    return htmlString
  },

  handlerCreatureTable: () => {
    $('#creature-table-container').draggable().resizable()

    $("#remove-creature-table").click(e => {
      $('#creature-table-container').remove()
    })
  },

  addCreatureToCreatureTable: creature => {
    let htmlString = ``

    htmlString += `
    <tr id='' creature-id='${creature._id}' token-id='${creature.tokenId}'>
      <td id='creature-table-name-${creature.tokenId}' class='creature-table-name'>${creature.name}</td>
      <td id=''><input class='form-control creature-table-hp-input' creature-id='${creature._id}' type='number' value='${creature.hp}'></td>
      <td id=''><input class='form-control creature-table-status'></td>
      <td><button class='btn btn-sm ct-remove' token-id='${creature.tokenId}'><i class='glyphicon glyphicon-minus'></i></button></td>
    </tr>`

    $('#creature-table').append(htmlString)

    $(".creature-table-hp-input").off("change").on("change", e => {
      let element = $(e.currentTarget)
      let creatureId = element.attr("creature-id")
      let val = element.val()

      let creature = abc.activeCreatures.filter(aCreature => {
        return aCreature._id === creatureId
      })[0]

      creature.hp = val
    })

    // $("#myElement").unbind('mouseenter mouseleave');
    // $('#myElement').off('hover');

    $("#creature-table tr").hover(e => {

      $("#creature-table tr").on({
        mouseenter: e => {
          addBorderToToken(e, true)
        },
        mouseleave: e => {
          addBorderToToken(e, false)
        }
      })

      function addBorderToToken(e, mouseEnter) {
        let tokenId = $(e.currentTarget).attr('token-id')
        if(tokenId !== undefined) {
          let borderString = mouseEnter ? 'solid gold 3px' : ''
          $(`#dynamically-added-div-${tokenId}`).css('border', borderString)
        }
      }

      let tooltipString = ``
      let propsToIgnore = ['_id', 'imageFilename', '__v', 'tokenId', 'creatureId', 'level', 'xpValue', 'goldValue', 'race', 'name']

      for(let prop in creature) {
        if(propsToIgnore.indexOf(prop) === -1) {
          tooltipString += `${prop}: ${creature[prop]}<br>`
        }
      }

      $(`#creature-table-name-${creature.tokenId}`).tooltip({
        placement: 'left',
        title: tooltipString,
        html: true
      })
    })

    $(".ct-remove").off('click').on('click', (e => {
      let element = $(e.currentTarget)
      let tokenId = element.attr('token-id')
      abc.toSocket({
        event: 'creature-table-remove-row',
        tokenId: tokenId
      })
      $(`tr[token-id=${tokenId}]`).remove()
    }))



  },





  /*
    Utilities
  */
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

  //not currently being used
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

  //not currently used
  getItems: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/items`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getItems() Error")}
    }).promise()

    return deferred
  },

  getCreature: creatureId => {
    let creature = abc.creatures.filter(creature => {
      return creature._id === creatureId
    })[0]

    return abc.deepCopy(creature)
  },

  toSocket: obj => {
    abc.socket.emit('core', obj)
  },

  deepCopy: (obj) => {
    return JSON.parse(JSON.stringify(obj))
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

  activeCreatures: [],

  cursorDelay: 0,

  cursorsVisible: true,

  creatureTableCreated: false,

  doNotInclude: ['npc', 'Ryland']

}

