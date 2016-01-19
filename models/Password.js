
exports.Password = function(k, opts){

    var Password = k.create({
        
        email: "string",
        code : "string",
        acode: "string",
        status: "string"

    }, "Password");

    
    
    return Password;
};

