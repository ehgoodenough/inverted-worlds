var GameState = 
{
	score: 0,
	maxscore: 0,
	
	preload: function()
	{
		level.preload();
		player.preload();
		
		game.load.image("images/portal.png", "images/portal.png");
		game.load.image("images/star.png", "images/star.png");
	},
	
	create: function()
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = GRAVITY;
		game.physics.arcade.TILE_BIAS = 27;
		
		level.create();
		player.create();
		
		this.maxscore = level.stars.length;
	},
	
	update: function()
	{
		game.physics.arcade.collide(player.sprite, level.tiles);
		
		player.update();
		
		level.update();
		
		game.physics.arcade.overlap(player.sprite, level.stars, function(player, star)
		{
			star.kill();
			GameState.score += 1;
		});
		
		game.physics.arcade.overlap(player.sprite, level.portals, function(player_sprite, portal_sprite)
		{
			player_sprite.body.x = portal_sprite.tx;
			player_sprite.body.y = portal_sprite.ty;
			
			level.toggleWorld();
		});
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC))
		{
			try
			{
				require("nw.gui").App.quit();
			}
			catch(error)
			{
				//then you are not in the nw-app.
			}
		}
	}
};