
exports.Active = function(k, opts){

    var opts = opts || {},
        isSalt = !!opts.isSalt;

    var Active = k.create({
        email: "string",
        code : "string"

    }, "Active");

    
    
    return Active;
};

