



// 记录 admin 对 User的审核过程
// 




exports.History = function(k, opts){

    var opts = opts || {},
        isSalt = !!opts.isSalt;

    var History = k.create({
        
        uid: "string",

        action: "string",

        actionid: "string",

        actionname: "string",

        comment: "string"

    }, "History");

    
    
    return History;
};

