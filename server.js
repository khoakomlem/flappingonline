var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	var express=require('express');
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname,  'index.html'));
});

io.on('connection', function(socket){
	// io.emit('online', io.sockets.adapter.rooms['asd'].sockets);
	socket.on('disconnect', function(){
		io.emit('online', io.sockets.server.engine.clientsCount);
	});

	socket.on('package', room=>{
		io.emit('a','b');
		socket.broadcast.emit('a','b');
		io.sockets.emit('a','b');
		socket.broadcast.emit(1,2,3,4,5);
		// setTimeout(() {}, 10);
	});
	socket.on('latency', data=>{
		socket.emit('pong',data);
	});

	
});

http.listen(port, function(){
	console.log('listening on *'+port);
});