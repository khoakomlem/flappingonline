function Bird(){
	this.tox=70;
	this.toy=40;
	this.weight=0.8;
	this.f=15;
	this.y=Height/2-50;
	this.x=60;
	this.vel=1;
	this.fly = function(){
		this.vel=-12;
		socket.emit('fly');
	}
	this.update = function(){
		this.y+=this.vel;
		this.vel+=this.weight;
    if (this.y<0){
      this.vel+=0.2;
      this.y=0;
    }
	}
	this.draw = function()
  	{
  	  	image(skin, this.x, this.y,this.tox,this.toy);
  	}
}

function Pipe()
{
	this.scored=false;
  this.up=boolean(Math.floor(Math.random()));
  this.top=random(height-200);
  if (this.top<=20)
        this.top+=20;
  this.bottom=this.top+180;
  this.w=50;
  this.x=screen.width+this.w;
  this.type = Math.floor((Math.random() * 3) + 1);
  if (this.type==3)
    this.type=2;
  this.skull = Math.floor(Math.random()*70)+60;
  this.skull2=Math.floor(this.skull*(33/23));
  this.draw = function()
  { 
    if (this.type!=1){
      image(pImage1, this.x, 0, this.w, this.top);
      image(pImage2, this.x-this.w/3+5.5, this.top-30);
    // alert(Height);
      image(pImage1, this.x, this.bottom, this.w, height-this.bottom);
      image(pImage2, this.x-this.w/3+5.5, this.bottom);
    } else {
      image(deathimg, this.x, this.top, this.skull, this.skull2);
      // console.log(1);
    }
  }
  this.di = function()
  {
    if (click) this.x-=5;
    if (this.type==1){
      if (this.top<1)
        this.up=false;
      
      if (this.top+this.skull2>height-1)
        this.up=true;

      if (this.up==true)
        this.top-=Math.floor((140-this.skull)/9) + 5;
      else
        this.top+=Math.floor((140-this.skull)/9) + 5;
    }
    // rect(bird.x, bird.y, bird.to, bird.to);
    // rect(this.x, 1, this.top, this.w);
  }
  this.hit = function(bird)
  {
    var doj;
    if (this.type!=1){
      	if (bird.y+5<this.top || bird.y+bird.toy-5>this.bottom)
      	{
      	    if (bird.x+bird.tox-5>this.x && bird.x+5<=this.x+this.w)
      	    {
      	    	if (click) bird.fly();
      	      	click=false;
      	    }
      	}
    }
    else{
      if (bird.y+bird.toy-20>this.top && bird.y+20<this.top+this.skull2){
        if (bird.x+bird.tox-20>this.x && bird.x+20<this.x+this.skull){
      	    if (click) bird.fly();
          	click=false;
        }
      }
    }
    return false; 
  }
}