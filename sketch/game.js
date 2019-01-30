var piperank=[];
function preload(){
	bg=loadImage('sketch/image/bg.png');
	me=new Bird();
	skin=loadImage('sketch/image/bird.png');
	loss=loadImage('sketch/image/loss.png');
	pImage1=loadImage('sketch/image/pipe1.jpg');
	pImage2=loadImage('sketch/image/pipe2.jpg');
	deathimg=loadImage('sketch/image/skull.png');
}
function setup(){
	var canv = createCanvas(Width, Height);
	canv.parent("canvas");

	setInterval(()=>$('#ping2').html("FPS: "+Math.floor(frameRate())),1000);
	setInterval(()=>{
		if (ok==false){
			socket.emit('latency', Date.now());
			ok=true;
		}
	},1000);
	frameRate(60);
	$('#play').click(function(){
		ranking=false;
		percent=70;
		cong=false;
		me=new Bird();
		image(bg,0,0);
		image(skin,me.x,Height/2-50,me.tox,me.toy);
		$('#screen1').fadeOut(500,'linear',()=>{$('#canvas').fadeIn(500,'linear',()=>{setTimeout(()=>{thua=false},400);$('#tap').fadeIn()});});
	});

	socket.on('rankpipe', data=>{
		ranking=true;
		piperank=data;
		percent=70;
		cong=false;
		me=new Bird();
		image(bg,0,0);
		image(skin,me.x,Height/2-50,me.tox,me.toy);
		$('#screen1').fadeOut(500,'linear',()=>{$('#canvas').fadeIn(500,'linear',()=>{setTimeout(()=>{thua=false},400);$('#tap').fadeIn()});});
	})
	socket.on('done', (data,data2)=>{
		if (ranking){
			regis=false;
			thua=true;
			loser();
			ranking=false;
			alert("Congratulations! You got a "+data+" place with the score: "+data2);
			timer=300;
		}
	})
	noLoop();
}
function mousePressed() {
	if (click){
		me.fly();
		if (thua==false){
			loop();
		}
	}
}
function draw(){
	clear();
	pipefram++;
	if (pipefram>70){
		num++;
		if (num>1000)
			num=1;
		pipes.push(new Pipe());
		if (ranking){
			pipes[pipes.length-1]=Object.assign(pipes[pipes.length-1],piperank[num]);
		}
		pipefram=0;
	}
	image(bg,fram,0);
	image(bg,fram+1365,0);
	fram-=1;
	
	if (fram<-1365)
		fram=0;

	if (percent>90)
		cong=false;
	if (percent<40)
		cong=true;
	if (cong)
		percent+=0.0725;
	else
		percent-=0.0725;
	$('#defaultCanvas0').css('filter','brightness('+percent+'%)');
	if (fram==-1364)
		percent=70;
	if (focused === false){
		clearTimeout(timeout);
		timeout=setTimeout(function(){
			socket.emit('latency', Date.now());
    	},500);
	}
	for (var i in pipes){
		if (pipes[i].hit(me)){
			loser();
		}
		if ((pipes[i].x+pipes[i].w<0 && pipes[i].type!=1) || (pipes[i].x+pipes[i].skull<0 && pipes[i].type==2))
			pipes.splice(0,1);
			if (pipes[i].type!=1){
				if (me.x>pipes[i].x+pipes[i].w && pipes[i].scored==false){
					score++;
					$('#score').html(score);
					if (ranking) socket.emit('plus');
					pipes[i].scored=true;
				} 
			} else {
				if (me.x>pipes[i].x+pipes[i].skull && pipes[i].scored==false){
					score++;
					$('#score').html(score);
					if (ranking) socket.emit('plus');
					pipes[i].scored=true;
				}
				
			}
		pipes[i].di();
		pipes[i].draw();	
	}
	me.update();
	me.draw();
	if (me.y>height){
		loser()
	}
	if (thua){
		fram=0;
		image(loss,0,0,Width,Height);
	}
}