var serverr         = require('../../server');
var Avatar          = serverr.Avatar;

var userServices    = require('./UserServices');
var moveServices    = require("./MoveServices");
var moneyServices   = require("./MoneyServices");
var potionsServices = require("./PotionsServices");

module.exports = {
	onInscription: function(_pseudo, _mdp, socket){
		var pseudo = _pseudo, mdp = _mdp;
		console.log('INSCRIPTION: ' + pseudo + " " + mdp);
		Avatar.findOne({ pseudo: pseudo.toUpperCase() }, function (err, Av) {
			if (Av == null) { 
				addUserInUniverse(pseudo, mdp, socket);
			}
			else {
				socket.emit('pseudoPris');
			}
		});
	},

	fonConnectTry: function (_pseudo, mdp, socket){
		var pseudo = _pseudo;
		console.log(pseudo + " essaye de se connecter" + " mdp: " + mdp);

		Avatar.findOne({ pseudo: pseudo.toUpperCase(), mdp: mdp }, function (err, Av) {
			if (Av == null) {

				var alreadyExist = false;
				//-------------------------------------
				// Existence verification
				//-------------------------------------
			/*	request('http://10.113.51.21:3000/users/'+ pseudo, function (error, response, body) {
					// Déjà inscrit chez MMO
					if (response != null && response.statusCode == 200) {
						alreadyExist = true;
					}
					request('???????????????????????/'+ pseudo, function (error, response, body) {
						// Déjà inscrit chez RTS
						if (response.statusCode == 200) {
							alreadyExist = true;
						}
						request('???????????????????????/'+ pseudo, function (error, response, body) {
							// Déjà inscrit chez Farmville
							if (response.statusCode == 200) {
								alreadyExist = true;
							}
						});
					});
					*/
					if(alreadyExist){
						connectUser(pseudo);
						addUser(pseudo, mdp, socket);
					}
					else{
						socket.emit('erreurConnexion', 'Combinaison pseudo/mot de passe inconnue');
						console.log("Erreur connexion.");
					}
			//	});	
			}else {
				connectUser(pseudo);		
			}
		});
	},

	onIsAllowedToPlay: function (_pseudo, _mdp, socket){
		var pseudo = _pseudo;
		var mdp = _mdp;

		var autorisation = false;

		if(pseudo != null && mdp != null){
			Avatar.findOne({ pseudo: pseudo.toUpperCase(), mdp: mdp, connecte: true }, function (err, Av) {
				if (Av != null) {
					autorisation = true;
					socket.nickname = pseudo.toUpperCase();
				} 
				socket.emit("getAutorisationCon", {autorisation: autorisation});
				potionsServices.getAllPopo(socket);
				moneyServices.updateMoneyExp(socket);
				moveServices.emitGetCoord(socket);
				moveServices.emitGetVillage(socket);
				moveServices.emitGetBg(socket);

			});
		}
		else{
			socket.emit("getAutorisationCon", {autorisation: autorisation});
			potionsServices.getAllPopo(socket);
			moneyServices.updateMoneyExp(socket);
			moveServices.emitGetCoord(socket);
			moveServices.emitGetVillage(socket);
			moveServices.emitGetBg(socket);

		}
	},
		
	connectUser: function (_pseudo, socket){
		var pseudo = _pseudo;
		connecte = true;
		connectionState(connecte, pseudo);
		socket.emit('connecte');
		console.log(pseudo + " s'est connecté");
	},

	//----------------------------------------
	// Change connecte state of the user
	//----------------------------------------
	connectionState: function (state, _pseudo){
		var pseudo = _pseudo.toUpperCase();
		Avatar.findOneAndUpdate({ pseudo: pseudo },
			{ connecte: state }, function (err, Av) { console.log(pseudo+" change son etant connecté en : " + state); });
	},

	onUserDisconnect: function (socket){
		if(socket.nickname != null){
			console.log('disconnect: ' + socket.nickname);
			connectionState(false, socket.nickname);

			for (var socketId in serverr.io.sockets.sockets) {
				var pseudo = serverr.io.sockets.sockets[socketId].nickname;
				if(pseudo == socket.nickname){
					socket.disconnect(socketId);
				}
			}
		}

		//	socket.disconnect(0);
	},

	addUser: function (pseudo, mdp, socket){
		console.log("Inscription de l'utilisateur.");
		var new_avatar = new Avatar();
		new_avatar.pseudo = pseudo.toUpperCase();
		new_avatar.mdp = mdp;
		new_avatar.argent = argentDepart;
		new_avatar.dateArgent = moment();
		new_avatar.coordx = 0;
		new_avatar.coordy = 0;
		new_avatar.potionVille1 = 50;
		new_avatar.potionVille2 = 50;
		new_avatar.potionVille3 = 50;
		new_avatar.potionVille4 = 50;
		new_avatar.potionRTS1 = 50;
		new_avatar.potionRTS2 = 50;
		new_avatar.potionRTS3 = 50;
		new_avatar.potionRTS4 = 50;
		new_avatar.potionMMO1 = 50;
		new_avatar.potionMMO2 = 50;
		new_avatar.potionMMO3 = 50;
		new_avatar.potionMMO4 = 50;
		new_avatar.experience = 0;
		new_avatar.connecte = false;

		new_avatar.save(function (err, Av) {
			if (err) {
			} else {
				socket.emit('inscritOk'); 
			}
		});
	},


	addUserMMO: function (_pseudo, _mdp){

		var pseudo = _pseudo, mdp = _mdp;
		request.post('http://10.113.51.21:3000/users', {
			form:{username:pseudo.toUpperCase(), password: mdp}}, function(err,httpResponse,body){
				if(httpResponse != null && httpResponse.statusCode == 200){
					console.log(pseudo.toUpperCase() + " ajouté dans MMO.");
				}
				else{
				console.log("Probleme dans insertion " + pseudo.toUpperCase() + " dans MMO");	
				}
	});
	},

	addUserRPG: function (){
	//todo
	},

	addUserVille: function (){
	//todo
	},

	//------------------------------------
	// Inscrit le user dans notre BD s'il n'y est pas.
	// Si c'est la première fois qu'il s'inscrit dans "l'univers", son inscription est broadcast aux autres jeux.
	// Refuse l'inscription si le user existe déjà dans l'univers.
	//------------------------------------
	addUserInUniverse: function (_pseudo, _mdp, _socket){

		var socket = _socket;
		var pseudo = _pseudo;
		var mdp = _mdp;

		var alreadyExist = false;

		//-------------------------------------
		// Existence verification
		//-------------------------------------
		//todo si le serveur n'existe pas ça prend 20ans à passer l'instruction...
		/*request('http://10.113.51.21:3000/users/'+ pseudo, function (error, response, body) {
			
			// Déjà inscrit chez MMO 
			if (response != null && response.statusCode == 200) {
				alreadyExist = true;
			}
			request('???????????????????????/'+ pseudo, function (error, response, body) {
				// Déjà inscrit chez RTS
				if (response.statusCode == 200) {
					alreadyExist = true;
				}
				request('???????????????????????/'+ pseudo, function (error, response, body) {
					// Déjà inscrit chez Farmville
					if (response.statusCode == 200) {
						alreadyExist = true;
					}
				});
			});
			*/
			//-------------------------
			// Ajouter dans les autres jeux
			//-------------------------
			if(!alreadyExist){
				addUserMMO(pseudo, mdp);
				addUserRPG(); 	//todo
				addUserVille(); //todo
			}
			else{
				console.log("L'utilisateur est déjà inscrit sur un autre jeu.");
				socket.emit('alreadyExist');
			}
			addUser(pseudo, mdp, socket);
		//});

	}
};
