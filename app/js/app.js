





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

var errorcb = function(){
    alert("server error");
};


