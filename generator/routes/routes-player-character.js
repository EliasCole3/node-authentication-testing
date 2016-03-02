
  
  var PlayerCharacter = require('../app/models/player-character')

  module.exports = function(app, passport) {

    app.get('/playerCharacters', function(req, res) {
      PlayerCharacter.find(function(err, playerCharacters) {
        if(err)
          res.send(err)
        res.json(playerCharacters)
      })
    })

    app.post('/playerCharacters', function(req, res) {
      var playerCharacter = new PlayerCharacter()

      playerCharacter.playerCharacterId = req.body.playerCharacterId
      playerCharacter.playerName = req.body.playerName
      playerCharacter.characterName = req.body.characterName
      playerCharacter.race = req.body.race
      playerCharacter.gClass = req.body.gClass
      playerCharacter.hp = req.body.hp
      playerCharacter.ac = req.body.ac
      playerCharacter.will = req.body.will
      playerCharacter.reflex = req.body.reflex
      playerCharacter.strength = req.body.strength
      playerCharacter.constitution = req.body.constitution
      playerCharacter.dexterity = req.body.dexterity
      playerCharacter.intelligence = req.body.intelligence
      playerCharacter.wisdom = req.body.wisdom
      playerCharacter.charisma = req.body.charisma
      playerCharacter.gold = req.body.gold
      playerCharacter.xp = req.body.xp
      playerCharacter.level = req.body.level
      playerCharacter.baseToHitAc = req.body.baseToHitAc
      playerCharacter.baseToHitWill = req.body.baseToHitWill
      playerCharacter.baseToHitReflex = req.body.baseToHitReflex
      playerCharacter.damageModifier = req.body.damageModifier
      playerCharacter.speed = req.body.speed
      playerCharacter.initiative = req.body.initiative
      playerCharacter.actionPoints = req.body.actionPoints
      playerCharacter.imageFilename = req.body.imageFilename
      playerCharacter.items = req.body.items

      playerCharacter.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Player character created!', obj: playerCharacter})
      })
    })

    app.get('/playerCharacters/:player_character_id', function(req, res) {
      PlayerCharacter.findById(req.params.player_character_id, function(err, playerCharacter) {
        if(err)
          res.send(err)
        res.json(playerCharacter)
      })
    })

    app.put('/playerCharacters/:player_character_id', function(req, res) {
      PlayerCharacter.findById(req.params.player_character_id, function(err, playerCharacter) {

        playerCharacter.playerCharacterId = req.body.playerCharacterId
        playerCharacter.playerName = req.body.playerName
        playerCharacter.characterName = req.body.characterName
        playerCharacter.race = req.body.race
        playerCharacter.gClass = req.body.gClass
        playerCharacter.hp = req.body.hp
        playerCharacter.ac = req.body.ac
        playerCharacter.will = req.body.will
        playerCharacter.reflex = req.body.reflex
        playerCharacter.strength = req.body.strength
        playerCharacter.constitution = req.body.constitution
        playerCharacter.dexterity = req.body.dexterity
        playerCharacter.intelligence = req.body.intelligence
        playerCharacter.wisdom = req.body.wisdom
        playerCharacter.charisma = req.body.charisma
        playerCharacter.gold = req.body.gold
        playerCharacter.xp = req.body.xp
        playerCharacter.level = req.body.level
        playerCharacter.baseToHitAc = req.body.baseToHitAc
        playerCharacter.baseToHitWill = req.body.baseToHitWill
        playerCharacter.baseToHitReflex = req.body.baseToHitReflex
        playerCharacter.damageModifier = req.body.damageModifier
        playerCharacter.speed = req.body.speed
        playerCharacter.initiative = req.body.initiative
        playerCharacter.actionPoints = req.body.actionPoints
        playerCharacter.imageFilename = req.body.imageFilename
        playerCharacter.items = req.body.items

        playerCharacter.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Player character updated!', obj: playerCharacter})
        })
      })
    })

    app.delete('/playerCharacters/:player_character_id', function(req, res) {
      PlayerCharacter.remove({_id: req.params.player_character_id}, function(err, playerCharacter) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  