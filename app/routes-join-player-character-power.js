
  
  var JoinPlayerCharacterPower = require('../app/models/join-player-character-power')

  module.exports = function(app, passport) {

    app.get('/joinPlayerCharacterPowers', function(req, res) {
      JoinPlayerCharacterPower.find(function(err, joinPlayerCharacterPowers) {
        if(err)
          res.send(err)
        res.json(joinPlayerCharacterPowers)
      })
    })

    app.post('/joinPlayerCharacterPowers', function(req, res) {
      var joinPlayerCharacterPower = new JoinPlayerCharacterPower()

      joinPlayerCharacterPower.joinPlayerCharacterPowerId = req.body.joinPlayerCharacterPowerId
      joinPlayerCharacterPower.powerId = req.body.powerId
      joinPlayerCharacterPower.playerCharacterId = req.body.playerCharacterId

      joinPlayerCharacterPower.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Join player character power created!', obj: joinPlayerCharacterPower})
      })
    })

    app.get('/joinPlayerCharacterPowers/:join_player_character_power_id', function(req, res) {
      JoinPlayerCharacterPower.findById(req.params.join_player_character_power_id, function(err, joinPlayerCharacterPower) {
        if(err)
          res.send(err)
        res.json(joinPlayerCharacterPower)
      })
    })

    app.put('/joinPlayerCharacterPowers/:join_player_character_power_id', function(req, res) {
      JoinPlayerCharacterPower.findById(req.params.join_player_character_power_id, function(err, joinPlayerCharacterPower) {

        joinPlayerCharacterPower.joinPlayerCharacterPowerId = req.body.joinPlayerCharacterPowerId
        joinPlayerCharacterPower.powerId = req.body.powerId
        joinPlayerCharacterPower.playerCharacterId = req.body.playerCharacterId

        joinPlayerCharacterPower.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Join player character power updated!', obj: joinPlayerCharacterPower})
        })
      })
    })

    app.delete('/joinPlayerCharacterPowers/:join_player_character_power_id', function(req, res) {
      JoinPlayerCharacterPower.remove({_id: req.params.join_player_character_power_id}, function(err, joinPlayerCharacterPower) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  