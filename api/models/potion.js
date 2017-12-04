'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PotionSchema = new Schema({
 pseudo: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  potion1: {
	  type: Number,
	  required: 'coordonnée x'
  },
  potion1_prix: {
	  type: Number,
  },
  potion2: {
	  type: Number,
	  required: 'coordonnée y'
  },
  potion2_prix: {
	  type: Number,
  },
  potion3: {
	  type: Number,
	  required: 'coordonnée y'
  },
  potion3_prix: {
	  type: Number,
  },
  potion4: {
	  type: Number,
	  required: 'coordonnée y'
  },
  potion4_prix: {
	  type: Number,
  }
  
});

module.exports = mongoose.model('Potion', PotionSchema);