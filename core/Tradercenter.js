


var coins = require("./Coins"), Trade = require("./Trade");



var instances = {};


for(var name in coins){
    instances[name] = new Trade(name);
    instances[name].fullname = coins[name];
    instances[name].start();
    coins[name].lastprice = "0.0000000";
    coins[name].change = "0%";
}


global.coins = coins;


module.exports = function(name){


    return instances[name];
};







