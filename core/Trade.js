
// Base from BTC


function Trade(name){

    this.readylist = [];
    this.bid = [];
    this.ask = [];
    this.processlist = [];
    this.name = name;
    this.running = false;
}


Trade.prototype = {

    add: function(order){

        this.readylist.push(order);
    },


    run: function(){
        var order = this.readylist.shift();
        if(!order) return;

        this.running = true;
        order.type == "buy" ? this.buy(order) : this.sell(order);
        this.running = false;        
    },

    buy: function(order){

        var ask = this.ask[0];

        if( ask && (order.price >= ask.price) ){
            this.process(order);
        }else{
            this.addbid(order);
        }
    },

    sell: function(order){

        var bid = this.bid[0];

        if(bid && (order.price <= bid.price)){
            this.process(order);
        }else{
            this.addask(order);
        }


    },

    addask: function(order){

        var ask = this.ask; 

        if(ask.length == 0){
            return this.ask.push(order);
        }

        if(ask[0].price > order.price){
            return this.ask = [order].concat(ask);
        }

        if(ask[0].price == order.price){
            return this.ask = [ask[0], order].concat(ask);
        }

        for(var i = 1; i < ask.length; i++){

            if(ask[i].price >= order.price){
                return this.ask = (ask.slice(0, i).concat(order)).concat(ask.slice(i));
            }
        }

        this.ask = ask.concat(order);

    },

    addbid: function(order){

        var bid = this.bid;

        if(bid.length == 0){
            return this.bid.push(order);
        }

        if(bid[0].price < order.price){
            return this.bid = [order].concat(bid);
        }

        if(bid[0].price == order.price){
            return this.bid = [bid[0], order].concat(bid.slice(1));
        }

        for(var i = 1; i < bid.length; i++){

            if(bid[i].price <= order.price){
                return this.bid = (bid.slice(0, i).concat(order)).concat(bid.slice(i));
            }
        }

        this.bid = bid.concat([order]);

    },

    start: function(){

        var me = this;

        setInterval(function(){
            if(me.running == false) me.run();
        }, 100);
    },


    process: function(order){

        if(order.type == "buy") this.buyask(order);
        else this.sellbid(order);

    },

    buyask: function(order){
        this.trader(order, "buy");
    },

    sellbid: function(order){
        this.trader(order, "sell");
    },

    trader: function(order, type){
        var data = type == "sell" ? this.bid : this.ask, newdata;

        newdata = data.filter(function(item){

            if(order.deal) return true;

            if( (type == "sell" && item.price >= order.price) || 
                (type == "buy" && item.price <= order.price)){

                var deal = {};
                deal.amount = order.amount;
                deal.price = item.price;
                deal.type  = order.type;

                if(item.amount < order.amount){
                    order.amount = order.amount - item.amount;
                    deal.amount = item.amount;
                    console.log(type + " done1",deal);
                    return false;
                }

                if(item.amount == order.amount){
                    order.deal = true;
                    console.log(type + " done2",deal);
                    return false;
                }

                if(item.amount > order.amount){
                    item.amount = item.amount -  order.amount;

                    order.deal = true;
                    console.log(type + " done3",deal);
                }
            }
            return true;
        });

        if(order.deal != true){
            if(type == "sell"){
                this.ask = [order].concat(this.ask);
            }
            if(type == "buy"){
                this.bid = [order].concat(this.bid);
            }
        }
        if(type == "sell") this.bid = newdata;
        if(type == "buy")  this.ask = newdata;

    }

};


module.exports = Trade;











