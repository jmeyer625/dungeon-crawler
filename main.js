var World = function(){
	this.player = [],
	this.rooms = [],
	this.items = [],
	this.monsters = []
}
World.prototype.init = function(numRooms){
	for (var i=0; i<numRooms; i++){
		var newRoom = new Room();
		this.rooms.push(newRoom);
	}
}
World.prototype.drawWorld = function(){
	for (var i=0; i<this.rooms.length; i++) {
		roomTemplate(room);
	}
}

var Room = function(){
	this.monsters = [],
	this.items = [],
	this.floor = 'images/wood-floor-2.png'
}
Room.prototype.drawRoom = function(){
	$('#view').append(roomTemplate(this));
}
var roomTemplate = Handlebars.compile($('#roomTemplate').html());

var Player = function(){
	inventory = [],
	health = 100,
	strength = 5,
	img = 'images/cat_512.png'
}

var world = new World();
world.init(3);
world.rooms[0].drawRoom();
