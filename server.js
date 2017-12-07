var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	Task = require('./api/models/distModel'), 		//created model loading here
	Task2 = require('./api/models/distConnect'),	//created model loading here
	Task3 = require('./api/models/potion'), 		//created model loading here
	passport = require('passport'),					//authentication middleware
	LocalStrategy = require('passport-local').Strategy; //for authenticating with a username and password
	bodyParser = require('body-parser');

// mongoose instance connection url connection test
mongoose.connect('mongodb://localhost/distdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/distRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);


//---------------------------------------
// Serveur WEB
//---------------------------------------

var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var app2Func = connect().use(serveStatic(__dirname + '/web/'));
var app2 = app2Func.listen(8080, function () {
	console.log('Server running on 8080...');
});


var io = require("socket.io");
var io = io.listen(app2);
var Avatar = mongoose.model('Avatars');
var argentDepart = 1000;
var moment = require('moment');
var timezone = require('moment-timezone');

module.exports.io = io;

io.sockets.on('connection', function (socket) {
	var pseudoSocket = 'STONER'; //todo Recup depuis la session
	var coordSocketx = 0;
	var coordSockety = 0;
	var bonusHero = 0;
	var bonusVillage1 = 0;
	var bonusVillage2 = 0;
	var bonusVillage3 = 0;
	var bonusVillage4 = 0;
	var malusRTS = 0;
	var connecte = false;
 
	socket.nickname = 'STONER'; //todo Recup depuis la session

	socket.on('inscription', function (pseudo, mdp) {
		console.log('INSCRIPTION' + pseudo + mdp);
		Avatar.findOne({ pseudo: pseudo.toUpperCase() }, function (err, Av) {
			if (Av == null) {

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
			} else {
				socket.emit('pseudoPris');
			}
		});
	});


	socket.on('connectTry', function (pseudo, mdp) {

		console.log(pseudo + " essaye de se connecter" + " mdp: " + mdp);

		Avatar.findOne({ pseudo: pseudo.toUpperCase(), mdp: mdp }, function (err, Av) {
			if (Av == null) {
				socket.emit('erreurConnexion', 'Combinaison pseudo/mot de passe inconnue');
				console.log("Erreur connexion.")
			} else {
				pseudoSocket = pseudo.toUpperCase();
				connecte = true;
				connectionState(connecte);
				socket.emit('connecte');		
			}
		});
	});


	//----------------------------------------
	// Change connecte state of the user
	//----------------------------------------
	function connectionState(state){
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ connecte: state }, function (err, Av) { });
	}


	//----------------------------------------
	// Disconnect the user
	//----------------------------------------
	socket.on('userDisconnect', function () {
		console.log('disconnect: ' + pseudoSocket);
		connectionState(false);
		socket.disconnect(0);
	});


	//----------------------------------------
	// Send all potions
	//----------------------------------------
	socket.on('getAllPopo', getAllPopo);

	function getAllPopo() {
		
		Avatar.findOne({pseudo: pseudoSocket}, function(err, Av) {
			if(Av != null){
				var _mmo1 = Av.potionMMO1;
				var _mmo2 = Av.potionMMO2;
				var _mmo3 = Av.potionMMO3;
				var _mmo4 = Av.potionMMO4;

				var _rts1 = Av.potionRTS1;
				var _rts2 = Av.potionRTS2;
				var _rts3 = Av.potionRTS3;
				var _rts4 = Av.potionRTS4;

				var _ville1 = Av.potionVille1;
				var _ville2 = Av.potionVille2;
				var _ville3 = Av.potionVille3;
				var _ville4 = Av.potionVille4;

				socket.emit("receiveAllPopo", {
					mmo1: _mmo1, mmo2: _mmo2, mmo3: _mmo3, mmo4: _mmo4,
					rts1: _rts1, rts2: _rts2, rts3: _rts3, rts4: _rts4,
					ville1: _ville1, ville2: _ville2, ville3: _ville3, ville4: _ville4
				});
			}
		});
	}


	//----------------------------------------
	// Send money
	//----------------------------------------
	socket.on('getMoneyExp', function () {
		console.log('getMoneyExp');
		updateMoneyExp();
	})

	function updateMoneyExp(){
		Avatar.findOne({pseudo: pseudoSocket}, function(err, Av) {
			if(Av != null){
				socket.emit("updateExperienceArgent", {argent: Av.argent, exp: Av.experience});
			}
		});
	}

	//----------------------------------
	// Update bonus
	//----------------------------------
	function updateBonus(bonus){
		if(Av != null){
			socket.emit("updateBonus", {bonus: bonus});
		}
	}

	//----------------------------------
	// Get coordinates
	//----------------------------------
	socket.on('getCoord', function () {
		Avatar.findOne({pseudo: pseudoSocket}, function(err, Av) {
			if(Av != null){
				socket.emit("updateCoord", {x: Av.coordx, y: Av.coordy});
			}
		});
	})

	//----------------------------------
	// Set coordinates
	//----------------------------------
	function setCoord(x, y){
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ coordx: x, coordy: y }, function (err, Av) { });
	}
	
