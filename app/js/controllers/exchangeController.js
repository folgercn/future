

angular.module("future.index").controller('exchangeController', function($scope, $http, $route){

    var name = $route.current.params.name;

    console.log(name);
    $scope.user = {
        btc: (Math.random()*100).toFixed(8),
        coin: Math.ceil(Math.random()*100000)
    };

    $scope.coin = name;
    $scope.balance = $scope.user.coin;

    $scope.buy = {
        amount : "0.00000000",
        price  : "0.00010000",
        total  : "0.00000000"
    };
    $scope.sell = {
        amount : "0.00000000",
        price  : "0.00010000",
        total  : "0.00000000"
    };

    $scope.completebid = function(){
        $scope.buy.amount = ($scope.user.btc / $scope.buy.price).toFixed(8);
        $scope.buy.total  = $scope.user.btc;
    };
    $scope.completeask = function(){
        $scope.sell.amount = $scope.user.coin;
        $scope.sell.total  = ($scope.user.coin * $scope.sell.price).toFixed(8);
    };

    $scope.sellthis = function(order){
        $scope.sell.price = order.price;
        $scope.sell.amount = order.amount;
    };
    $scope.buythis = function(order){
        $scope.buy.price = order.price;
        $scope.buy.amount = order.amount;
    };

    $scope.redirect = function(name){
        location.href = "/BTC/"+name;
    };

    

    $scope.process = function(type){

        var btc = $scope[type].price * $scope[type].amount, data = {};
        if(!isNaN(btc) ){//&& btc.toFixed(8) - $scope.user.btc < 0.0000001

            data.price = Number($scope[type].price).toFixed(8);
            data.amount = Number($scope[type].amount).toFixed(8);;
            data.name = $scope.coin;
            data.type = type;

            $http.post("/trade",data, csrfconfig).success(function(data){
                $scope[type].amount = "0.00000000";
                $scope[type].total  = "0.00000000";
                setTimeout(update, 800);
            });
        }

    };





    function update(){
        $http.get("/exchangedata/"+name).success(function(data){
            $scope.ask = filter(data.ask);
            $scope.bid = filter(data.bid);
            $scope.coins = data.coins;
        });

        $http.get("/history/"+name).success(function(data){
            $scope.his = data;
        });

        $http.get("/myhistory/"+name).success(function(data){
            $scope.myhis = data;
        });
    }
    
    update();


    function filter(arr){

        var newarr = [], current, temp;

        while(arr.length){

            temp = arr.shift();

            if(!current){
                current = temp;
                newarr.push(current);
                continue;
            }

            if(current.price == temp.price){
                current.amount = parseFloat(current.amount) + parseFloat(temp.amount);
            }else{
                current = temp;
                newarr.push(current);
            }

        }
        console.log(newarr)
        return newarr;

    }

    setInterval(update, 4000);
});



