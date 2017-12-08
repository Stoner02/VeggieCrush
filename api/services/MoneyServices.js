var userService = require('./UserServices');
var socket = userService.socket;

//----------------------------------------
// Send money
//----------------------------------------
socket.on('getMoneyExp', function () {
    console.log('getMoneyExp');
    updateMoneyExp();
})

function updateMoneyExp(){
    Avatar.findOne({pseudo: pseudoSocket}, function(err, Av) {
        if(Av != null){
            socket.emit("updateExperienceArgent", {argent: Av.argent, exp: Av.experience});
        }
    });
}