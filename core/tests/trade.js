

var Order = require("../Order"), Trade = require("../Trade");


var r1 = new Order.BuyOrder("userid", 0.00001000, 100000);
var r2 = new Order.SellOrder("userid", 0.00000100, 19000);
var r3 = new Order.SellOrder("userid", 0.00001200, 9000);
var r33 = new Order.SellOrder("userid", 0.00001200, 39000);
var r4 = new Order.BuyOrder("userid", 0.00000900, 1000);
var t = new Trade("NMC");

t.add(r1);
t.add(r3);
t.add(r33);
t.add(r4);

t.start();
t.add(r2);



setInterval(function(){
	
	console.log(t)
	t.add(new Order.SellOrder("userid", 0.00000700, 1000));
	t.add(new Order.SellOrder("userid", 0.00000600, 1000));
	t.add(new Order.SellOrder("userid", 0.00000800, 1000));
	t.add(new Order.SellOrder("userid", 0.00000900, 500));
	// t.add(new Order.SellOrder("userid",  Math.random(), Math.random()))
},3000)

