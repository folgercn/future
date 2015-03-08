
var Router = require('koa-router'),
    k      = require("kmodel"), fs = require("fs");

var index = new Router();
var History = k.load("History");


index.get("/sso/sso_return", function *(next){

    var query = this.query, me = this, role;

    var data = yield global.validate(query.st);

        
    if(data.status == "failure"){
        this.body = "登录已经失效，请重新登录";
    }else{
        me.session.user = data;
        me.session.token = {
            time: Date.now(),
            st: query.st
        };

        role = getAdmin(this);

        if(role.master || role.custom){
            me.redirect("/admin");
        }else{
            me.redirect("/");
        }
        
    }

});

index.get("/vcode/:code", function *(){

    var code = this.params.code, user, me = this;

    if(code == this.session.code && this.session.user){

        user = yield User.queryOne({uid: this.session.user.uid});

        if(user.current && Date.now() - user.current.time < 24*60*1000*5 && user.status < 3){
            this.body = {status: 1, msg: "材料审核中, 不能重复提交"};
            return ;
        }

        if(user.status == 2){
            this.body = {status: 1, msg: "材料审核中"};
            return ;
        }
        if(user.status == 4){
            this.body = {status: 1, msg: "您已经是CVP了，无需再次申请，CVP系统正在开发中...敬请期待"};
            return ;
        }

        if(Date.now() - this.session.codetime > 2*60*1000){
            this.body = {status: 1, msg: "验证码已经失效"};
            return;
        }


        user.phonenumber = this.session.phonenumber;

        user.status = 1;
        user.current = {};
        user.current.time = Date.now();
        user.current.data = user.data;

        user.save(function(err, u){});

        yield History.remove({uid: user.uid});

        me.body = {status: 0};

    }else{
        this.body = {status: 1, msg: "验证码错误"};
    }

});


index.get("/code", function *(){
    
    var code = String("0000"+Math.floor(Math.random()*10000)).slice(-4);

    if(this.session.codetime){
        if(Date.now() - this.session.codetime < 1000*60){
            this.body = { status: 1, msg: '60秒内不能重复发送'};
            return ;
        }
    }

    if(this.session.user){
        
        var user = yield User.queryOne({uid: this.session.user.uid}), data, phonenumber;

        if(!user.data) {
            this.body = {status:1, msg: "无申请资料"};
            return ;
        }

        data = JSON.parse(user.data);

        phonenumber = data.step00[1].input[0];

        if(/^\d{11}$/.test(phonenumber)){

            global.SMS("您的验证码是"+code, phonenumber, {});
            console.log(code);
            this.session.codetime = Date.now();
            this.session.code = code;
            this.session.phonenumber = phonenumber;
            this.body = {status: 0, msg: "ok"};
        }else{
            this.body = {status:1, msg: "手机无效"};
        }

    }else{
        this.body = {status:1, msg: "未登录"};
    }

});

index.get("/logout", function *(next){
    this.session.user = null;
    this.body = {};
});


var k = require("kmodel");

var User = k.load("User");

index.get("/signin", function *(next){
    
    var query = this.query, me = this;

    var data = yield global.validate(query.st);

    var user = yield User.queryOne({uid: data.uid});

    this.session.user = data;
    
    this.body = user || {};
});


index.get("/user/stat", function *(){

    var data = {status: 0}, userdata;

    if(this.session.user){
        var user = yield User.queryOne({uid: this.session.user.uid});

        this.session.user = user;

        if(user.status == undefined){
            this.body = {status: 0};
        }else{
            this.body = {status: user.status};
        }
    }else{
        this.body = 99;
    }

});



