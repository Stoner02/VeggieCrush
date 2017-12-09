var userService = require('./UserServices');
var socket = userService.socket;

var serverr = require('../../server');
var Avatar = serverr.Avatar;

//----------------------------------------
// Send money
//----------------------------------------
socket.on('getMoneyExp', updateMoneyExp);


function updateMoneyExp(){
    Avatar.findOne({pseudo: socket.nickname}, function(err, Av) {
        if(Av != null){
            socket.emit("updateExperienceArgent", {argent: Av.argent, exp: Av.experience});
        }
    });
}