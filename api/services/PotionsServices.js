var serverr         = require('../../server');
var Avatar          = serverr.Avatar;
var potionsServices = require("./PotionsServices");
module.exports = {

    //----------------------------------------
    // Send all potions
    //----------------------------------------
    getAllPopo: function (socket){
        Avatar.findOne({pseudo: socket.nickname}, function(err, Av) { 
            if(Av != null){ 
                var _mmo1 = Av.potionMMO1;
                var _mmo2 = Av.potionMMO2;
                var _mmo3 = Av.potionMMO3;
                var _mmo4 = Av.potionMMO4;

                var _rts1 = Av.potionRTS1;
                var _rts2 = Av.potionRTS2;
                var _rts3 = Av.potionRTS3;
                var _rts4 = Av.potionRTS4;

                var _ville1 = Av.potionVille1;
                var _ville2 = Av.potionVille2;
                var _ville3 = Av.potionVille3;
                var _ville4 = Av.potionVille4;

                socket.emit("receiveAllPopo", {
                    mmo1: _mmo1, mmo2: _mmo2, mmo3: _mmo3, mmo4: _mmo4,
                    rts1: _rts1, rts2: _rts2, rts3: _rts3, rts4: _rts4,
                    ville1: _ville1, ville2: _ville2, ville3: _ville3, ville4: _ville4
                });
            }
        });
    },
    
    onAddPotionMMO1: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionMMO1" });
    },
    onAddPotionMMO2: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionMMO2" });
    },
    onAddPotionMMO3: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionMMO3" });
    },
    onAddPotionMMO4: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionMMO4" });
    },

    
    onAddPotionRTS1: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS1: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionRTS1" });
    },
    onAddPotionRTS2: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS2: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionRTS2" });
    },
    onAddPotionRTS3: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS3: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionRTS3" });
    },
    onAddPotionRTS4: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionRTS4" });
    },


    onAddPotionVille1: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille1: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionVille1" });
    },
    onAddPotionVille2: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille2: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionVille2" });
    },
    onAddPotionVille3: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille3: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});
            socket.emit("onMessage", {message: "Création potionVille3" });
    },
    onAddPotionVille4: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille: 1 } }, { new: true }, function (err, Av) {module.exports.getAllPopo(socket);});

            socket.emit("onMessage", {message: "Création potionVille4" });
    },


    resetPotion: function (socket){
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { potionMMO1: 0, potionMMO2: 0, potionMMO3: 0, potionMMO4: 0,
              potionRTS1: 0, potionRTS2: 0, potionRTS3: 0, potionRTS4: 0,
              potionVille1: 0, potionVille2: 0, potionVille3: 0, potionVille4: 0}, { new: true }, function (err, Av) {
                module.exports.getAllPopo(socket);
                });
            
            socket.emit("onMessage", {message: "Triste journée..." });
    },

};