
  
  var CharacterDetail = require('../app/models/character-detail')

  module.exports = function(app, passport) {

    app.get('/characterDetails', function(req, res) {
      CharacterDetail.find(function(err, characterDetails) {
        if(err)
          res.send(err)
        res.json(characterDetails)
      })
    })

    app.post('/characterDetails', function(req, res) {
      var characterDetail = new CharacterDetail()

      characterDetail.characterDetailId = req.body.characterDetailId
      characterDetail.backstory = req.body.backstory
      characterDetail.playerCharacterId = req.body.playerCharacterId

      characterDetail.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Character detail created!', obj: characterDetail})
      })
    })

    app.get('/characterDetails/:character_detail_id', function(req, res) {
      CharacterDetail.findById(req.params.character_detail_id, function(err, characterDetail) {
        if(err)
          res.send(err)
        res.json(characterDetail)
      })
    })

    app.put('/characterDetails/:character_detail_id', function(req, res) {
      CharacterDetail.findById(req.params.character_detail_id, function(err, characterDetail) {

        characterDetail.characterDetailId = req.body.characterDetailId
        characterDetail.backstory = req.body.backstory
        characterDetail.playerCharacterId = req.body.playerCharacterId

        characterDetail.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Character detail updated!', obj: characterDetail})
        })
      })
    })

    app.delete('/characterDetails/:character_detail_id', function(req, res) {
      CharacterDetail.remove({_id: req.params.character_detail_id}, function(err, characterDetail) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  