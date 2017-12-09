var serverr         = require('../../server');
var Avatar          = serverr.Avatar;

module.exports = {
    
    //----------------------------------------
    // Send money
    //----------------------------------------
    updateMoneyExp: function (socket){
        Avatar.findOne({pseudo: socket.nickname}, function(err, Av) {
            if(Av != null){
                socket.emit("updateExperienceArgent", {argent: Av.argent, exp: Av.experience});
            }
        });
    }

};