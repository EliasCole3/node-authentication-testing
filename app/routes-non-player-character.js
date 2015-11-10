
  
  var NonPlayerCharacter = require('../app/models/non-player-character')

  module.exports = function(app, passport) {

    app.get('/nonPlayerCharacters', function(req, res) {
      NonPlayerCharacter.find(function(err, nonPlayerCharacters) {
        if(err)
          res.send(err)
        res.json(nonPlayerCharacters)
      })
    })

    app.post('/nonPlayerCharacters', function(req, res) {
      var nonPlayerCharacter = new NonPlayerCharacter()

      nonPlayerCharacter.nonPlayerCharacterId = req.body.nonPlayerCharacterId
      nonPlayerCharacter.playerName = req.body.playerName
      nonPlayerCharacter.characterName = req.body.characterName
      nonPlayerCharacter.race = req.body.race
      nonPlayerCharacter.gClass = req.body.gClass
      nonPlayerCharacter.hp = req.body.hp
      nonPlayerCharacter.ac = req.body.ac
      nonPlayerCharacter.will = req.body.will
      nonPlayerCharacter.reflex = req.body.reflex
      nonPlayerCharacter.strength = req.body.strength
      nonPlayerCharacter.constitution = req.body.constitution
      nonPlayerCharacter.dexterity = req.body.dexterity
      nonPlayerCharacter.intelligence = req.body.intelligence
      nonPlayerCharacter.wisdom = req.body.wisdom
      nonPlayerCharacter.charisma = req.body.charisma
      nonPlayerCharacter.gold = req.body.gold
      nonPlayerCharacter.xp = req.body.xp
      nonPlayerCharacter.level = req.body.level
      nonPlayerCharacter.baseToHitAc = req.body.baseToHitAc
      nonPlayerCharacter.baseToHitWill = req.body.baseToHitWill
      nonPlayerCharacter.baseToHitReflex = req.body.baseToHitReflex
      nonPlayerCharacter.damageModifier = req.body.damageModifier
      nonPlayerCharacter.speed = req.body.speed
      nonPlayerCharacter.initiative = req.body.initiative
      nonPlayerCharacter.actionPoints = req.body.actionPoints
      nonPlayerCharacter.imageFilename = req.body.imageFilename

      nonPlayerCharacter.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Non player character created!', obj: nonPlayerCharacter})
      })
    })

    app.get('/nonPlayerCharacters/:non_player_character_id', function(req, res) {
      NonPlayerCharacter.findById(req.params.non_player_character_id, function(err, nonPlayerCharacter) {
        if(err)
          res.send(err)
        res.json(nonPlayerCharacter)
      })
    })

    app.put('/nonPlayerCharacters/:non_player_character_id', function(req, res) {
      NonPlayerCharacter.findById(req.params.non_player_character_id, function(err, nonPlayerCharacter) {

        nonPlayerCharacter.nonPlayerCharacterId = req.body.nonPlayerCharacterId
        nonPlayerCharacter.playerName = req.body.playerName
        nonPlayerCharacter.characterName = req.body.characterName
        nonPlayerCharacter.race = req.body.race
        nonPlayerCharacter.gClass = req.body.gClass
        nonPlayerCharacter.hp = req.body.hp
        nonPlayerCharacter.ac = req.body.ac
        nonPlayerCharacter.will = req.body.will
        nonPlayerCharacter.reflex = req.body.reflex
        nonPlayerCharacter.strength = req.body.strength
        nonPlayerCharacter.constitution = req.body.constitution
        nonPlayerCharacter.dexterity = req.body.dexterity
        nonPlayerCharacter.intelligence = req.body.intelligence
        nonPlayerCharacter.wisdom = req.body.wisdom
        nonPlayerCharacter.charisma = req.body.charisma
        nonPlayerCharacter.gold = req.body.gold
        nonPlayerCharacter.xp = req.body.xp
        nonPlayerCharacter.level = req.body.level
        nonPlayerCharacter.baseToHitAc = req.body.baseToHitAc
        nonPlayerCharacter.baseToHitWill = req.body.baseToHitWill
        nonPlayerCharacter.baseToHitReflex = req.body.baseToHitReflex
        nonPlayerCharacter.damageModifier = req.body.damageModifier
        nonPlayerCharacter.speed = req.body.speed
        nonPlayerCharacter.initiative = req.body.initiative
        nonPlayerCharacter.actionPoints = req.body.actionPoints
        nonPlayerCharacter.imageFilename = req.body.imageFilename

        nonPlayerCharacter.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Non player character updated!', obj: nonPlayerCharacter})
        })
      })
    })

    app.delete('/nonPlayerCharacters/:non_player_character_id', function(req, res) {
      NonPlayerCharacter.remove({_id: req.params.non_player_character_id}, function(err, nonPlayerCharacter) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  