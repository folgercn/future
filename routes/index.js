
var Router = require('koa-router'),
    k      = require("kmodel"), fs = require("fs");

var index = new Router();
var k = require("kmodel"), tradercenter = require("../core/Tradercenter");
var History = k.load("History");


index.get("/exchangedata/:name", function *(next){
    
    var name = this.params.name, instance = tradercenter(name);

    if(this.session.user == null) this.session.user = Date.now();
    
    
    this.body = {
        ask: instance.ask,
        bid: instance.bid,
        coins: global.coins
    };
});

index.get("/history/:name", function *(){

    var his = yield History.limit({coin: this.params.name},50);
    this.body = his;
});

index.get("/myhistory/:name", function *(){
    if(this.session.user == null) this.session.user = Date.now();

    var his = yield History.limit({coin: this.params.name, userid: String(this.session.user)},50);
    this.body = his;
});

index.post("/trade", function *(){

    var data = this.request.body, instance = tradercenter(data.name);
    data.userid = String(this.session.user);

    instance.add(data);

    this.body = data;

});




module.exports = index;



