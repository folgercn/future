


// var config = require("../../config.js"), mailcfg = config.mailconfig;

// var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');


// var transporter = nodemailer.createTransport(smtpTransport(mailcfg));


// module.exports = function(to, title, html){


//     return function(done){
//         transporter.sendMail({
//             from: mailcfg.support,
//             to: to,
//             subject: title,
//             html: html
//         }, done);
//     }
// };

var Mailgun = require('mailgun').Mailgun;


var mg = new Mailgun('key-a0fe5646b2234c7234de040c85bdf041');


// sendText('sender@example.com',
//          [],
//          'Behold the wonderous power of email!',
//          {'X-Campaign-Id': 'something'},
//          function(err) { err && console.log(err) });
// sendText(sender, recipients, subject, text, [servername=''], [options={}], [callback(err)])
module.exports = function(to, title, html){


    return function(done){
        mg.sendRaw("postmaster@sandboxb502d1d6ed8e4ae8a7e4b1e897acb712.mailgun.org",[to],title, html,{}, done);
    }
};