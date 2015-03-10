



// 记录 admin 对 User的审核过程
// 




exports.History = function(k, opts){

    var opts = opts || {},
        isSalt = !!opts.isSalt;

    var History = k.create({
        
        userid: "string",

        type: "string",

        price: "string",

        amount: "string",

        coin: "string",

        time: "string",

        createtime: "date"
        

    }, "History");

    
    
    return History;
};

