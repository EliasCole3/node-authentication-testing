
  app.get('/crud-creatures', function(req, res) {
    res.render('CRUD/creatures.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-creatures.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-creatures.css'))
  })

  app.get('/js/crud-creatures.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-creatures.js'))
  })


  app.get('/crud-non-player-characters', function(req, res) {
    res.render('CRUD/non-player-characters.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-non-player-characters.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-non-player-characters.css'))
  })

  app.get('/js/crud-non-player-characters.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-non-player-characters.js'))
  })


  app.get('/crud-player-characters', function(req, res) {
    res.render('CRUD/player-characters.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-player-characters.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-player-characters.css'))
  })

  app.get('/js/crud-player-characters.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-player-characters.js'))
  })


  app.get('/crud-log-entries', function(req, res) {
    res.render('CRUD/log-entries.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-log-entries.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-log-entries.css'))
  })

  app.get('/js/crud-log-entries.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-log-entries.js'))
  })


  app.get('/crud-items', function(req, res) {
    res.render('CRUD/items.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-items.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-items.css'))
  })

  app.get('/js/crud-items.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-items.js'))
  })


  app.get('/crud-logs', function(req, res) {
    res.render('CRUD/logs.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-logs.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-logs.css'))
  })

  app.get('/js/crud-logs.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-logs.js'))
  })


  app.get('/crud-powers', function(req, res) {
    res.render('CRUD/powers.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-powers.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-powers.css'))
  })

  app.get('/js/crud-powers.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-powers.js'))
  })


  app.get('/crud-join-player-character-items', function(req, res) {
    res.render('CRUD/join-player-character-items.ejs', {
        user : req.user
    })
  })

  app.get('/css/crud-join-player-character-items.css', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../css/crud-join-player-character-items.css'))
  })

  app.get('/js/crud-join-player-character-items.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + './../js/crud-join-player-character-items.js'))
  })

