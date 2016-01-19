
exports.User = function(k, opts){

    var opts = opts || {},
        isSalt = !!opts.isSalt;

    var User = k.create({
        email: "string",
        uid: "string",
        data: "string",
        current: "object"

    }, "User");

    
    
    return User;
};

