var serverr         = require('../../server');
var Avatar          = serverr.Avatar;
var request         = serverr.request;
var argentDepart    = 1000;
var moment          = require('moment');
var timezone        = require('moment-timezone');

var userServices    = require('./UserServices');
var moveServices    = require("./MoveServices");
var moneyServices   = require("./MoneyServices");
var potionsServices = require("./PotionsServices");

var services 		= require("./Services");
var querystring 	= require('querystring');

module.exports = {

	//------------------------------------
	// Inscrit le user dans notre BD s'il n'y est pas.
	// Si c'est la première fois qu'il s'inscrit dans "l'univers", son inscription est broadcast aux autres jeux.
	// Refuse l'inscription si le user existe déjà dans l'univers.
	//------------------------------------
	addUserInUniverse: function addUserInUniverse(_pseudo, _mdp, _socket){
		
		var socket = _socket;
		var pseudo = _pseudo;
		var money = 0;
		var mdp = _mdp;

		var alreadyExist = false;

		//-------------------------------------
		// Existence verification
		//-------------------------------------
		
		request('http://'+ services.IP_MMO  +':3000/users/'+ pseudo, function (error, response, body) {
			// Déjà inscrit chez MMO 
			if (response != null && response.statusCode == 200) {
				alreadyExist = true;
			} 
			request('http://'+ services.IP_RTS  +':3000/api/Players/'+ pseudo, function (error, response, body) {
				// Déjà inscrit chez RTS
				if (response != null && response.statusCode == 200) {
					alreadyExist = true;
				}
				request('http://'+ services.IP_FARMVILLAGE  +':3000/farmvillage/api/users/'+ pseudo, function (error, response, body) {
					// Déjà inscrit chez Farmville
					if (response != null && response.statusCode == 200) {
						alreadyExist = true; 
					}
				});
			});
			
			//-------------------------
			// Ajouter dans les autres jeux
			//-------------------------
			if(!alreadyExist){
				module.exports.addUserMMO(pseudo, mdp, moment().format("DD/MM/YY HH:MM:ss"), 0);
				module.exports.addUserRPG(pseudo, moment().format("DD/MM/YY HH:MM:ss"), 0, mdp);
				module.exports.addUserVille(pseudo, mdp, 0);
			}
			else{
				console.log("L'utilisateur est déjà inscrit sur un autre jeu.");
				socket.emit('alreadyExist');
			}
			module.exports.addUser(pseudo, mdp, socket);
		});

	},

	onInscription: function(_pseudo, _mdp, socket){
		var pseudo = _pseudo, mdp = _mdp;
		console.log('INSCRIPTION: ' + pseudo + " " + mdp);
		Avatar.findOne({ pseudo: pseudo.toUpperCase() }, function (err, Av) {
			if (Av == null) { 
				module.exports.addUserInUniverse(pseudo, mdp, socket);
			}
			else {
				socket.emit('pseudoPris');
			}
		});
	},

	onConnectTry: function (_pseudo, mdp, socket){
		var pseudo = _pseudo;
		console.log(pseudo + " essaye de se connecter" + " mdp: " + mdp);

		Avatar.findOne({ pseudo: pseudo.toUpperCase(), mdp: mdp }, function (err, Av) {
			if (Av == null) {

				var alreadyExist = false;
				//-------------------------------------
				// Existence verification
				//-------------------------------------
				request('http://'+ services.IP_MMO  +':3000/users/'+ pseudo, function (error, response, body) {
					// Déjà inscrit chez MMO 
					if (response != null && response.statusCode == 200) {
						alreadyExist = true;
					}
					request('http://'+ services.IP_RTS  +':3000/api/Players/'+ pseudo, function (error, response, body) {
						// Déjà inscrit chez RTS
						if (response != null && response.statusCode == 200) {
							alreadyExist = true;
						}
						request('http://'+ services.IP_FARMVILLAGE  +':3000/farmvillage/api/users/'+ pseudo, function (error, response, body) {	
						// Déjà inscrit chez Farmville
							if (response != null && response.statusCode == 200) {
								alreadyExist = true;
							}

							if(alreadyExist){
								module.exports.connectUser(pseudo, socket);
								module.exports.addUser(pseudo, mdp, socket);
							}
							else{
								socket.emit('erreurConnexion', 'Combinaison pseudo/mot de passe inconnue');
								console.log("Erreur connexion.");
							}
						});
	
					});
					
				});	
			}else {
				module.exports.connectUser(pseudo, socket);		
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
		var alreadyCon = false;

		//-------------------------------------
		// Vérifier si connecté ailleurs
		//-------------------------------------
		request('http://'+ services.IP_MMO  +':3000/users/'+ pseudo + '/isConnected', function (error, response, body) {

		// Déjà connecté chez MMO 
			if (response != null && response.statusCode == 200 && JSON.parse(response.body).connected == true) {
				alreadyCon = true;
			}

			request('http://'+ services.IP_FARMVILLAGE  +':3000/farmvillage/api/users/'+ pseudo +'/status', function (error, response, body) {
		
				// Déjà connecté chez Farmville
				if (response != null && response.statusCode == 200 && JSON.parse(response.body).connected == true) {
					alreadyCon = true; console.log("déjà coooo");
				}

				if(!alreadyCon)	{
					connecte = true;
					module.exports.connectionState(connecte, pseudo);
					socket.emit('connecte');
					console.log(pseudo + " s'est connecté");
				}
				else{
					socket.emit("erreurConnexion", "Déjà connecté sur un autre jeu.");
				}
			});
			
	});	
		
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
			module.exports.connectionState(false, socket.nickname);

			for (var socketId in serverr.io.sockets.sockets) {
				var pseudo = serverr.io.sockets.sockets[socketId].nickname;
				if(pseudo == socket.nickname){
					
					// PREVENIR DECONNEXION A HOWOB
					request.delete('http://'+ services.IP_MMO + ':3000/marchands/'+socket.nickname, {}, 
						function(err,httpResponse,body){
						if(httpResponse != null && httpResponse.statusCode == 200){
							console.log(socket.nickname.toUpperCase() + " Message deconnexion à MMO.");
						}
						else{
							console.log("Probleme de deconnexion " + socket.nickname.toUpperCase() + " dans MMO");	
						}
					});
					
					
					// PREVENIR QU'ON QUITTE LE VILLAGE
					request.delete('http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/towns/'+villagePosition+'/potions/'+socket.nickname, {
						}, 
						function(err,httpResponse,body){
						if(httpResponse != null && httpResponse.statusCode == 200){
							console.log(socket.nickname.toUpperCase() + " a quitté le village de farmvillage.");
						}
						else{
							console.log("Pas dans un village ou probleme dans insertion " + socket.nickname.toUpperCase() + " dans village");	
						}
					});
					
					
					
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


	addUserMMO: function (_pseudo, _mdp, _date, _money){


		var pseudo = _pseudo, mdp = _mdp;

		var form = {
	
		};
		
		var formData = querystring.stringify(form);
		var contentLength = formData.length;

		request({
			headers: {
			  'Content-Length': contentLength,
			  'Content-Type': 'application/x-www-form-urlencoded',
			  'username': pseudo.toUpperCase(),
			  'password' : mdp,
			  'date' : _date,
			  'money' : _money
			},
			uri: 'http://'+ services.IP_MMO + ':3000/users',
			body: formData,
			method: 'POST'
		  }, function (err, res, body) {
			if(res != null && res.statusCode == 200){
				console.log(pseudo.toUpperCase() + " ajouté dans MMO.");
			}
			else{
				console.log("Probleme dans insertion " + pseudo.toUpperCase() + " dans MMO");	
			}
		  });

	},

	addUserRPG: function (_user, _date, _argent, _passwd){
		var pseudo = _user;
		
		request.post('http://'+ services.IP_RTS + ':3000/api/Players', {
			form:{
				user: pseudo.toUpperCase(),
				date: _date,
				argent: _argent,
				passwd: _passwd}
			}, 
			function(err,httpResponse,body){
			if(httpResponse != null && httpResponse.statusCode == 200){
				console.log(pseudo.toUpperCase() + " ajouté dans RTS.");
			}
			else{
				console.log("Probleme dans insertion " + pseudo.toUpperCase() + " dans RTS");	
			}
		});
	},

	addUserVille: function (_user, _passwd, _argent){

		var pseudo = _user, mdp = _passwd;
		
				var form = {
					username: pseudo.toUpperCase(),
					gold: _argent,
					password: _passwd 
				};
				
				var formData = querystring.stringify(form);
				var contentLength = formData.length;
		
				request({
					headers: {
					  'Content-Length': contentLength,
					  'Content-Type': 'application/x-www-form-urlencoded'
					},
					uri: 'http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/users',
					body: formData,
					method: 'POST'
				  }, function (err, res, body) {
					if(res != null && res.statusCode == 200){
						console.log(pseudo.toUpperCase() + " ajouté dans FARMVILLE.");
					}
					else{
						console.log("Probleme dans insertion " + pseudo.toUpperCase() + " dans FARMVILLE");	
					}
				  });
	},

	
};
