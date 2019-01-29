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
socket.on('time', (data,data2,data3)=>{
	if (data){
		timer=data2;
	} else {
		timer=-2;
	}
	$('#rank').val('RANK ['+data3+' playing]');

});
setInterval(function(){
	socket.emit('check');
},5000);
socket.emit('check');
setInterval(()=>{
	timer--;
	if (timer>-1)
		$('#time').html('RANK - ['+timer+'s]');
	else
		$('#time').html('');
},1000);
socket.on('tab', data=>{
	var arr = [];
	var text2='<table border="0"><tr><th>RANK</th><th>NAME</th><th>SCORE</th></tr>';
  	for (var key in data) {
  	  	arr.push(data[key]);
  	}
  	var len=arr.length;
  	for (var i=arr.length-1; i>=0; i--) {
  		if (arr[i].id==socket.id)
  	  		text2=text2+'<tr><td>'+(len-i)+'</td><td>YOU</td><td>'+arr[i].high+'</td></tr>';
  	  	else
  	  		text2=text2+'<tr><td>'+(len-i)+'</td><td>'+arr[i].id+'</td><td>'+arr[i].high+'</td></tr>';
  	}
  	text2=text2+'</table>';
	$('#table').html(text2);
})
$(document).keydown(e=>{
	if (e.keyCode==192){
  		socket.emit('tab');
  		$('#table').slideDown(120);
  	}
})
$(document).keyup(e=>{
	if (e.keyCode==192){
  		socket.emit('tab');
  		$('#table').slideUp(200);
  	}
})
socket.on('online', data=>{
	$('#online').html('Online: '+data);
})
