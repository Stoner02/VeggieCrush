'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConnectSchema = new Schema({
  pseudo: {
    type: String
  },
  psswd: {
	  type: String
  },
  argent: {
	  type: Number
  },
  date: {
	  type: String
  }
});

module.exports = mongoose.model('Connect', ConnectSchema);