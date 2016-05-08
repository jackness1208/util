'use strict';
var util = require('../base/util.js');


if(typeof define != 'undefined' && define.amd){
    define([], function(){
        return util;
    });

} else {
    window.util = util;
}
