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
            { $inc: { potionMMO1: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionMMO2: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO2: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionMMO3: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO3: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionMMO4: function (socket){
        console.log('ajout potion MMO');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionMMO4: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },

    
    onAddPotionRTS1: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS1: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionRTS2: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS2: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionRTS3: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS3: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionRTS4: function (socket){
        console.log('ajout potion RTS');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionRTS: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },


    onAddPotionVille1: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille1: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionVille2: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille2: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionVille3: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille3: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    },
    onAddPotionVille4: function (socket){
        console.log('ajout potion Ville');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { $inc: { potionVille: 1 } }, { new: true }, function (err, Av) {});
            this.getAllPopo(socket);
    }

};