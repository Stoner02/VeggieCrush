var request = require('request');

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

var serverStaticFunc = connect().use(serveStatic(__dirname + '/web/'));

var app2ServerStatic = serverStaticFunc.listen(8080, function () {
	console.log('Server running on 8080...');
});



var io = require("socket.io");
var io = io.listen(app2ServerStatic);
var Avatar = mongoose.model('Avatars');


module.exports.io = io;
module.exports.Avatar = Avatar;
module.exports.request = request;

var services = require('./api/services/Services');
