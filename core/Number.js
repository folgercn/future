




// 返回satoshi

module.exports = function(price){

    var price = parseFloat(price);

    if(isNaN(price)) return false;

    return parseInt(price * 1e8);
};

