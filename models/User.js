
exports.User = function(k, opts){

    var opts = opts || {},
        isSalt = !!opts.isSalt;

    var User = k.create({
        email: "string",
        uid: "string",
        username: "string",
        data: "string",
        status: "number",
        phonenumber: "string",
        current: "object",
        admin: "string"

    }, "User");

    
    
    return User;
};

