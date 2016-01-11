
  app.get('/crud-creatures', function(req, res) {
    res.render('CRUD/creatures.ejs', {
        user : req.user
    })
  })


  app.get('/crud-log-entries', function(req, res) {
    res.render('CRUD/log-entries.ejs', {
        user : req.user
    })
  })


  app.get('/crud-player-characters', function(req, res) {
    res.render('CRUD/player-characters.ejs', {
        user : req.user
    })
  })


  app.get('/crud-items', function(req, res) {
    res.render('CRUD/items.ejs', {
        user : req.user
    })
  })


  app.get('/crud-join-player-character-items', function(req, res) {
    res.render('CRUD/join-player-character-items.ejs', {
        user : req.user
    })
  })


  app.get('/crud-non-player-characters', function(req, res) {
    res.render('CRUD/non-player-characters.ejs', {
        user : req.user
    })
  })


  app.get('/crud-logs', function(req, res) {
    res.render('CRUD/logs.ejs', {
        user : req.user
    })
  })


  app.get('/crud-join-player-character-powers', function(req, res) {
    res.render('CRUD/join-player-character-powers.ejs', {
        user : req.user
    })
  })


  app.get('/crud-character-details', function(req, res) {
    res.render('CRUD/character-details.ejs', {
        user : req.user
    })
  })


  app.get('/crud-powers', function(req, res) {
    res.render('CRUD/powers.ejs', {
        user : req.user
    })
  })

