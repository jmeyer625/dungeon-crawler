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
Map.prototype.insert = function(room,y,x){
	this.arr[y][x] = room;
}
Map.prototype.changeRooms = function(dir){
	var currentX = this.currentRoom.x;
	var currentY = this.currentRoom.y;
	var that = this;
	if(dir==='up') {
		if (currentY<this.arr.length-1){
			$('.room').animate({top:'1000px'},function(){
				that.arr[currentY+1][currentX].drawRoom();
			})
			this.currentRoom.y += 1;
		}
	}
	if(dir==='down') {
		if(currentY>0){
			$('.room').animate({bottom:'1000px'},function(){
				that.arr[currentY-1][currentX].drawRoom();
			})
			this.currentRoom.y -= 1;
		}
	}
	if(dir==='left') {
		if(currentX>0){
			$('.room').animate({left:'1000px'},function(){
				that.arr[currentY][currentX-1].drawRoom();
			})
			this.currentRoom.x -= 1;
		}
	}
	if(dir==='right') {
		if(currentX<this.arr[0].length-1){
			$('.room').animate({right:'1000px'},function(){
				that.arr[currentY][currentX+1].drawRoom();
			})
			this.currentRoom.x += 1;
		}
	}
}

var Item = function(title,consumable,effect,change,image,ind){
	this.title = title;
	this.type = 'item';
	this.id = ind;
	this.consumable = consumable;
	this.effect = effect;
	this.change = change;
	this.image = image;
	this.top = Math.floor(Math.random()*600)+'px';
	this.left = Math.floor(Math.random()*600)+'px';
}

var Room = function(){
	this.monsters = [];
	this.items = [];
	this.floor = 'images/wood-floor-2.png';
}
Room.prototype.makeMonsters = function(num) {
	for (var i=0; i<num; i++) {
	this.monsters.push(new Monster(i+1,i))
	}
}
Room.prototype.makeItems = function(num) {
	for (var i=0; i<num; i++) {
		this.items.push(new Item('Potion',true,'health',20,'images/potion.png',i));
		this.items.push(new Item('Poison',true,'health',-10,'images/poison.png',i+num));
	}
}
Room.prototype.drawRoom = function(){
	var roomElem = (roomTemplate(this));
	$('#view').html(roomTemplate(this));
	for (var i=0; i<this.items.length; i++){
		this.addItem(this.items[i], roomElem);
	}
	for (var i=0; i<this.monsters.length; i++){
		this.addItem(this.monsters[i], roomElem);
	}
	world.player.drawPlayer();
	return roomElem
	
}
var roomTemplate = Handlebars.compile($('#roomTemplate').html());
Room.prototype.addItem = function(item,elem){
	if(item) {
		elem.append(itemTemplate(item));
	}
}
var itemTemplate = Handlebars.compile($('#itemTemplate').html());

var Player = function(){
	this.inventory = [];
	this.health = 100;
	this.strength = 5;
	this.image = 'images/cat_512.png';
	this.weapon = {power:10};
}
Player.prototype.drawPlayer = function(){
	$('.room').append(playerTemplate(this));
}
var playerTemplate = Handlebars.compile($('#playerTemplate').html());
Player.prototype.addToInventory = function(item){
	this.inventory.push(item);
	thisRoom = world.getCurrentRoom();
	thisRoom.items[thisRoom.items.indexOf(item)] = null;
}
Player.prototype.use = function(item){
	this[item.effect] += item.change;
	this.inventory.splice(this.inventory.indexOf(item),1);
}
Player.prototype.showInventory = function(){
	$('body').prepend(inventoryTemplate(this));
}
var inventoryTemplate = Handlebars.compile($('#inventoryTemplate').html());

var Monster = function(num,ind){
	this.type = 'monster';
	this.id = ind;
	this.health = 75;
	this.strength = 3;
	this.image = 'images/monster'+num+'.png'
	this.top = Math.floor(Math.random()*600)+'px';
	this.left = Math.floor(Math.random()*600)+'px';
}

var World = function(){
	this.player = null;
	this.map = new Map();
	this.items = [];
	this.monsters = [];
	this.rooms = [];
}
World.prototype.init = function(numRooms){
	var floors = ['images/clover-1.png','images/paving-5.png','images/wood-floor-2.png'];
	for (var i=0; i<numRooms; i++){
		var newRoom = new Room();
		newRoom.floor = floors[Math.floor(Math.random()*3)];
		newRoom.makeMonsters(3);
		newRoom.makeItems(3);
		this.rooms.push(newRoom);
	}
	var x = 0, y=0;
	for (var i=0; i<this.rooms.length;i++) {
		this.map.insert(this.rooms[i],y,x);
		this.rooms[i].x = x;
		this.rooms[i].y = y;
		x++;
		if(x>=this.map.arr[0].length) {
			y++;
			x = 0;
		}
	}
	this.player = new Player()

}
World.prototype.getCurrentRoom = function(){
	return this.map.arr[this.map.currentRoom.y][this.map.currentRoom.x];
}
World.prototype.battle = function(player, monster) {
	var thisRoom = this.getCurrentRoom();
	var playerTurn = true;
	var battle = true;
	setTimeout(function(){
		attack(player, monster, playerTurn, thisRoom);
	},1000);
	
}

var attack = function(player, monster, playerTurn, thisRoom){
	if (playerTurn) {
		var damage = player.strength*player.weapon.power;
		console.log('You hit the monster for '+damage+' damage!');
		monster.health -= damage;
		playerTurn = false;
	} else {
		var damage = monster.strength * 6;
		console.log('The monster hit you for '+damage+' damage!');
		player.health -= damage;
		playerTurn = true;
	}
	if (monster.health<=0) {
		thisRoom.monsters[thisRoom.monsters.indexOf(monster)] = null;
		$('.monster[data-id='+monster.id+']').remove();
		console.log('you win');
	} else if (player.health<=0) {
		console.log('you died');
	} else {
		setTimeout(function(){
			attack(player, monster, playerTurn, thisRoom);
		}, 1000);
	}
}

var monsterMenu = '<div class="monsterMenu">'+
		'<button class="attack">Attack</button>'+
		'<button class="examine">Examine</button>'+
	'</div>'

var world = new World();
world.init(9);
world.rooms[0].drawRoom();

$(document).on('click','.monster',function(){	
	$(this).append($(monsterMenu).css('display','inline-block'));

})

$(document).on('click','.attack',function(){
	var thisMonster = world.getCurrentRoom().monsters[$(this).parent().parent().attr('data-id')];
	$(this).closest('.monsterMenu').hide();
	world.battle(world.player,thisMonster);
	return false;
})

$(document).on('click','.examine',function(){
	var thisMonster = world.getCurrentRoom().monsters[$(this).parent().parent().attr('data-id')];
	console.log(thisMonster.type);
	return false;
})

$(document).on('click','.item',function(){
	var thisItem = world.getCurrentRoom().items[$(this).attr('data-id')];
	world.player.addToInventory(thisItem);
	$(this).remove();
})

$(document).on('click','#openInventory',function(){
	world.player.showInventory();
})

$(document).on('click', '#inventory img', function(){
	var thisItem = world.player.inventory[$(this).attr('data-id')];
	world.player.use(thisItem);
})


Mousetrap.bind('up',function(e){
	world.map.changeRooms('up');
})

Mousetrap.bind('down',function(){
	world.map.changeRooms('down');
})
Mousetrap.bind('right',function(){
	world.map.changeRooms('right');
})
Mousetrap.bind('left',function(){
	world.map.changeRooms('left');
})
