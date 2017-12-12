
var serverr         = require('../../server');

var userServices    = require('./UserServices');
var moveServices    = require("./MoveServices");
var moneyServices   = require("./MoneyServices");
var potionsServices = require("./PotionsServices");


serverr.io.sockets.on('connection', function (socket) {

    var coordSocketx = 0;
	var coordSockety = 0;
	var bonusHero = 0;
	var bonusVillage1 = 0;
	var bonusVillage2 = 0;
	var bonusVillage3 = 0; 
	var bonusVillage4 = 0;
	var malusRTS = 0;
    var connecte = false;
    

    socket.on('inscription', function(_pseudo, _mdp) {
        userServices.onInscription(_pseudo, _mdp, socket);
    });
    socket.on('connectTry', function(_pseudo, mdp) {
        userServices.onConnectTry(_pseudo, mdp, socket);
    });
    socket.on('isAllowedToPlay', function(_pseudo, _mdp){
        userServices.onIsAllowedToPlay(_pseudo, _mdp, socket);
    });
    socket.on('userDisconnect', function(){
        userServices.onUserDisconnect(socket);
    });
    socket.on('disconnect', function(){
        userServices.onUserDisconnect(socket);
    });


    socket.on('getCoord', function(){
        moveServices.emitGetCoord(socket);
    });
    socket.on('changePosition', function(data){
        moveServices.onChangePosition(data, socket);
    });
    socket.on('getVillages', function(socket){
        moveServices.emitGetVillage();
    });
    socket.on('getBg', function(){
        moveServices.emitGetBg(socket);
    });
    socket.on('changeCoord', function (x, y) {
        moveServices.onChangeCoord(x, y, socket);
    });
    socket.on('onChangeBataille', function (x, y) {
        moveServices.onChangeBataille(x, y, socket);
    });
    socket.on('changeVillage', function (nomVillage) {
        moveServices.onChangeVillage(nomVillage, socket);
    });
    socket.on('updateVillage', function (data) {
        moveServices.onUpdateVillage(data, socket);
    });
    socket.on('updateBg', function (data) {
        moveServices.onUpdateBg(data, socket);
    });


    socket.on('getMoneyExp', function (data) {
        moneyServices.updateMoneyExp(data, socket);
    });


    socket.on('getAllPopo', function(){
        potionsServices.getAllPopo(socket);
    });

    socket.on('addPotionMMO1', function () {
        potionsServices.onAddPotionMMO1(socket);
    });
    socket.on('addPotionMMO2', function () {
        potionsServices.onAddPotionMMO2(socket);
    });
    socket.on('addPotionMMO3', function () {
        potionsServices.onAddPotionMMO3(socket);
    });
    socket.on('addPotionMMO4', function () {
        potionsServices.onAddPotionMMO4(socket);
    });

    socket.on('addPotionRTS1', function () {
        potionsServices.onAddPotionRTS1(socket);
    });
    socket.on('addPotionRTS2', function () {
        potionsServices.onAddPotionRTS2(socket);
    });
    socket.on('addPotionRTS3', function () {
        potionsServices.onAddPotionRTS3(socket);
    });
    socket.on('addPotionRTS4', function () {
        potionsServices.onAddPotionRTS4(socket);
    });

    socket.on('addPotionVille1', function () {
        potionsServices.onAddPotionVille1(socket);
    });
    socket.on('addPotionVille2', function () {
        potionsServices.onAddPotionVille2(socket);
    });
    socket.on('addPotionVille3', function () {
        potionsServices.onAddPotionVille3(socket);
    });
    socket.on('addPotionVille4', function () {
        potionsServices.onAddPotionVille4(socket);
    });
    socket.on('resetPotions', function () {
        potionsServices.resetPotion(socket);
    });

});