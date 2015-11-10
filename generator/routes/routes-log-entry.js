
  
  var LogEntry = require('../app/models/log-entry')

  module.exports = function(app, passport) {

    app.get('/logEntries', function(req, res) {
      LogEntry.find(function(err, logEntries) {
        if(err)
          res.send(err)
        res.json(logEntries)
      })
    })

    app.post('/logEntries', function(req, res) {
      var logEntry = new LogEntry()

      logEntry.logEntryId = req.body.logEntryId
      logEntry.message = req.body.message
      logEntry.date = req.body.date
      logEntry.logId = req.body.logId

      logEntry.save(function(err) {
        if(err)
          res.send(err)
        res.json({message: 'Log entry created!', obj: logEntry})
      })
    })

    app.get('/logEntries/:log_entry_id', function(req, res) {
      LogEntry.findById(req.params.log_entry_id, function(err, logEntry) {
        if(err)
          res.send(err)
        res.json(logEntry)
      })
    })

    app.put('/logEntries/:log_entry_id', function(req, res) {
      LogEntry.findById(req.params.log_entry_id, function(err, logEntry) {

        logEntry.logEntryId = req.body.logEntryId
        logEntry.message = req.body.message
        logEntry.date = req.body.date
        logEntry.logId = req.body.logId

        logEntry.save(function(err) {
          if(err)
            res.send(err)
          res.json({message: 'Log entry updated!', obj: logEntry})
        })
      })
    })

    app.delete('/logEntries/:log_entry_id', function(req, res) {
      LogEntry.remove({_id: req.params.log_entry_id}, function(err, logEntry) {
        if(err)
          res.send(err)
        res.json({message: 'Successfully deleted'})
      })
    })

  }

  