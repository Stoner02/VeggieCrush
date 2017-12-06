'use strict';

var mongoose 	= require('mongoose');
	var Avatar 	= mongoose.model('Avatars');
	var Connect = mongoose.model('Connect');
	var Potion 	= mongoose.model('Potion');

var argentDepart 	= 1000;
var moment 				= require('moment');
var timezone 			= require('moment-timezone');


var Prix = {
	potionRTS1 : 1000,
	potionRTS2 : 500,
	potionRTS3 : 250,
	potionRTS4 : 100,
	potionMMO1 : 1000,
	potionMMO2 : 500,
	potionMMO3 : 250,
	potionMMO4 : 100,
	potionVille1 : 1000,
	potionVille2 : 500,
	potionVille3 : 250,
	potionVille4 : 100
};

//------------------------------------------
// Find all the avatars
//------------------------------------------
exports.list_all_avatars = function(req, res) {
  Avatar.find({}, function(err, Avatar) {
    if (err){
		res.send(err);
	}else{
		res.status(200).json(Avatar);
	}
  });
};

//------------------------------------------
// Create an Avatar
// If already exists, return 403
//------------------------------------------
exports.create_an_avatar = function(req, res) {

	var nomAvatar = req.body.pseudo.toUpperCase(); //attention si undefined... todo
	Avatar.findOne({'pseudo': nomAvatar}, function (err, Ava) {
    if (err){
		res.send(err)
	}
	else if(Ava != null){
		res.status(403).json({ message: 'Compte existe déjà' });
	}
	else{	
		  var new_avatar = new Avatar();
		  new_avatar.pseudo = req.body.pseudo.toUpperCase();
		  new_avatar.mdp = req.body.mdp;
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
		  
		  new_avatar.save(function(err, Av) {
			if (err){
				res.send(err);
			}else{
				res.status(200).json({ message: 'ok' });
			}
		  });
		}
	  });
};


exports.read_an_avatar = function(req, res) {
	Avatar.findById(req.params.avatarId, function(err, Avatar) {
    if (err){
		res.send(err);
	}else if(Avatar == null){
		res.status(404).json({ message: 'Not found' });
	}
	else{
		res.status(200).json(Avatar);
	}
  });
};

exports.update_an_avatar = function(req, res) {
	Avatar.findOneAndUpdate({pseudo: req.params.pseudo}, req.body, {new: true}, function(err, Avatar) {
    if (err){
		res.send(err);
	}else{
		res.status(200).json(Avatar);
	}
  });
};


exports.delete_an_avatar = function(req, res) {
	var nomAvatar = new String(req.params.avatarId);
	Avatar.remove({
		pseudo: nomAvatar.toUpperCase()
  }, function(err, Avatar) {
    if (err){
		res.send(err);
	}else{
		res.status(200).json({ message: 'Avatar successfully deleted' });
	}
	
  });
};

///////////////////////////////////
//REQUETES DE CONNEXION EXTERIEUR//
///////////////////////////////////

exports.check_pseudo = function(req, res) {
	var nomAvatar = req.params.avatarPseudo.toUpperCase();
	Avatar.findOne({ 'pseudo': nomAvatar }, function (err, Avatar) {
    if (err)
      res.send(err);
	if(Avatar == null){
		res.status(404).json({ message: 'pseudo introuvable' });
	}else if(Avatar != null){
		var new_connect = new Connect();
		new_connect.pseudo = Avatar.pseudo;
		new_connect.psswd = Avatar.mdp;
		new_connect.argent = Avatar.argent;
		new_connect.date = moment(Avatar.dateArgent).format('DD/MM/YY HH:mm:ss');
		res.status(200).json(new_connect);
	}
  });
  
};

exports.check_argent = function(req, res) {
	var nomAvatar = req.params.avatarPseudo.toUpperCase();
	Avatar.findOne({ 'pseudo': nomAvatar }, function (err, Avatar) {
    if (err)
      res.send(err);
	if(Avatar == null){
		res.status(404).json({ message: 'pseudo introuvable' });
	}else if(Avatar != null){
		var new_connect = new Connect();
		new_connect.pseudo = Avatar.pseudo;
		new_connect.argent = Avatar.argent;
		new_connect.date = moment(Avatar.dateArgent).format('DD/MM/YY HH:mm:ss');
		res.status(200).json(new_connect);
	}
  });
  
};

