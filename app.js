
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

// Reduce the log verbosity
io.set('log level', 1);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// Sockets
io.sockets.on('connection', function(socket) {
  socket.on('note', function(msg) {
    console.log("got msg " + msg.note);
    socket.broadcast.emit('note', msg);
  });
  socket.on('noteend', function(msg) {
	socket.broadcast.emit('noteend', msg);
  });
});

app.listen(6437);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
