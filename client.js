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
})

