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



    ok(new RegExp("<object [^>]*name=\""+ name +"\"", 'g').test(out), 'op.name check');
});
