


var koa = require('koa');
var app = koa();
var k = require("kmodel");

var mount = require('koa-mount');
var session = require('koa-session');
var staticserver = require('koa-static');
var koaBody = require("koa-body"),
    xss = require("xss"),
    csrf = require('koa-csrf');

var hash = "000000000000000002e445872f25e66eabb9b209e3d35858e197f99cfbba2415";


k.connect("mongodb://127.0.0.1:27017/cocosdrrrd", __dirname+"/models/");



var router = require("./routes/index");
var config = require("./config.json");

app.keys = [ config.sessioncode, 'author aki'];
app.use(staticserver(__dirname+'/public/'));
app.use(staticserver(__dirname+'/views/'));


app.use(session({secret: hash}));
csrf(app);

app.use(csrf.middleware);

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

    this.body = require("fs").readFileSync("./views/start.html").toString().replace("#crsftoken#", this.csrf);;
});




















app.listen(3000);