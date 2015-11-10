
  
  var Item = require('../app/models/item')

  module.exports = function(app, passport) {

    app.get('/items', function(req, res) {
      Item.find(function(err, items) {
        if(err)
          res.send(err)
        res.json(items)
      })
    })

    app.post('/items', function(req, res) {
      var item = new Item()

      item.itemId = req.body.itemId
      item.name = req.body.name
      item.cost = req.body.cost
      item.flavorText = req.body.flavorText
      item.effect = req.body.effect
      item.imageFilename = req.body.imageFilename

      item.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Item created!', obj: item})
      })
    })

    app.get('/items/:item_id', function(req, res) {
      Item.findById(req.params.item_id, function(err, item) {
        if(err)
          res.send(err)
        res.json(item)
      })
    })

    app.put('/items/:item_id', function(req, res) {
      Item.findById(req.params.item_id, function(err, item) {

        item.itemId = req.body.itemId
        item.name = req.body.name
        item.cost = req.body.cost
        item.flavorText = req.body.flavorText
        item.effect = req.body.effect
        item.imageFilename = req.body.imageFilename

        item.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Item updated!', obj: item})
        })
      })
    })

    app.delete('/items/:item_id', function(req, res) {
      Item.remove({_id: req.params.item_id}, function(err, item) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  