// Source: src/app.js






var future = angular.module('future',[

    'ngResource',
    'ngRoute',
    // '',
    'future.index',
    'progress'

]);


angular.module('progress', []).service("ngProgress", function(){

    var el = document.getElementById("progress"), 
        w = window.innerWidth, start = 0, state = "uncomplete",
        time = 100;

    var run = function(){

        start += 25;

        if(state == "uncomplete"){
            time++;
        }

        if(state == "completed"){
            time =1;
        }
        
        el.style.width = start + "px";
        if(start < w) setTimeout(run, 10);
        else{
            el.style.width = "0px";
            start = 0;
            time = 100;
            state = "uncomplete"
        }
    };

    return {
        start: function(){
            state = "uncomplete";
            run();
        },
        complete: function(){
            state = "completed";
        }
    };
});

angular.module('future.index', []);
// Source: src/controllers/exchangeController.js


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

    setInterval(update, 1000);
});




// Source: src/services/block.js




// lottery.factory('carmodel',function($resource){

//     return $resource('/api/carservice/products/findby/carmodelid/1/maintenance?_=1417420788141');
// });



// lottery.factory('carmodels',function($resource){

//     return $resource('/api/carmodels?_=1417420788140');
// });



// Source: src/init.js



Number.prototype.satoshi = function(){

    var n = this * 1e8;

    // var s = String(n), index = s.indexOf(".");


    return this;
};

var csrfconfig = {headers:{"X-Csrf-Token": document.getElementById("token").value}};

// Source: src/config.js



/* Controllers */
// var future = angular.module('future', ["ngClipboard"]);


future.config(function($routeProvider){
    $routeProvider.
        when('/', {
            templateUrl: '/templates/index.html',
            title: 'future'
        }).
        when('/BTC/:name', {
            templateUrl: '/templates/exchange.html',
            title: 'future'
        })
});



future
  .config(function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  })
  .run(function($rootScope, $route, $location, $routeParams,ngProgress) {
    // gettextCatalog.currentLanguage = defaultLanguage;
    // amMoment.changeLocale(defaultLanguage);
    $rootScope.$on('$routeChangeStart', function() {
      ngProgress.start();
      // console.log($progress)
      // if(window.userinfos == undefined) location.href="/step00";
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      ngProgress.complete();
      
      //Change page title, based on Route information
      $rootScope.titleDetail = '';
      $rootScope.title = $route.current.title;
      $rootScope.isCollapsed = true;
      $rootScope.currentAddr = null;
      // $location.hash($routeParams.scrollTo);
      // $anchorScroll();
    });
  });

// Source: src/directives.js


future.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});


// Source: src/filters.js
