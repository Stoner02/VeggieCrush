'use strict';
module.exports = function(app) {
	
	var avatar = require('../controllers/avatarController');

	// -----------------------------------
	// avatar Routes
	// -----------------------------------
	app.route('/avatars/:avatarPseudo')
		.get(avatar.check_login)
		
	app.route('/avatars')
		.get(avatar.list_all_avatars)
		.post(avatar.create_an_avatar);

	app.route('/avatars/:avatarId')
		.get(avatar.read_an_avatar)
		.put(avatar.update_an_avatar)
		.delete(avatar.delete_an_avatar);

	app.route('/avatars/checkpseudo/:avatarPseudo')
		.get(avatar.check_pseudo)
	
	app.route('/avatars/:avatarPseudo/argent')
		.get(avatar.check_argent)
	
	app.route('/avatars/newuser')
		.post(avatar.new_user)
	
	app.route('/avatars/:avatarPseudo/connecte')
		.get(avatar.check_connecte)
	
	app.route('/avatars/coords')
		.get(avatar.get_coord)

	app.route('/avatars/:avatarPseudo/potions')
		.get(avatar.get_potions)
		
	app.route('/avatars/:avatarPseudo/transaction')
		.put(avatar.buy_potion)
			
		
};