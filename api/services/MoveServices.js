var userService = require('./UserServices');
var socket = userService.socket;

//----------------------------------
// Update bonus
//----------------------------------
function updateBonus(bonus){
    if(Av != null){
        socket.emit("updateBonus", {bonus: bonus});
    }
}

//----------------------------------
// Get coordinates
//----------------------------------
socket.on('getCoord', function () {
    Avatar.findOne({pseudo: pseudoSocket}, function(err, Av) {
        if(Av != null){
            socket.emit("updateCoord", {x: Av.coordx, y: Av.coordy});
        }
    });
})

//----------------------------------
// Set coordinates
//----------------------------------
function setCoord(x, y){
    Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
        { coordx: x, coordy: y }, function (err, Av) { });
}

//----------------------------------
// CHANGER POSITION
//----------------------------------
socket.on('changePosition', function (data) {
    
    var x = data.xCoord;
    var y = data.yCoord;

    if(x >= 0 && y >= 0){
        console.log('changementPosition de ' + pseudoSocket + ' en ' + x + ' ' + y);
        setCoord(x, y);
        //TODO PREVENIR TOUT LE MONDE DU CHANGEMENT DE POSITION

        //TODO updateBonus si besoin

        //TODO regarder si on est dans un village ou un BG
    }

});


//----------------------------------
// RENTRER DANS VILLAGE
//----------------------------------
socket.on('updateVillage', function (data) {
    
    var village = data.village;

    if(village != null){
        console.log(pseudoSocket + ' rentre dans le village: ' + village);
        
        //TODO récupérer les coordonnées du village et setCoord(x,y)

        //TODO updateBonus si besoin
    }
});


//----------------------------------
// GET VILLAGES
//----------------------------------
socket.on('getVillages', function () {
    
    //TODO RECUPERER LES VILLAGES
    var arrayVillages = ["Dalaran", "Orgrimar", "Stormwind"];
    socket.emit("receiveVillages", {villages: arrayVillages});
})


//----------------------------------
// RENTRER DANS BG
//----------------------------------
socket.on('updateBg', function (data) {
    
    var bg = data.bg;

    if(bg != null){
        console.log(pseudoSocket + ' rentre dans le BG: ' + bg);
        
        //TODO récupérer les coordonnées du village et setCoord(x,y)

        //TODO updateBonus si besoin
    }
});


//----------------------------------
// GET BG
//----------------------------------
socket.on('getBg', function () {
    
    //TODO RECUPERER LES BG
    var arrayBg = ["Tarides", "Dorotar", "MorteMine"];
    socket.emit("receiveBg", {bg: arrayBg});
})


socket.on('changeCoord', function (x, y) {
    console.log('Changement coordonnées');
    Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
        { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
});


socket.on('changeBataille', function (x, y) {
    console.log('Changement Bataille');
    Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
        { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
});


socket.on('changeVillage', function (nomVillage) {
    console.log('Changement Village');
    Avatar.findOneAndUpdate({ pseudo: pseudoSocket },
        { coordx: x, coordy: y }, { new: true }, function (err, Av) { });
});