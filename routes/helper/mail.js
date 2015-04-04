


var config = require("../../config.js"), mailcfg = config.mailconfig;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport(smtpTransport(mailcfg));


module.exports = function(to, title, html){


    return function(done){
        transporter.sendMail({
            from: mailcfg.support,
            to: to,
            subject: title,
            html: html
        }, done);
    }
};