//******************************TO DOOOOOOOOOOOOOOOOOO *******************************/
//******************************TO DOOOOOOOOOOOOOOOOOO *******************************/

	//----------------------------------
	// CHANGER POSITION
	//----------------------------------
	socket.on('changePosition', function (data) {

		var x = data.xCoord;
		var y = data.yCoord;

		if(x >= 0 && y >= 0){
			console.log('changementPosition de ' + pseudoSocket + ' en ' + x + ' ' + y);
			setCoord(x, y);
			//TODO PREVENIR TOUT LE MONDE DU CHANGEMENT DE POSITION
	
			//TODO updateBonus si besoin

			//TODO regarder si on est dans un village ou un BG
		}

	});

	
	//----------------------------------
	// RENTRER DANS VILLAGE
	//----------------------------------
	socket.on('updateVillage', function (data) {
		
		var village = data.village;

		if(village != null){
			console.log(pseudoSocket + ' rentre dans le village: ' + village);
			
			//TODO récupérer les coordonnées du village et setCoord(x,y)
	
			//TODO updateBonus si besoin
		}
	});


	//----------------------------------
	// GET VILLAGES
	//----------------------------------
	socket.on('getVillages', function () {
		
		//TODO RECUPERER LES VILLAGES
		var arrayVillages = ["Dalaran", "Orgrimar", "Stormwind"];
		socket.emit("receiveVillages", {villages: arrayVillages});
	})


	//----------------------------------
	// RENTRER DANS BG
	//----------------------------------
	socket.on('updateBg', function (data) {
		
		var bg = data.bg;

		if(bg != null){
			console.log(pseudoSocket + ' rentre dans le BG: ' + bg);
			
			//TODO récupérer les coordonnées du village et setCoord(x,y)
	
			//TODO updateBonus si besoin
		}
	});


	//----------------------------------
	// GET BG
	//----------------------------------
	socket.on('getBg', function () {
		
		//TODO RECUPERER LES BG
		var arrayBg = ["Tarides", "Dorotar", "MorteMine"];
		socket.emit("receiveBg", {bg: arrayBg});
	})

//****************************** END (todo) *******************************/
//****************************** END (todo) *******************************/



	socket.on('addPotionMMO1', function () {
		console.log('ajout potion MMO');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionMMO2', function () {
		console.log('ajout potion MMO');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionMMO3', function () {
		console.log('ajout potion MMO');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionMMO4', function () {
		console.log('ajout potion MMO');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionRTS1', function () {
		console.log('ajout potion RTS');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionRTS1: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionRTS2', function () {
		console.log('ajout potion RTS');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionRTS2: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionRTS3', function () {
		console.log('ajout potion RTS');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionRTS3: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionRTS4', function () {
		console.log('ajout potion RTS');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionRTS4: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionVille1', function () {
		console.log('ajout potion ville');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionVille1: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionVille2', function () {
		console.log('ajout potion ville');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionVille2: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionVille3', function () {
		console.log('ajout potion ville');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionVille3: 1 } }, { new: true }, function (err, Av) {});
			getAllPopo();
	});

	socket.on('addPotionVille4', function () {
		console.log('ajout potion ville');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionVille4: 1 } }, { new: true }, function (err, Av) {;});
			getAllPopo();
	});

	socket.on('changeCoord', function (x, y) {
		console.log('Changement coordonnées');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ coordx: x, coordy: y }, { new: true }, function (err, Av) { });
	});

	socket.on('changeBataille', function (x, y) {
		console.log('Changement Bataille');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ coordx: x, coordy: y }, { new: true }, function (err, Av) { });
	});

	socket.on('changeVillage', function (nomVillage) {
		console.log('Changement Village');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ coordx: x, coordy: y }, { new: true }, function (err, Av) { });
	});

});








