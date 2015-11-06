var path = require('path')

module.exports = function(app, passport) {

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



    //resources
    app.get('/socket-main-page', function(req, res) {
      // res.sendFile(__dirname + './../index.html')
      // res.sendFile(path.resolve(__dirname + './../index.html'));
      // res.sendFile(__dirname + '/views/index.html')

      // res.locals.user = req.user;
      // res.sendFile(path.resolve(__dirname + './../index.html'))

      res.render(path.resolve(__dirname + './../index.ejs'), {
          user : req.user // get the user out of session and pass to template
      });
    })

    app.get('/js/jquery.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../js/jquery.js'))
    })

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

    app.get('/css/css.css', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../css/css.css'))
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

    app.get('/node_modules/howler/howler.js', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../node_modules/howler/howler.js'))
    })

    app.get('/sounds/me-ding.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-ding.wav'))
    })

    app.get('/sounds/me-user-connected.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-user-connected.wav'))
    })

    app.get('/sounds/me-user-disconnected.wav', function(req, res) {
      res.sendFile(path.resolve(__dirname + './../sounds/me-user-disconnected.wav'))
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