

var checklist = ["/myhistory", "/trade"];


exports.process = function(self){


    return function(done){

        var c = false, path = self.path;

        checklist.forEach(function(list){

            if(path.indexOf(list) > -1) {
                c = true;
                return false;
            }

        });


        // return done(null, false);

        if(self.session.user == null && c) {
            done(null,{status: 1, msg: "not login"});
        }else{
            done(null, false);
        }
    };

};