exports.new_user = function(req, res) {
	var nomAvatar = req.body.pseudo.toUpperCase();
	Avatar.findOne({'pseudo': nomAvatar}, function (err, Ava) {
    if (err){
		res.send(err)
	}
	else if(Ava != null){
		res.status(404).json({ message: 'Compte existe déjà' });
	}
	else{	
		  var new_avatar = new Avatar();
		  new_avatar.pseudo = req.body.pseudo.toUpperCase();
		  new_avatar.mdp = req.body.psswd;
		  new_avatar.argent = req.body.argent;
		  var lol = moment(req.body.date, 'DD/MM/YY HH:mm:ss', true).format();
		  console.log(""+lol);
		  new_avatar.dateArgent = Date.parse(moment(req.body.date, 'DD/MM/YY HH:mm:ss', true).format());
		  new_avatar.coordx = 0;
		  new_avatar.coordy = 0;
		  new_avatar.potionVille1 = 0;
		  new_avatar.potionVille2 = 0;
		  new_avatar.potionVille3 = 0;
		  new_avatar.potionVille4 = 0;
		  new_avatar.potionRTS1 = 0;
		  new_avatar.potionRTS2 = 0;
		  new_avatar.potionRTS3 = 0;
		  new_avatar.potionRTS4 = 0;
		  new_avatar.potionMMO1 = 0;  
		  new_avatar.potionMMO2 = 0;
		  new_avatar.potionMMO3 = 0;
		  new_avatar.potionMMO4 = 0;
		  new_avatar.experience = 0;
		  new_avatar.connecte = false;
		  
		  new_avatar.save(function(err, Av) {
			if (err){
				res.send(err);
			}else{
				res.status(200).json({ message: 'ok' });
			}
		  });
		}
	  });	
  
};

exports.check_connecte = function(req, res) {
	var nomAvatar = req.params.avatarPseudo.toUpperCase();
	Avatar.findOne({ 'pseudo': nomAvatar }, function (err, Avatar) {
    if (err)
		res.send(err);
	if(Avatar == null){
		res.status(404).json({ message: 'pseudo introuvable' });
	}
	else if(Avatar.connecte){
		res.status(200).json({ message: 'connecte' });
	}else if(!Avatar.connecte){
		res.status(200).json({ message: 'deconnecte' });
	}
  });
};

exports.get_coord = function(req, res){
	Avatar.find({'connecte': true}, function (err, Avatar) {
    if (err)
		res.send(err);
	if(Avatar == null){
		res.status(404).json({ message: 'aucun personnage connecte' });
	}
	else{
		var obj = {
			avatars: []
		};
		Avatar.forEach(function(av){		
			obj.avatars.push({pseudo: av.pseudo, coordx: av.coordx, coordy: av.coordy});
		});
		res.status(200).json(obj);
	}
  });	
}

exports.get_potions = function(req, res){
	var nomAvatar = req.params.avatarPseudo.toUpperCase();
	var type = req.query.type.toUpperCase();
	console.log(type);
	Avatar.findOne({'pseudo': nomAvatar}, function (err, Avatar) {
    if (err)
		res.send(err);
	if(Avatar == null){
		res.status(404).json({ message: 'Pseudo introuvable' });
	}
	else if(type == 'VILLAGE'){	
		var pot = new Potion();
		pot.pseudo = Avatar.pseudo;
		pot.potion1 = Avatar.potionVille1;
		pot.potion2 = Avatar.potionVille2;
		pot.potion3 = Avatar.potionVille3;
		pot.potion4 = Avatar.potionVille4;
		pot.potion1_prix = Prix.potionVille1;
		pot.potion2_prix = Prix.potionVille2;		
		pot.potion3_prix = Prix.potionVille3;
		pot.potion4_prix = Prix.potionVille4;

		res.status(200).json(pot);
	}else if(type == 'RTS'){		
		var pot = new Potion();
		pot.pseudo = Avatar.pseudo;
		pot.potion1 = Avatar.potionRTS1;
		pot.potion2 = Avatar.potionRTS2;
		pot.potion3 = Avatar.potionRTS3;
		pot.potion4 = Avatar.potionRTS4;
		pot.potion1_prix = Prix.potionRTS1;
		pot.potion2_prix = Prix.potionRTS2;		
		pot.potion3_prix = Prix.potionRTS3;
		pot.potion4_prix = Prix.potionRTS4;
		res.status(200).json(pot);
		
	}else if(type == 'MMO'){
		var pot = new Potion();
		pot.pseudo = Avatar.pseudo;
		pot.potion1 = Avatar.potionMMO1;
		pot.potion2 = Avatar.potionMMO2;
		pot.potion3 = Avatar.potionMMO3;
		pot.potion4 = Avatar.potionMMO4;
		pot.potion1_prix = Prix.potionMMO1;
		pot.potion2_prix = Prix.potionMMO2;		
		pot.potion3_prix = Prix.potionMMO3;
		pot.potion4_prix = Prix.potionMMO4;
		res.status(200).json(pot);
	}else{
		res.status(422).json({ message: 'Contenu du filtre incorrect' });
	}
  });	
}

