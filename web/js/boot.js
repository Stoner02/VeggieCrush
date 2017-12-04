var Boot = function(game){};
  
Boot.prototype = {

	preload: function(){
	},
	
  	create: function(){
		// controls how the game is scaled when NOT in full screen mode.
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resize ok mais faut changer les tailles

		this.game.state.start("Preload");
	}
}