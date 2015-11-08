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
    item.name = req.body.name  

    item.save(function(err) {
      if(err)
        res.send(err)
      res.json({ message: 'Item created!' })
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
      item.name = req.body.name
      item.save(function(err) {
        if(err)
          res.send(err)
        res.json({ message: 'Item updated!' })
      })
    })
  })

  app.delete('/items/:item_id', function(req, res) {
    Item.remove({_id: req.params.item_id}, function(err, item) {
      if(err)
        res.send(err)
      res.json({ message: 'Successfully deleted' })
    })
  })
  
}