

var parse = require("./Number");


function BuyOrder(userid, price, amount){

    this.userid = userid;
    this.price  = parse(price);
    this.amount = amount;
    this.type = "buy";
}


function SellOrder(userid, price, amount){

    this.userid = userid;
    this.price  = parse(price);
    this.amount = amount;
    this.type = "sell";
}







module.exports = {
    SellOrder: SellOrder,
    BuyOrder : BuyOrder
};



