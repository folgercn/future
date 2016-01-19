

var modules = ["session"], middleware = [], passed = false;



modules.forEach(function(str){

    middleware.push(require("./"+str));
});

module.exports = function*(next){

    var me = this, i, result;

    for(i = 0; i < middleware.length; i++){

        result = yield middleware[i].process(this);
        
        if(result){
            this.body = result;
            return;
        }
    }

    yield next;
};