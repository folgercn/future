
var Router = require('koa-router'),
    k      = require("kmodel"), fs = require("fs");

var index = new Router();
var tradercenter = require("../core/Tradercenter");
var sendmail = require("./helper/mail"), mailtpl = require("./helper/mailtemplate");



var History = k.load("History"), User = k.load("User");

index.get("/exchangedata/:name", function *(next){
    
    var name = this.params.name, instance = tradercenter(name);

    if(this.session.user == null) this.session.user = Date.now();
    
    
    this.body = {
        ask: instance.ask,
        bid: instance.bid,
        coins: global.coins
    };
});

index.get("/active/:code", function *(){

    var pass, user;

    pass = yield Password.queryOne({acode: this.params.code, status: "0"});
    user = {};

    user.uid = pass._id;
    user.email = pass.email;

    if(pass){
        user = yield User.insertOne(user);

        this.session.user = user[0];

        pass.status = "1";
        pass.save();
        this.redirect("/BTC/NMC");
    }else{
        this.body = "激活失败";
    }

});

index.get("/history/:name", function *(){

    var his = yield History.limit({coin: this.params.name},50);
    this.body = his;
});

index.get("/logout", function*(){
    this.session.user = null;
    this.redirect("/BTC/NMC");
});

index.get("/myhistory/:name", function *(){

    var option = {coin: this.params.name, userid: String(this.session.user._id)};

    this.body = yield History.limit(option,50);
});

index.post("/trade", function *(){

    var data = this.request.body, instance = tradercenter(data.name);

    data.userid = String(this.session.user._id);

    instance.add(data);

    this.body = data;

});


var Password = k.load("Password");

index.post("/newuser", function *(){

    var body = this.request.body, instance = {}, code, mail,
        emailregx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    var email = body.mail,
        password = body.password;

    if(!emailregx.test(email)){
        this.body = {status: 1, msg: "Invild Email Address"};
        return;
    }

    if(!password || password.length < 6){
        this.body = {status: 1, msg: "Password must be 6 char +"};
        return;
    }

    var p = yield Password.queryOne({email: email});

    code = crypt(String(Date.now()+Math.random())), tmpl = mailtpl.active(code);


    // 如果未激活，第二次发送
    if( p && p.status == "0"){
        p.acode = code;
        p.save();

        mail = yield sendmail(email, tmpl.title, tmpl.html);
        this.body = {status: 0};

        return;
    }

    if( p && p.status == "1"){
        
        this.body = {status: 1, msg: "邮箱已经注册"};
        return;
    }


    mail = yield sendmail(email, tmpl.title, tmpl.html);

    instance.email = email;
    instance.acode = code;
    instance.code = crypt(password);
    instance.status = "0";

    instance = yield Password.insertOne(instance);

    this.body = {status: 0};
});



module.exports = index;

function crypt(s){
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');

    shasum.update(s);

    var str = shasum.digest('hex');

    return String(str);
}



