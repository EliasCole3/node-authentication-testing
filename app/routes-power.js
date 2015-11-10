
  
  var Power = require('../app/models/power')

  module.exports = function(app, passport) {

    app.get('/powers', function(req, res) {
      Power.find(function(err, powers) {
        if(err)
          res.send(err)
        res.json(powers)
      })
    })

    app.post('/powers', function(req, res) {
      var power = new Power()

      power.powerId = req.body.powerId
      power.name = req.body.name
      power.type = req.body.type
      power.flavorText = req.body.flavorText
      power.attackType = req.body.attackType
      power.damage = req.body.damage
      power.effect = req.body.effect
      power.description = req.body.description
      power.upgrade = req.body.upgrade
      power.imageFilename = req.body.imageFilename

      power.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Power created!', obj: power})
      })
    })

    app.get('/powers/:power_id', function(req, res) {
      Power.findById(req.params.power_id, function(err, power) {
        if(err)
          res.send(err)
        res.json(power)
      })
    })

    app.put('/powers/:power_id', function(req, res) {
      Power.findById(req.params.power_id, function(err, power) {

        power.powerId = req.body.powerId
        power.name = req.body.name
        power.type = req.body.type
        power.flavorText = req.body.flavorText
        power.attackType = req.body.attackType
        power.damage = req.body.damage
        power.effect = req.body.effect
        power.description = req.body.description
        power.upgrade = req.body.upgrade
        power.imageFilename = req.body.imageFilename

        power.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Power updated!', obj: power})
        })
      })
    })

    app.delete('/powers/:power_id', function(req, res) {
      Power.remove({_id: req.params.power_id}, function(err, power) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  