exports.buy_potion = function(req, res) {
	var new_transaction = new Transaction(req.body);
	new_transaction.pseudoSeller = 	req.params.avatarPseudo.toUpperCase();
	var type = req.query.type.toUpperCase();
	if(type == 'MMO'){
		Avatar.findOneAndUpdate({pseudo: new_transaction.pseudoSeller, potionMMO1:{$gte: new_transaction.potion1}, potionMMO2:{$gte: new_transaction.potion2}, potionMMO3:{$gte: new_transaction.potion3}, potionMMO4:{$gte: new_transaction.potion4}},
			{ $inc: { potionMMO1: (-1)*new_transaction.potion1,
				potionMMO2: (-1)*new_transaction.potion2,
					potionMMO3: (-1)*new_transaction.potion3,
						potionMMO4: (-1)*new_transaction.potion4,
							argent: (new_transaction.potion1 * Prix.potionMMO1)+
							(new_transaction.potion2 * Prix.potionMMO2)+
							(new_transaction.potion3 * Prix.potionMMO3)+
							(new_transaction.potion4 * Prix.potionMMO4)},$set: { dateArgent: moment() }},
							{new: true}, function(err, Av) {
								
								if (err){
									res.send(err);
								}else if(Av == null){
									Avatar.findOne({'pseudo': new_transaction.pseudoSeller}, function (err, Ava) {
									if (err)
										res.send(err);
									if(Ava == null){
										res.status(404).json({ message: 'Pseudo introuvable' });
									}
									else{	
										res.status(404).json({ message: 'Pas assez de potions' });
									}
								  });	
								}else{
									res.status(200).json({ message: 'Transaction effectuée' });
								}
							});	
	}else if(type == 'RTS'){
		Avatar.findOneAndUpdate({pseudo: new_transaction.pseudoSeller, potionRTS1:{$gte: new_transaction.potion1}, potionRTS2:{$gte: new_transaction.potion2}, potionRTS3:{$gte: new_transaction.potion3}, potionRTS4:{$gte: new_transaction.potion4}},
		{ $inc: { potionRTS1: (-1)*new_transaction.potion1,
			potionRTS2: (-1)*new_transaction.potion2,
				potionRTS3: (-1)*new_transaction.potion3,
					potionRTS4: (-1)*new_transaction.potion4,
						argent: (new_transaction.potion1 * Prix.potionRTS1)+
						(new_transaction.potion2 * Prix.potionRTS2)+
						(new_transaction.potion3 * Prix.potionRTS3)+
						(new_transaction.potion4 * Prix.potionRTS4)},$set: { dateArgent: moment() }},
						{new: true}, function(err, Av) {
							
							if (err){
								res.send(err);
							}else if(Av == null){
								Avatar.findOne({'pseudo': new_transaction.pseudoSeller}, function (err, Ava) {
								if (err)
									res.send(err);
								if(Ava == null){
									res.status(404).json({ message: 'Pseudo introuvable' });
								}
								else{	
									res.status(404).json({ message: 'Pas assez de potions' });
								}
							  });	
							}else{
								res.status(200).json({ message: 'Transaction effectuée' });
							}
						  });	
	}else if(type == 'VILLAGE'){
		Avatar.findOneAndUpdate({pseudo: new_transaction.pseudoSeller, potionVille1:{$gte: new_transaction.potion1}, potionVille2:{$gte: new_transaction.potion2}, potionVille3:{$gte: new_transaction.potion3}, potionVille4:{$gte: new_transaction.potion4}},
		{ $inc: { potionVille1: (-1)*new_transaction.potion1,
			potionVille2: (-1)*new_transaction.potion2,
				potionVille3: (-1)*new_transaction.potion3,
					potionVille4: (-1)*new_transaction.potion4,
						argent: (new_transaction.potion1 * Prix.potionVille1)+
						(new_transaction.potion2 * Prix.potionVille2)+
						(new_transaction.potion3 * Prix.potionVille3)+
						(new_transaction.potion4 * Prix.potionVille4),
						experience: (new_transaction.potion1 * Prix.potionVille1)+
						(new_transaction.potion2 * Prix.potionVille2)+
						(new_transaction.potion3 * Prix.potionVille3)+
						(new_transaction.potion4 * Prix.potionVille4)},$set: { dateArgent: moment() }},
						{new: true}, function(err, Av) {
							
							if (err){
								res.send(err);
							}else if(Av == null){
								Avatar.findOne({'pseudo': new_transaction.pseudoSeller}, function (err, Ava) {
								if (err)
									res.send(err);
								if(Ava == null){
									res.status(404).json({ message: 'Pseudo introuvable' });
								}
								else{	
									res.status(404).json({ message: 'Pas assez de potions' });
								}
							  });	
							}else{
								res.status(200).json({ message: 'Transaction effectuée' });
							}
						  });	
	}else{
		res.status(422).json({ message: 'Contenu du filtre incorrect' });
	}
};

exports.check_login = function(req, res){
	var nomAvatar = req.params.avatarPseudo.toUpperCase();
	var mdp = req.query.mdp;
	console.log(nomAvatar + " " + mdp);
	Avatar.findOne({pseudo: nomAvatar, mdp: mdp}, function(err, Av) {

			if(Av == null){
				res.status(404).json('Introuvable');
			}else{
				res.status(200).json('Trouve');

			}
		});	
		
}



