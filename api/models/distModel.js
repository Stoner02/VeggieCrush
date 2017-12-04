'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AvatarSchema = new Schema({
  pseudo: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  mdp: {
	  type: String,
	  required: 'mdp du user'
  },
  argent: {
	  type: Number,
	  required: 'argent du personnage'
  },
  dateArgent: {
	  type: Date,
	  required: 'date du montant'
  },
  experience: {
	  type: Number,
	  required: 'argent du personnage'
  },
  coordx: {
	  type: Number,
	  required: 'coordonnée x'
  },
  coordy: {
	  type: Number,
	  required: 'coordonnée y'
  },
  potionVille1: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionVille2: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionVille3: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionVille4: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionRTS1: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionRTS2: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionRTS3: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionRTS4: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionMMO1: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionMMO2: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionMMO3: {
	  type: Number,
	  required: 'quantite potion'
  },
  potionMMO4: {
	  type: Number,
	  required: 'quantite potion'
  },
  connecte: {
	  type: Boolean,
	  required: 'utilisateur connecte'
  }
});

module.exports = mongoose.model('Avatars', AvatarSchema);