var ok=false;
socket.on('online', data=>{
	$('#online').html(data);
});

var mau='green';
socket.on('pong', data=>{
	ok=false;
	var now=Date.now();
	if (now-data<=60) mau='green'; else
	if (now-data<=500) mau='yellow'; else mau='red';
	if (now-data>999) data=now-999;
    $('#ping1').html("Ping: "+(now-data)+'ms');
    $('#ping1').css('color', mau);
});
$('#canvas').click(()=>{
	$('#tap').fadeOut(2000);
})
$('#rank').click(function(){
	ranking=true;
	if (regis==false){
		socket.emit('regis');
		regis=true;
	}
})
ranking=true;
socket.on('time', (data,data2)=>{
	if (data){
		timer=data2;
	} else {
		timer=-2;
	}

});
setInterval(function(){
	socket.emit('check');
},5000);
socket.emit('check');
setInterval(()=>{
	timer--;
	if (timer>-1)
		$('#rank').val('RANK - ['+timer+'s]');
	else
		$('#rank').val('RANK');
},1000);