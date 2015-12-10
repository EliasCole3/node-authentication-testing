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

    app.get('/crud-non-player-characters', function(req, res) {
      res.render('CRUD/non-player-characters.ejs', {
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

    app.get('/crud-logs', function(req, res) {
      res.render('CRUD/logs.ejs', {
          user : req.user
      })
    })

    app.get('/crud-log-entries', function(req, res) {
      res.render('CRUD/log-entries.ejs', {
          user : req.user
      })
    })

    app.get('/crud-powers', function(req, res) {
      res.render('CRUD/powers.ejs', {
          user : req.user
      })
    })

    app.get('/crud-join-player-character-items', function(req, res) {
      res.render('CRUD/join-player-character-items.ejs', {
          user : req.user
      })
    })

    app.get('/crud-character-details', function(req, res) {
      res.render('CRUD/character-details.ejs', {
          user : req.user
      })
    })

    app.get('/crud-join-player-character-powers', function(req, res) {
      res.render('CRUD/join-player-character-powers.ejs', {
          user : req.user
      })
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