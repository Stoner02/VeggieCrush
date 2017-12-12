'use strict';
module.exports = function(app) {
	
	var avatar = require('../controllers/avatarController');

	// -----------------------------------
	// avatar Routes
	// -----------------------------------
	app.route('/avatars/login/:avatarPseudo')
		// EXEMPLE: http://localhost:3000/avatars/login/Azhenot38/?mdp=12345
		.get(avatar.check_login)
		
	app.route('/avatars/all')
		// EXEMPLE: http://localhost:3000/avatars/all
		.get(avatar.list_all_avatars)
		.post(avatar.create_an_avatar);

	app.route('/avatars/:avatarId/profile')
		// EXEMPLE: http://localhost:3000/avatars/Azhenot/profile
		.get(avatar.read_an_avatar)
		.put(avatar.update_an_avatar)
		.delete(avatar.delete_an_avatar);

	app.route('/avatars/:avatarPseudo/checkPseudo')
		// EXEMPLE: http://localhost:3000/avatars/Azhenot38/checkPseudo
		.get(avatar.check_pseudo)
	
	app.route('/avatars/:avatarPseudo/argent').
		// EXEMPLE: http://localhost:3000/avatars/Azhenot38/argent
		.get(avatar.check_argent)
	
	app.route('/avatars/newuser')
		.post(avatar.new_user)
	
	app.route('/avatars/:avatarPseudo/connecte')
		// EXEMPLE : http://localhost:3000/avatars/Azhenot38/connecte
		.get(avatar.check_connecte)
	
	app.route('/avatars/coords')
		// EXEMPLE: http://localhost:3000/avatars/coords
		.get(avatar.get_coord)

	app.route('/avatars/:avatarPseudo/potions')
		// EXEMPLE: http://localhost:3000/avatars/Azhenot38/potions/?type=RTS
		.get(avatar.get_potions)
		
	app.route('/avatars/potions')
		// EXEMPLE: http://localhost:3000/avatars/potions/?type=RTS
		.get(avatar.get_potions_type)
		
	app.route('/avatars/:avatarPseudo/transaction')
		// EXEMPLE: http://localhost:3000/avatars/Azhenot/transaction/?type=RTS
		.put(avatar.buy_potion)
			
		
};