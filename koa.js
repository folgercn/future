


var koa = require('koa');
var app = koa();
var k = require("kmodel");
var config = require("./config.js");
var middleware = require("./middleware");

var mount = require('koa-mount');
var session = require('koa-session');
var staticserver = require('koa-static');
var koaBody = require("koa-body"),
    xss = require("xss"),
    csrf = require('koa-csrf');

k.connect("mongodb://127.0.0.1:27017/"+config.dbname, __dirname+"/models/");

var router = require("./routes/index");

app.keys = [ config.sessioncode, 'author aki'];
app.use(staticserver(__dirname+'/public/'));
app.use(staticserver(__dirname+'/views/'));

session(app,{secret: config.hash})

// app.use();
// csrf(app);

// app.use(csrf.middleware);
app.use(middleware);

app.use(koaBody({
    formLimit:100 * 1024 * 1024,
    formidable: {
        maxFieldsSize: "10mb"
    }
}));
app.use(function*(next){
    
    yield next;

    var postbody;

    if(this.method == "POST"){
        postbody = this.request.body;
        for(var key in postbody){
            if(postbody[key])
                this.request.body[key] = xss(postbody[key]);
        }
    }
});


app.use(mount("/", router.middleware()));




app.use(function*(){

    this.body = require("fs").readFileSync("./views/start.html")
               .toString().replace("#crsftoken#", this.csrf);;
});


Date.prototype.string = function(){

    return this.getFullYear() + "-" + (this.getMonth()+1) + "-" +this.getDate()
         +" "+this.getHours()+":"+this.getMinutes();
};

















app.listen(config.port);