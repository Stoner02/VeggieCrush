'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var lineCoord = new Schema({
  pseudo: String,
  coordx: Number,
  coordy: Number,
});

module.exports = mongoose.model('LineCoord', LineCoordSchema);