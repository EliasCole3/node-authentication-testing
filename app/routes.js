var path = require('path')
var Item = require('../app/models/item')


module.exports = function(app, passport) {


    /*

    Routes from tutuorial

    */
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });







  



    /*

    Custom routes

    */
    app.get('/socket-main-page', function(req, res) {
      res.render(path.resolve(__dirname + './../index.ejs'), {
          user : req.user // get the user out of session and pass to template
      })
    })

    app.get('/testing', function(req, res) {
      res.render('testing.ejs', {
          user : req.user // get the user out of session and pass to template
      })
    })

    app.get('/js/testing.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/testing.js'))
    })

    // app.get('/crud-items', function(req, res) {
    //   res.render('CRUD/items.ejs', {
    //       user : req.user // get the user out of session and pass to template
    //   })
    // })

    // app.get('/css/crud-items.css', function(req, res) {
    //   res.sendFile(path.resolve(__dirname + './../css/crud-items.css'))
    // })

    // app.get('/js/crud-items.js', function(req, res) {
    //   res.sendFile(path.resolve(__dirname + './../js/crud-items.js'))
    // })





    /*

    Resources

    */

    /*
    JS
    */
    // app.get('/js/jquery.js', function(req, res) {
    //   res.sendFile(path.resolve(__dirname + './../js/jquery.js'))
    // })

    app.get('/js/jquery-ui.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/jquery-ui.js'))
    })

    app.get('/js/moment.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/moment.js'))
    })

    app.get('/js/vis.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/vis.js'))
    })

    app.get('/js/bootstrap.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/bootstrap.js'))
    })

    app.get('/js/inflection.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/inflection.js'))
    })

    app.get('/js/deepcopy.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/deepcopy.js'))
    })

    app.get('/js/socket-io.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/socket-io.js'))
    })

    app.get('/js/ebot.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/ebot.js'))
    })

    app.get('/js/js.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/js.js'))
    })

    app.get('/js/chosen.jquery.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/chosen.jquery.js'))
    })

    app.get('/js/velocity.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/velocity.js'))
    })


    /*
    CSS
    */
    app.get('/css/css.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/css.css'))
    })

    app.get('/css/testing.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/testing.css'))
    })

    app.get('/css/bootstrap.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/bootstrap.css'))
    })

    app.get('/css/vis.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/vis.css'))
    })

    app.get('/css/jquery-ui.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/jquery-ui.css'))
    })

    app.get('/css/chosen.min.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/chosen.min.css'))
    })

    app.get('/css/chosen-sprite.png', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/chosen-images/chosen-sprite.png'))
    })


    /*
    Sounds
    */
    app.get('/sounds/me-ding.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-ding.wav'))
    })

    app.get('/sounds/me-user-connected.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-user-connected.wav'))
    })

    app.get('/sounds/me-user-disconnected.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-user-disconnected.wav'))
    })


    /*
    Fonts
    */
    app.get('/fonts/glyphicons-halflings-regular.woff', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../fonts/glyphicons-halflings-regular.woff'))
    })

    app.get('/fonts/glyphicons-halflings-regular.ttf', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../fonts/glyphicons-halflings-regular.ttf'))
    })


    /*
    Miscellaneous
    */
    app.get('/node_modules/howler/howler.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../node_modules/howler/howler.js'))
    })
    












    /*

    Generated crud routes

    */

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


    app.get('/crud-character-details', function(req, res) {
      res.render('CRUD/character-details.ejs', {
          user : req.user
      })
    })

    app.get('/css/crud-character-details.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/crud-character-details.css'))
    })

    app.get('/js/crud-character-details.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/crud-character-details.js'))
    })


    app.get('/crud-join-player-character-powers', function(req, res) {
      res.render('CRUD/join-player-character-powers.ejs', {
          user : req.user
      })
    })

    app.get('/css/crud-join-player-character-powers.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/crud-join-player-character-powers.css'))
    })

    app.get('/js/crud-join-player-character-powers.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/crud-join-player-character-powers.js'))
    })


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}