

// var app     = express();
// var server  = require('http').createServer(app);
// var io      = require('socket.io').listen(server);
// ...
// server.listen(app.get('port')); // not 'app.listen'!


// set up ======================================================================
var nomo = require('node-monkey').start();
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8082;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var http = require('http').Server(app);
var io = require('socket.io')(http);



// configuration ===============================================================
mongoose.connect(configDB.url);

// var passportFunc = require('./config/passport');

// console.log(passportFunc)


require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes-item.js')(app, passport);


//socket-io stuff
io.on('connection', function(socket) {
  console.log('a user connected')
  io.emit('user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected')
    io.emit('user disconnected')
  })
  
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg)
    io.emit('chat message', msg)
  })

  socket.on('element dragged', function(dragObj) {
    console.log('drag object: ')
    console.log(dragObj)
    // io.emit('element dragged', dragObj)
    socket.broadcast.emit('element dragged', dragObj)
  })

  socket.on('element resized', function(emitObj) {
    socket.broadcast.emit('element resized', emitObj)
  })

  socket.on('div added', function() {
    socket.broadcast.emit('div added')
  })
})


// launch ======================================================================
// app.listen(port);
// console.log('The magic happens on port ' + port);

http.listen(8082, function() {
  console.log('listening on *:8082')
})
