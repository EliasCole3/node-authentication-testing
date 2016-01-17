



// set up ======================================================================
var nomo         = require('node-monkey').start()
var express      = require('express')
var app          = express()
var port         = process.env.PORT || 8082
var mongoose     = require('mongoose')
var passport     = require('passport')
var flash        = require('connect-flash')

var morgan       = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')
var session      = require('express-session')

var configDB     = require('./config/database.js')

var http         = require('http').Server(app)
var io           = require('socket.io')(http)



// configuration ===============================================================
mongoose.connect(configDB.url)

require('./config/passport')(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev'))        // log every request to the console
app.use(cookieParser())       // read cookies (needed for auth)
app.use(bodyParser())         // get information from html forms
app.set('view engine', 'ejs') // set up ejs for templating

app.use('/css', express.static('static/css'))
app.use('/fonts', express.static('static/fonts'))
app.use('/js', express.static('static/js'))
app.use('/sounds', express.static('static/sounds'))
app.use('/images', express.static('static/images'))

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash())            // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport
require('./app/routes-non-player-character.js')(app, passport)
require('./app/routes-player-character.js')(app, passport)
require('./app/routes-creature.js')(app, passport)
require('./app/routes-log.js')(app, passport)
require('./app/routes-log-entry.js')(app, passport)
require('./app/routes-item.js')(app, passport)
require('./app/routes-power.js')(app, passport)
require('./app/routes-join-player-character-item.js')(app, passport)
require('./app/routes-character-detail.js')(app, passport)
require('./app/routes-join-player-character-power.js')(app, passport)




//socket-io stuff


// socket.emit('message', "this is a test")           // sending to sender-client only
// io.emit('message', "this is a test")               // sending to all clients, include sender
// socket.broadcast.emit('message', "this is a test") // sending to all clients except sender

io.on('connection', function(socket) {
  console.log('a user connected')
  io.emit('user connected')
  
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
    socket.broadcast.emit('element dragged', dragObj)
  })

  socket.on('element resized', function(emitObj) {
    socket.broadcast.emit('element resized', emitObj)
  })

  socket.on('div added', function() {
    socket.broadcast.emit('div added')
  })

  socket.on('item token added', function(emitObj) {
    socket.broadcast.emit('item token added', emitObj)
  })

  socket.on('player character token added', function(emitObj) {
    socket.broadcast.emit('player character token added', emitObj)
  })

  socket.on('creature token added', function(emitObj) {
    socket.broadcast.emit('creature token added', emitObj)
  })

  socket.on('background changed', function(emitObj) {
    socket.broadcast.emit('background changed', emitObj)
  })

  socket.on('hp changed', function(emitObj) {
    socket.broadcast.emit('hp changed', emitObj)
  })

  socket.on('cursor moved', function(emitObj) {
    socket.broadcast.emit('cursor moved', emitObj)
  })

  socket.on('cursors toggle visibility', function(emitObj) {
    io.emit('cursors toggle visibility', emitObj)
  })

  socket.on('reload top drawer', function() {
    io.emit('reload top drawer')
  })

  socket.on('core', function(obj) {
    io.emit('core', obj)
  })
})


// launch ======================================================================
http.listen(8082, function() {
  console.log('listening on *:8082')
})
