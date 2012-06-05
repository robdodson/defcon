var express = require('express'),
    app = express.createServer(express.logger()),
    io = require('socket.io').listen(app),
    routes = require('./routes');

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// Routes

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

app.get('/', routes.index);

var status = "All is well.";

io.sockets.on('connection', function (socket) {
  socket.emit('status', { status: status });
  socket.on('reset', function (data) {
    status = "War is imminent!";
    socket.emit('status', { status: status });
  });
});