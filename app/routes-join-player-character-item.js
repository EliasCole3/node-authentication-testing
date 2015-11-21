
  
  var JoinPlayerCharacterItem = require('../app/models/join-player-character-item')

  module.exports = function(app, passport) {

    app.get('/joinPlayerCharacterItems', function(req, res) {
      JoinPlayerCharacterItem.find(function(err, joinPlayerCharacterItems) {
        if(err)
          res.send(err)
        res.json(joinPlayerCharacterItems)
      })
    })

    app.post('/joinPlayerCharacterItems', function(req, res) {
      var joinPlayerCharacterItem = new JoinPlayerCharacterItem()

      joinPlayerCharacterItem.joinPlayerCharacterItemId = req.body.joinPlayerCharacterItemId
      joinPlayerCharacterItem.itemId = req.body.itemId
      joinPlayerCharacterItem.playerCharacterId = req.body.playerCharacterId
      joinPlayerCharacterItem.count = req.body.count

      joinPlayerCharacterItem.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Join player character item created!', obj: joinPlayerCharacterItem})
      })
    })

    app.get('/joinPlayerCharacterItems/:join_player_character_item_id', function(req, res) {
      JoinPlayerCharacterItem.findById(req.params.join_player_character_item_id, function(err, joinPlayerCharacterItem) {
        if(err)
          res.send(err)
        res.json(joinPlayerCharacterItem)
      })
    })

    app.put('/joinPlayerCharacterItems/:join_player_character_item_id', function(req, res) {
      JoinPlayerCharacterItem.findById(req.params.join_player_character_item_id, function(err, joinPlayerCharacterItem) {

        joinPlayerCharacterItem.joinPlayerCharacterItemId = req.body.joinPlayerCharacterItemId
        joinPlayerCharacterItem.itemId = req.body.itemId
        joinPlayerCharacterItem.playerCharacterId = req.body.playerCharacterId
        joinPlayerCharacterItem.count = req.body.count

        joinPlayerCharacterItem.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Join player character item updated!', obj: joinPlayerCharacterItem})
        })
      })
    })

    app.delete('/joinPlayerCharacterItems/:join_player_character_item_id', function(req, res) {
      JoinPlayerCharacterItem.remove({_id: req.params.join_player_character_item_id}, function(err, joinPlayerCharacterItem) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  