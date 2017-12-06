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

// mongoose instance connection url connection
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

io.sockets.on('connection', function (socket) {
	var pseudoSocket = 'zeroPseudo';
	var coordSocketx = 0;
	var coordSockety = 0;
	var bonusHero = 0;
	var bonusVillage1 = 0;
	var bonusVillage2 = 0;
	var bonusVillage3 = 0;
	var bonusVillage4 = 0;
	var malusRTS = 0;
	var connecte = false;

	/*
	function showPseudo() {
		console.log(pseudoSocket);
	}
	setInterval(showPseudo, 5000);
	*/

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
				pseudoSocket = pseudo;
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


	socket.on('addPotionMMO1', function () {
		console.log('ajout potion' + pseudoSocket);
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionMMO2', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionMMO3', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionMMO4', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionRTS1', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionRTS2', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionRTS3', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionRTS4', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionVille1', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionVille2', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionVille3', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) { });
	});

	socket.on('addPotionVille4', function () {
		console.log('ajout potion');
		Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
			{ $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) { });
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








