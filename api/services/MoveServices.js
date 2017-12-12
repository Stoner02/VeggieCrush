var serverr         = require('../../server');
var Avatar          = serverr.Avatar;
var request         = serverr.request;

module.exports = {

    villagePosition:  villagePosition = "",

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
            this.setCoord(x, y, socket);

            //TODO PREVENIR MMO DU CHANGEMENT DE POSITION

            //TODO PREVENIR QU'ON QUITTE POUR LE VILLAGE (DELETE)

            module.exports.villagePosition = "";
        }
    },

    //----------------------------------
    // RENTRER DANS VILLAGE
    //----------------------------------
    onUpdateVillage: function (data, socket){ console.log("change village");
        var village = data.village;
        
        if(village != null){
            console.log(socket.nickname + ' rentre dans le village: ' + village);
            villagePosition = village;
            //TODO PREVENIR PAR POST QU'ON ENTRE DANS LE VILLAGE
            /*
            request.post({url:'https://10.113.51.26:3000/farmvillage/api/towns/'+ village +'/potions',
                         form: {key:'value'}}, function(err,httpResponse,body){
                 
            })
    
            */
        }
    },

    //----------------------------------
    // GET VILLAGES
    //----------------------------------
    emitGetVillage: function (socket){
        //TODO RECUPERER LES VILLAGES

        var arrayVillage = ["Orgrimar", "Dalaran", "Fossoyeuse"];
        socket.emit("receiveVillages", {villages: arrayVillage});
       /*
        request('https://10.113.51.26:3000/farmvillage/api/towns', function (error, response, body) {
            
            var arrayBg = ["Tarides", "Dorotar", "MorteMine"];

            if (response != null && response.statusCode == 200) {
                arrayBg = body.TownName;
                console.log("les villages: " + arrayBg);
            }

            socket.emit("receiveBg", {bg: arrayBg});
        });
        */

    },

    //----------------------------------
    // RENTRER DANS BG
    //----------------------------------
    onUpdateBg: function (data, socket){
        var bg = data.bg;
        

        if(bg != null){
            console.log(socket.nickname + ' rentre dans le BG: ' + bg);
            
            //TODO PREVENIR QU'ON QUITTE POUR LE VILLAGE (DELETE)
            //TODO: POST AU BG DIRE QU'ON EST LA

            module.exports.villagePosition = "";
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