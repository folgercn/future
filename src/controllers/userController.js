

angular.module("future.index").controller('userController', function($scope, $http, $route){

    var emailregx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


    $scope.signup = function(){

        var email = $scope.mail,
            password = $scope.password,
            repassword = $scope.repassword;

        if(!emailregx.test(email)){
            $scope.tips = "Invild Email Address";
            return;
        }

        if(!password || password.length < 6){
            $scope.tips = "Password must be 6 char +";
            return;
        }

        if(password != repassword ){
            $scope.tips = "密码不一致";
            return;
        }

        $scope.tips = "";

        $http.post("/newuser", {mail: email, password: password}, csrfconfig)
             .success(function(data){
                if(data.status){
                    $scope.tips = data.msg;
                    $scope.success = "";
                }else{
                    $scope.tips = "注册成功，请登录邮箱激活";
                    $scope.success = "success";
                }

             }).error(errorcb);

    };


    
});



