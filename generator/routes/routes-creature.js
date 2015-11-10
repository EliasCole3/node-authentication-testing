
  
  var Creature = require('../app/models/creature')

  module.exports = function(app, passport) {

    app.get('/creatures', function(req, res) {
      Creature.find(function(err, creatures) {
        if(err)
          res.send(err)
        res.json(creatures)
      })
    })

    app.post('/creatures', function(req, res) {
      var creature = new Creature()

      creature.creatureId = req.body.creatureId
      creature.name = req.body.name
      creature.race = req.body.race
      creature.hp = req.body.hp
      creature.ac = req.body.ac
      creature.will = req.body.will
      creature.reflex = req.body.reflex
      creature.goldValue = req.body.goldValue
      creature.xpValue = req.body.xpValue
      creature.level = req.body.level
      creature.baseToHitAc = req.body.baseToHitAc
      creature.baseToHitWill = req.body.baseToHitWill
      creature.baseToHitReflex = req.body.baseToHitReflex
      creature.damageModifier = req.body.damageModifier
      creature.speed = req.body.speed
      creature.initiative = req.body.initiative
      creature.imageFilename = req.body.imageFilename

      creature.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Creature created!', obj: creature})
      })
    })

    app.get('/creatures/:creature_id', function(req, res) {
      Creature.findById(req.params.creature_id, function(err, creature) {
        if(err)
          res.send(err)
        res.json(creature)
      })
    })

    app.put('/creatures/:creature_id', function(req, res) {
      Creature.findById(req.params.creature_id, function(err, creature) {

        creature.creatureId = req.body.creatureId
        creature.name = req.body.name
        creature.race = req.body.race
        creature.hp = req.body.hp
        creature.ac = req.body.ac
        creature.will = req.body.will
        creature.reflex = req.body.reflex
        creature.goldValue = req.body.goldValue
        creature.xpValue = req.body.xpValue
        creature.level = req.body.level
        creature.baseToHitAc = req.body.baseToHitAc
        creature.baseToHitWill = req.body.baseToHitWill
        creature.baseToHitReflex = req.body.baseToHitReflex
        creature.damageModifier = req.body.damageModifier
        creature.speed = req.body.speed
        creature.initiative = req.body.initiative
        creature.imageFilename = req.body.imageFilename

        creature.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Creature updated!', obj: creature})
        })
      })
    })

    app.delete('/creatures/:creature_id', function(req, res) {
      Creature.remove({_id: req.params.creature_id}, function(err, creature) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  