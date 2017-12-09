var serverr         = require('../../server');
var Avatar          = serverr.Avatar;

module.exports = {
    //----------------------------------
    // Update bonus
    //----------------------------------
    updateBonus: function (bonus, socket){
        if(Av != null){
            socket.emit("updateBonus", {bonus: bonus});
        }
    },

    //----------------------------------
    // Get coordinates
    //---------------------------------- 
    emitGetCoord: function (socket){
        Avatar.findOne({pseudo: socket.nickname}, function(err, Av) {
            if(Av != null){
                socket.emit("updateCoord", {x: Av.coordx, y: Av.coordy});
            }
        });
    },

    //----------------------------------
    // Set coordinates
    //----------------------------------
    setCoord: function (x, y, socket){
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { coordx: x, coordy: y }, function (err, Av) { });
    },

    //----------------------------------
    // CHANGER POSITION
    //----------------------------------
    onChangePosition: function (data, socket){
        var x = data.xCoord;
        var y = data.yCoord;

        if(x >= 0 && y >= 0){
            console.log('changementPosition de ' + socket.nickname + ' en ' + x + ' ' + y);
            setCoord(x, y, socket);
            //TODO PREVENIR TOUT LE MONDE DU CHANGEMENT DE POSITION

            //TODO updateBonus si besoin

            //TODO regarder si on est dans un village ou un BG
        }
    },

    //----------------------------------
    // RENTRER DANS VILLAGE
    //----------------------------------
    onUpdateVillage: function (data, socket){
        var village = data.village;
        
        if(village != null){
            console.log(socket.nickname + ' rentre dans le village: ' + village);
            
            //TODO récupérer les coordonnées du village et setCoord(x,y)

            //TODO updateBonus si besoin
        }
    },

    //----------------------------------
    // GET VILLAGES
    //----------------------------------
    emitGetVillage: function (socket){
        //TODO RECUPERER LES VILLAGES
        var arrayVillages = ["Dalaran", "Orgrimar", "Stormwind"];
        socket.emit("receiveVillages", {villages: arrayVillages});
    },

    //----------------------------------
    // RENTRER DANS BG
    //----------------------------------
    onUpdateBg: function (data, socket){
        var bg = data.bg;
        
        if(bg != null){
            console.log(socket.nickname + ' rentre dans le BG: ' + bg);
            
            //TODO récupérer les coordonnées du village et setCoord(x,y)

            //TODO updateBonus si besoin
        }
    },

    emitGetBg: function (socket){
        //TODO RECUPERER LES BG
        var arrayBg = ["Tarides", "Dorotar", "MorteMine"];
        socket.emit("receiveBg", {bg: arrayBg});
    },

    onChangeCoord: function (x, y, socket){
        console.log('Changement coordonnées');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
    },

    onChangeBataille: function (x, y, socket){
        console.log('Changement Bataille');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
    },

    onChangeVillage: function (nomVillage, socket){
        console.log('Changement Village');
        Avatar.findOneAndUpdate({ pseudo: socket.nickname },
            { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
    }

};