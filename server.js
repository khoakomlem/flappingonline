var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var random = require('random');
var arraySort = require('array-sort');
var port = process.env.PORT || 3000;
var rank=false, pipe=[], time=300;
var score=[], hang, num=0,arr=[];

app.get('/', function(req, res){
	var express=require('express');
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname,  'index.html'));
});

io.on('connection', function(socket){

	io.emit('online', io.sockets.server.engine.clientsCount);
	socket.on('disconnect', function(){
		delete score[socket.id];
		num--;
		socket.emit('time', rank, time, num)
		if (num<0)
			num=0;
		io.emit('online', io.sockets.server.engine.clientsCount);
	});
	socket.on('latency', data=>{
		socket.emit('pong',data);
	});
	socket.on('die', ()=>{
		if (rank){
			score[socket.id].score=0;
			arr=[];
			for (var i in score){
				arr.push(score[i]);
			}
			arraySort(arr,'high');
			socket.emit('tab',arr);
		}
	});
	socket.on('check', ()=>socket.emit('time', rank, time, num));
	socket.on('plus', ()=>{
		if (rank){
			score[socket.id].score++;
			if (score[socket.id].score>score[socket.id].high){
				score[socket.id].high=score[socket.id].score;
			}
		}
		
	})
	socket.on('regis',()=>{
		score[socket.id]={
			id:socket.id,
			score:0,
			high:0
		};
		num++;
		socket.emit('time', rank, time, num);
		arr=[];
		for (var i in score){
			arr.push(score[i]);
		}
		arraySort(arr,'high');
		socket.emit('tab',arr);
	})
	socket.on('tab', ()=>{
		arr=[];
		for (var i in score){
			arr.push(score[i]);
		}
		arraySort(arr,'high');
		socket.emit('tab',arr);
	})
	socket.on('rank',()=>{
		if (rank)
			socket.emit('rankpipe', pipe);
		if (rank==false){
			rank=true;
			console.log("Có người tạo đấu hạng!");
			socket.emit('time', rank, time, num);
			pipe.splice(0, pipe.length);
			for (var i=0; i<=1000; i++){
				pipe[i]={
					up:random.boolean(),
					top:random.int(min=0, max=720-200),
					bottom:0,
					w:50,
					x:0,
					type:Math.floor(random.int(min=1, max=2)),
					skull:Math.floor(random.int(min=60, max=70)),
					skull2:0
				}
				if (pipe.type==3)
   					pipe.type=2;
				pipe[i].bottom=pipe[i].top+180;
				pipe[i].x=1366+pipe[i].w;
				pipe[i].skull2=Math.floor(pipe[i].skull*(33/23));
  				if (pipe[i].top<=20)
  				      pipe[i].top+=20;
			}
			socket.emit('rankpipe', pipe);
			time=300;
			setTimeout(()=>{
				rank=false;
				io.emit('time', rank, time, num);
				arr=[];
				for (var i in score){
					arr.push(score[i]);
				}
				arraySort(arr,'high');
				for (var i in arr){
					num--;
					io.to(arr[i].id).emit('done',num+1,arr[i].high);
					delete score[i];
				}
				num=0;
			},300000);
		}	
	});
});

http.listen(port, function(){
	console.log('listening on *'+port);
});
setInterval(()=>{
	if (rank)
		time--;
	else
		time=300;
	if (time<0)
		time=-1;
	console.log(score);
},1000);