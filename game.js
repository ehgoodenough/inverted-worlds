var WIDTH = 640, HEIGHT = 480;

var level, layer, player, stars, cursors, ui, score = 0;

var jumpstate = {
	height: 0,
	again: true
};
var JUMP_FORCE = 100;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tiles", "tiles.png");
		game.load.image("player", "player.png");
		game.load.image("star", "star.png");
	},
	
	create: function()
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 200;
		
		game.stage.backgroundColor = "#787878";
		
		level = game.add.tilemap("level");
		level.addTilesetImage("tiles", "tiles");
		level.setCollision(1);
		
		layer = level.createLayer("FirstLayer");
		layer.resizeWorld();
		
		player = game.add.sprite(32*3, 32*(level.height - 5), "player");
		
		game.physics.enable(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = 500;
		player.body.linearDamping = 1;
		player.body.collideWorldBounds = true;
		
		game.camera.follow(player);
		//game.camera.y += 32*25;
		
		cursors = game.input.keyboard.createCursorKeys();
		
		stars = game.add.group();
		stars.enableBody = true;
		for(var i = 0; i < 60; i += 2)
		{
			var star = stars.create(i * 32, 32*(level.height - 8), "star");
			star.body.gravity.y = 1;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		
		ui = game.add.text(16, 16, "jump: 0", {fontSize: "32px", fill: "#000"});
		ui.fixedToCamera = true;
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(stars, layer);
		
		player.body.velocity.x = 0;
		
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -150;
		}
		else if(cursors.right.isDown)
		{
			player.body.velocity.x = 150;
		}
		
		if(player.body.onFloor())
		{
			jumpstate.height = 0;
			jumpstate.again = true;
		}
		
		if(this.input.keyboard.justPressed(Phaser.Keyboard.UP))
		{
			if(!player.body.onFloor())
			{
				if(jumpstate.again)
				{
					jumpstate.height = 2;
					jumpstate.again = false;
					player.body.velocity.y = -JUMP_FORCE;
				}
			}
		}
		else if(cursors.up.isDown)
		{
			if(player.body.velocity.y < 0)
			{
				if(jumpstate.height < 5)
				{
					player.body.velocity.y -= JUMP_FORCE;
					jumpstate.height++;
				}
			}
		}
		
		game.physics.arcade.overlap(player, stars, function(player, star)
		{
			star.kill();
			
			ui.text = "score: " + (score += 10);
		},
		null, this);
	},
	
	render: function()
	{
		//game.debug.bodyInfo(player, 32, 320);
	}
});