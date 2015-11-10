
  
  var Log = require('../app/models/log')

  module.exports = function(app, passport) {

    app.get('/logs', function(req, res) {
      Log.find(function(err, logs) {
        if(err)
          res.send(err)
        res.json(logs)
      })
    })

    app.post('/logs', function(req, res) {
      var log = new Log()

      log.logId = req.body.logId
      log.logName = req.body.logName
      log.playerCharacterId = req.body.playerCharacterId

      log.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Log created!', obj: log})
      })
    })

    app.get('/logs/:log_id', function(req, res) {
      Log.findById(req.params.log_id, function(err, log) {
        if(err)
          res.send(err)
        res.json(log)
      })
    })

    app.put('/logs/:log_id', function(req, res) {
      Log.findById(req.params.log_id, function(err, log) {

        log.logId = req.body.logId
        log.logName = req.body.logName
        log.playerCharacterId = req.body.playerCharacterId

        log.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Log updated!', obj: log})
        })
      })
    })

    app.delete('/logs/:log_id', function(req, res) {
      Log.remove({_id: req.params.log_id}, function(err, log) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  