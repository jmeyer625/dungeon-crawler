var Map = function(size, value) {
	this.size = size || 3;
	value = value || null;
	this.arr = [];
	for(var i=0; i<this.size; i++) {
		var row = [];
		for(var j=0; j<this.size; j++) {
			row.push(value);
		}
		this.arr.push(row);
	}
	this.currentRoom = {x:0,y:0};
}
Map.prototype.insert = function(room,x,y){
	if(y > this.size) {
		y = y % this.size;
	}
	if(x > this.size) {
		x = x % this.size;
	}
	if(y < 0) {
		y = this.size-1;
	}
	if(x < 0) {
		x = this.size-1;
	}
	this.arr[y][x] = room;
}
Map.prototype.changeRooms = function(dir){
	var currentX = this.currentRoom.x;
	var currentY = this.currentRoom.y;
	console.log(currentY,this.arr.length-1)
	if(dir==='up') {
		if (currentY<this.arr.length-1){
			this.arr[currentY+1][currentX].drawRoom();
			this.currentRoom.y += 1;
		}
	}
	if(dir==='down') {
		if(currentY>0){
			this.arr[currentY-1][currentX].drawRoom();
			this.currentRoom.y -= 1;
		}
	}
	if(dir==='left') {
		if(currentX>0){
			this.arr[currentY][currentX-1].drawRoom();
			this.currentRoom.x -= 1;
		}
	}
	if(dir==='right') {
		if(currentX<this.arr[0].length-1){
			this.arr[currentY][currentX+1].drawRoom();
			this.currentRoom.x += 1;
		}
	}
}

var Room = function(){
	this.monsters = [],
	this.items = [],
	this.floor = 'images/wood-floor-2.png'
}
Room.prototype.drawRoom = function(){
	$('#view').html(roomTemplate(this));
}
var roomTemplate = Handlebars.compile($('#roomTemplate').html());

var Player = function(){
	this.inventory = [],
	this.health = 100,
	this.strength = 5,
	this.image = 'images/cat_512.png'
}
Player.prototype.drawPlayer = function(){
	$('.room').html(playerTemplate(this));
}
var playerTemplate = Handlebars.compile($('#playerTemplate').html());

var World = function(){
	this.player = null,
	this.map = new Map(),
	this.items = [],
	this.monsters = [],
	this.rooms = []
}
World.prototype.init = function(numRooms){
	var floors = ['images/clover-1.png','images/paving-5.png','images/wood-floor-2.png'];
	for (var i=0; i<numRooms; i++){
		var newRoom = new Room();
		newRoom.floor = floors[i];
		this.rooms.push(newRoom);
	}
	for (var i=0; i<this.rooms.length;i++) {
		this.map.insert(this.rooms[i],i,0);
	}
	this.player = new Player()

}
World.prototype.drawWorld = function(){
	for (var i=0; i<this.rooms.length; i++) {
		roomTemplate(room);
	}
}

var world = new World();
world.init(3);
world.rooms[0].drawRoom();
world.player.drawPlayer();


Mousetrap.bind('up',function(e){
	world.map.changeRooms('up');
	world.player.drawPlayer();
})

Mousetrap.bind('down',function(){
	world.map.changeRooms('down');
	world.player.drawPlayer();
})
Mousetrap.bind('right',function(){
	world.map.changeRooms('right');
	world.player.drawPlayer();
})
Mousetrap.bind('left',function(){
	world.map.changeRooms('left');
	world.player.drawPlayer();
})
