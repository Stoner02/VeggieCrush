'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({
  pseudoBuyer: {
    type: String,
    required: ''
  },
  pseudoSeller: {
    type: String,
    required: ''
  },
  potion1: {
	  type: Number,
	  required: ''
  },
  potion2: {
	  type: Number,
	  required: ''
  },
  potion3: {
	  type: Number,
	  required: ''
  },
  potion4: {
	  type: Number,
	  required: ''
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);