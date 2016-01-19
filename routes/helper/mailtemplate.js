
var fs = require("fs");

module.exports = {

    active: function(code){

        var url, html, tmpl;

        html = fs.readFileSync(__dirname+"/templates/signup.mail.html").toString();
        url  = "https://www.uuzcloud.com/invite/"+code;
        tmpl = html.replace("{{url}}", url); 

        return {
            title: "请激活你的账号",
            html : tmpl
        };
    },

    invite: function(name, teamname, code){
        var html = fs.readFileSync(__dirname+"/templates/teaminvite.html").toString(); 

        return html.replace("{{url}}", "https://www.uuzcloud.com/invite/"+code)
                   .replace("{{teamname}}", teamname)
                   .replace("{{name}}", name);
    }
};