function preload(){
	var img=loadImage('sketch/image/t.jpg');
}
function setup(){
	createCanvas(1,1);
	var Width=window.innerWidth;
	var Height=window.innerHeight;
	var canv = createCanvas(Width, Height);
	canv.parent("canvas");

	setInterval(()=>$('#ping2').html("FPS: "+Math.floor(frameRate())),1000);
	setInterval(()=>{
		if (ok==false){
			socket.emit('latency', Date.now());
			ok=true;
		}
	},1000);
}
function draw(){
	background('gray');
	if (focused=== false){
		clearTimeout(timeout);
		timeout=setTimeout(function(){
			socket.emit('latency', Date.now());
    	},500);
	} 
}