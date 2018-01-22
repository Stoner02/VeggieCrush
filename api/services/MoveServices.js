var serverr         = require('../../server');
var avatarController= require('../controllers/avatarController');
var Avatar          = serverr.Avatar;
var request         = serverr.request;

var services 		= require("./Services");


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

			// PREVENIR DEPLACEMENT A HOWOB
            request.post('http://'+ services.IP_MMO + ':3000/marchands/'+socket.nickname, {
				headers:{
					posx: x,
					posy: y}
				}, 
				function(err,httpResponse,body){
				if(httpResponse != null && httpResponse.statusCode == 200){
					console.log(socket.nickname.toUpperCase() + " ajouté dans MMO.");
				}
				else{
				console.log("Probleme dans insertion " + socket.nickname.toUpperCase() + " dans MMO");	
				}
			});
			
			// PREVENIR QU'ON QUITTE LE VILLAGE
			request.delete('http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/towns/'+villagePosition+'/potions/'+socket.nickname, {
				}, 
				function(err,httpResponse,body){
				if(httpResponse != null && httpResponse.statusCode == 200){
					console.log(socket.nickname.toUpperCase() + " a quitté le village de farmvillage.");
				}
				else{
					console.log("Pas dans un village ou probleme dans insertion " + socket.nickname.toUpperCase() + " dans village");	
				}
			});

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

            //PREVENIR PAR POST QU'ON ENTRE DANS LE VILLAGE
            Avatar.findOne({pseudo: socket.nickname}, function(err, Av) {
                if(Av != null){

                    var headersOpt = {  
                        "content-type": "application/json",
                    };

                    request.post({url:'http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/towns/'+ village +'/potions',
                    form: {pseudo: Av.pseudo
                            ,potion_prix4: avatarController.prix.potionVille4
                           ,potion_prix3: avatarController.prix.potionVille3
                           ,potion_prix2: avatarController.prix.potionVille2
                           ,potion_prix1: avatarController.prix.potionVille1
                           ,potion4: Av.potionVille4
                           ,potion3: Av.potionVille3 
                           ,potion2: Av.potionVille2
                           ,potion1: Av.potionVille1
                           }
                           ,headers: headersOpt
                           ,json: true
                   }, function(err,httpResponse,body){
                        console.log("message : " + httpResponse + " " + body);
                    })
                }
            });
  
        }
    },

    //----------------------------------
    // GET VILLAGES
    //----------------------------------
    emitGetVillage: function (socket){

        var arrayVillage = ["Orgrimar", "Dalaran", "Fossoyeuse"];
        socket.emit("receiveVillages", {villages: arrayVillage});
       
        request('http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/towns', function (error, response, body) {
            
            //villages fictifs par défaut
            /*
            var arrayBg = ["Tarides", "Dorotar", "MorteMine"];
            socket.emit("receiveVillages", {bg: arrayBg});
            */

            if (response != null && response.statusCode == 200) {
                var arrayVillages = [];
                var resp = JSON.parse(body);
                for(var i = 0; i < resp.length; ++i){
                    arrayVillages[i] = resp[i].name;
                }
                socket.emit("receiveVillages", {villages: arrayVillages});
            }
            
        });
        
    },

    //----------------------------------
    // RENTRER DANS BG
    //----------------------------------
    onUpdateBg: function (data, socket){
        var bg = data.bg;
        
        if(bg != null){
            console.log(socket.nickname + ' rentre dans le BG: ' + bg);
            
            // PREVENIR QU'ON QUITTE LE VILLAGE
			request.delete('http://'+ services.IP_FARMVILLAGE + ':3000/farmvillage/api/towns/'+villagePosition+'/potions/'+socket.nickname, {
				}, 
				function(err,httpResponse,body){
				if(httpResponse != null && httpResponse.statusCode == 200){
					console.log(socket.nickname.toUpperCase() + " a quitté le village de farmvillage.");
				}
				else{
					console.log("Pas dans un village ou probleme dans insertion " + socket.nickname.toUpperCase() + " dans village");	
				}
			});
			
			
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