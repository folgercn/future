


Number.prototype.satoshi = function(){

    var n = this * 1e8;

    // var s = String(n), index = s.indexOf(".");


    return this;
};

var csrfconfig = {headers:{"X-Csrf-Token": document.getElementById("token").value}};