index.post("/save", function*(){

    var body = this.request.body, user, newuser, tmp, base64;
    
    if(this.session.user){
        user = yield User.queryOne({uid: this.session.user.uid});

        user = user || this.session.user;
        tmp = user.data ? JSON.parse(user.data) : {};
        if(Array.isArray(tmp)) tmp = {};
        tmp[body.key] = body.form;

        if(body.key == "step00"){
            base64 = tmp.step00.slice(-1);
            if(base64[0] && base64[0].indexOf && base64[0].indexOf("base64,") > 0) tmp.step00 = tmp.step00.slice(0,-1);
        }

        user.data = JSON.stringify(tmp);
        if(user.save) user.save();
        else{
            user.status = 0;
            user = yield User.insertOne(user);
        }
        var res = Array.isArray(user) ? user[0]: user;

        res.csrf = this.csrf;
        if(base64 && base64[0] && base64[0].indexOf && base64[0].indexOf("base64,") > 0) {
            
            var subfix = base64[0].indexOf("data:image/png") == 0 ? ".png" : ".jpg";
            var index  = subfix == ".png" ? 22 : 23;

            fs.writeFileSync("public/upload/"+res._id+".png", new Buffer(base64[0].slice(index), 'base64'));
        }

        this.body = res;
    }else{
        this.body = "请登录";
    }

});


index.get("/users/status/:number", function*(){


    var status = this.params.number, role = getAdmin(this);


    if( (role.custom && status < 4) || (role.master && status > 1)){
        this.body = yield User.limit({status: +status}, 100);;
    }
});

index.get("/user/:id", function*(){

    var user, id = this.params.id, role = getAdmin(this), his;

    if(role.custom || role.master){

        user = yield User.queryOne({_id: id});
        user = Array.isArray(user) ? user[0] : user;
        his  = yield History.find({uid: user.uid});

        this.body = {his: his, user: user};
    }
});


index.post("/user/action", function *(){

    var role = getAdmin(this), user, status, action = {}, body = this.request.body;

    user   = yield User.queryOne({uid: body.uid});
    status = +user.status;
    action.uid = user.uid;
    action.comment  = body.comment;
    action.action   = body.action;

    var data = JSON.parse(user.current.data);

    var mailaddress = data.step00[2].input[0];

    var mark = 0, message = "", mailtype = "error1", obj = {};

    if(role.custom && user.status == 1){
        if(body.action == "accept"){
            mark = 2;
            mailtype = "success1";
        }else{
            mark = 3;
            message = config.messages.error1;
            mailtype = "error1";
            obj.reason = body.comment;
        }
    }

    if(role.master && user.status == 2){

        var myaction = yield History.find({uid: user.uid}), passed = '', reason1, reason2;

        if(myaction.length)
            myaction.forEach(function(a){
                if(isMaster(a.actionid)){
                    passed += a.action == "accept" ? "1" : "0";
                    if(a.action != "accept"){
                        if(obj.reason1) obj.reason2 = a.comment;
                        else obj.reason1 = a.comment;
                        // obj.reason1 = obj.reason1 ? a.comment : obj.reason1;
                    }
                }
            });

        if(body.action == "accept"){

            passed += "1";

            if(["011","101","11"].indexOf(passed) > -1){
                mark = 4;
                message = config.messages.success;
                mailtype = "success2";
            }else{
                mark = user.status;
            }
        }else{
            passed += "0";
            if(["00", "010", "001", "100"].indexOf(passed) > -1){
                message = config.messages.error2;
                mailtype = "error2";
                obj.reason2 = body.comment;
                mark = 5;
            }else{
                mark = user.status;
            }
        }
    }

    if(mark){

        action.actionid = this.session.user.uid;
        action.actionname = role.custom || role.master;
        action = yield History.insertOne(action);
        user.status = mark;
        user.save();

        if(message.length){
            global.SMS(message, user.phonenumber, {});
            global.sendmessage(mailaddress, mailtype, obj);
        }
        this.body = action;
    }else{
        this.body = action;
    }

});


index.get("/role", function *(){

    this.body = getAdmin(this);
});


module.exports = index;


function getAdmin(app){

    var uid, role = {};

    if(!app.session.user) return false;
    
    uid = app.session.user.uid;
    role.custom = config.custom[uid];
    role.master = config.master[uid];
    
    return role;
}

function isMaster(uid){
    return !!config.master[uid];
}


