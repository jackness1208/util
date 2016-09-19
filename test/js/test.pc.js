test('util.flash.init', function(){
    var 
        params = {
            wmode:"opaque",// opaque|transparent|window
            width:300,
            height:300,
            flashvars:"a=0&b=1",
            flashUrl:"http://jackness.org/1.swf",
            bgcolor: '#000',
            fullscreen: false
        },
        name = 'testFlash',
        out = util.flash.init(name, params);



    ok(out !== '', 'util.flash.init  run check');
});
test('util.Promise', function(){
    var 
        r1 = '',
        r2 = '',
        padding = 0,
        pm1 = new util.Promise(),
        pm2 = new util.Promise();

    pm1.then(function(next){
        r1 += '1';
        next();

    }).then(function(next,prev){
        setTimeout(function(){
            r1 += '2';
            if(padding++){
                next();

            } else {
                prev();
            }
        }, 2000);

    }).then(function(next){
        r1 += '3';
    });
    
});
