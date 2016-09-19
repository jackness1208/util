'use strict';
var util = require('../base/util.js');

util.extend(util, {

    /* PC only
     * ---------------------------------------------*/
    UA: {
        ie:'ActiveXObject' in window && /(msie |Trident\/.*rv\:)(\d*)/i.test(navigator.userAgent) ? RegExp.$2 : false
    },

    flash:{

        options: {
            wmode:"opaque",// opaque|transparent|window
            width:300,
            height:300,
            flashvars:"",
            flashUrl:"",
            bgcolor: '#000',
            fullscreen: false
        },
        /**
         * 初始化 flash对象，返回插入flash用的string代码
         *
         * @param   {String} name          定义flash的名称,其中 <object> 的id 为 "object_" + name,<embed> 的id 为 "embed_" + name
         * @param   {String} op.wmode      设置wmode的模式取值范围为 opaque|transparent|window, 默认为 opaque
         * @param   {Number} op.width      设置flash对象的宽度值
         * @param   {Number} op.height     设置flash对象的高度值
         * @param   {Number} op.flashvars  设置 flash对象的 flashvars值
         * @param   {Number} op.flashUrl   设置 flash对象的 地址
         * @param   {Number} op.fullscreen 设置 是否运行全屏
         * @param   {Number} op.bgcolor    设置 flash 背景颜色
         * @return  {void}
         */
        init:function(name,op){
            var 
                self = this,
                option = util.extend({}, self.options, op);

            if(option.flashUrl === ""){
                return;
            }

            var writeHTML = [
                '<object ',
                    'id="{$name}" ',
                    'name="{$name}" ',
                    'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ',
                    'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10.0.32" ',
                    'data="{$flashUrl}" ',
                    'width="{$width}" ',
                    'height="{$height} ',
                '">',
                    '<param name="movie" value="{$flashUrl}" />',
                    '<param name="flashvars" value="{$flashvars}" />',
                    '<param name="quality" value="high" />',
                    '<param name="allowscriptaccess" value="always" />',
                    '<param name="wmode" value="{$wmode}"/>',
                    '<param name="bgcolor" value="{$bgcolor}"/>',
                    '<param name="allowFullScreen" value="{$fullscreen}"/>',
                    '<param name="allowFullScreenInteractive" value="{$fullscreen}"/>',
                    '<embed ',
                        'id="embed_{$name}" ',
                        'src="{$flashUrl}" ',
                        'width="{$width}" ',
                        'height="{$height}" ',
                        'allowFullScreen="{$fullscreen}" ',
                        'allowFullScreenInteractive="{$fullscreen}" ',
                        'allowscriptaccess="always" ',
                        'quality="high" ',
                        'pluginspage="http://www.macromedia.com/go/getflashplayer" ',
                        'flashvars="{$flashvars}" ',
                        'bgcolor="{$bgcolor}" ',
                        'type="application/x-shockwave-flash" ',
                        'wmode="{$wmode}" ',
                    '></embed>',
                '</object>'
            ].join("");
            return writeHTML
                .replace(/\{\$name\}/g, name)
                .replace(/\{\$width\}/g, option.width)
                .replace(/\{\$height\}/g, option.height)
                .replace(/\{\$flashUrl\}/g, option.flashUrl)
                .replace(/\{\$flashvars\}/g, option.flashvars)
                .replace(/\{\$wmode\}/g, option.wmode)
                .replace(/\{\$bgcolor\}/g, option.bgcolor)
                .replace(/\{\$fullscreen\}/g, option.fullscreen);
        },

        write:function(name,op){
            var writeHTML = this.init(name,op);
            if(writeHTML){
                document.write(writeHTML);
            }
        },

        add:function(target,name,op){
            var innerHTML = this.init(name,op);
            if(!target){
                return;
            }
            if(innerHTML){
                target.innerHTML= innerHTML;
            }
        },
        /*
         * util.flash.ctrl(name)
         * 获取 flash对象(主要用于调用flash提供的方法),只有通过 util.flash.write()/util.flash.add()方法添加上去的flash才受控制
         * <pre>
         * util.flash.ctrl("flashObj").f2s_alert();
         * </pre>
         * @param:   {string} name: 通过 util.flash.write() 或者 util.flash.add() 方法添加的flash对象中 的 name 值
         */
        ctrl:function(name){
            var iObj = document.getElementById(name);
            
            //IE浏览器
            if(util.UA.ie){
                return iObj.tagName.toLowerCase() === 'object' ? 
                    iObj : 
                    '' ;
            
            //非IE浏览器    
            } else {
                return iObj.tagName.toLowerCase() === 'embed' ? 
                    iObj : 
                    iObj.getElementsByTagName('embed')[0] ;
            }
        }
    },
    request:{
        search:function(key){
            var s = location.search.replace(/[? ]/g,"");
            if(s === ""){return null;}

            var g = s.split("&");
            for(var i = 0, len = g.length; i < len; i++){
                var f = g[i].split("=");
                if(f.length <= 1){continue;}

                var k = f[0],
                    v = f[1];
                if(k === key){return v;}
            }
            return null;
        },
        hash:function(key,val){
            var s = location.hash.replace(/[# ]/g,""),
                isVal = typeof val != "undefined",
                isMatch = false;
            if(s === "" && !isVal){return null;}

            var g = s.split("&");

            for(var i = 0, len = g.length; i < len; i++){
                var f = g[i].split("=");
                if(f.length <= 1){continue;}

                var k = f[0],
                    v = f[1];
                if(k === key){
                    if(isVal){
                        g[i] = k + "=" + val;
                        isMatch = true;
                    } else {
                        return v;
                    }
                }
            }
            if(!isMatch){
                g.push(key + "=" + val);
            }

            if(isVal){
                window.location.hash = g.join("&");
                return g.join("&");
            }

            return null;
        }
    },

    /**
     * css样式设置/获取
     * @param   {object}      target     目标对象
     * @param   {string}      styleAttr  css属性名称
     * @param   {string|null} value      需要设置的css属性名称
     */
    css:function(target,styleAttr,value){

        if(!target || typeof target.style == "undefined" || typeof styleAttr != "string"){return;}

        if(typeof value != "undefined"){
            //set
            target.style[styleAttr] = value;
        }
        else{
            //get
            var fStyleValue = target.style[styleAttr];
            if(fStyleValue){
                return fStyleValue;
            }
            else{
                try{
                    return  target.currentStyle?target.currentStyle[styleAttr]:document.defaultView.getComputedStyle(target,false)[styleAttr];
                }
                catch(e){
                    return null;
                } 
            }
        }
    },

    getPosition: function(target){
        var 
            contentDocument = document; 

        if(arguments[2]){
            contentDocument = arguments[2];
        }

        var 
            iLeft = target.offsetLeft,
            iTop = target.offsetTop,
            iTar = target;

        if(util.css(target, 'position') == "fixed"){
            iLeft += contentDocument.documentElement.scrollLeft || contentDocument.body.scrollLeft; 
            iTop += contentDocument.documentElement.scrollTop || contentDocument.body.scrollTop; 
        } 

        iTar = target.offsetParent;

        while(iTar){
            iLeft += iTar.offsetLeft || 0;
            iTop += iTar.offsetTop || 0; 

            iTar = iTar.offsetParent;
        } 
        return {
            left: iLeft, 
            top: iTop
        };
    },
    /**
     * stop bubble 阻止事件冒泡
     */
    stopBubble:function(e){
        e = e || window.event;
        if(e.stopPropagation){
            e.stopPropagation();
        }

        e.cancelBubble = true;
    },

    /**
     * preventDefault 阻止浏览器默认事件
     */
    preventDefault:function(e){
        e = e || window.event;
        if("preventDefault" in e){
            e.preventDefault();
        } else if("returnValue" in e){
            e.returnValue = false;
        }
    },

    select: {
        disable: function(){
            document.onselectstart = function(){
                return false;
            };

            if(window.getSelection){
                window.getSelection().removeAllRanges();

            } else {
                document.selection.empty();

            }

        },

        enable: function(){
            document.onselectstart = null;
        }

    },

    /**
     * 判断是否属于从属关系
     * jns.isBelong(target,srcElement)
     *
     * @param   {object} target    目标对象(父级)
     * @param   {object} belongOne 目标对象(被判断对象)
     */
    isBelong:function(target, srcElement){
        for(var _belongOne = srcElement;_belongOne;_belongOne = _belongOne.parentNode){
            if(_belongOne === target){
                return true;
            }
        }
    },

    inertiaMotion: function(So,St,T){
        var 
            sArray = [],
            //摆动，惯性运动,利用的是sin 的特性,再用次方 加强幅度
            swingHandle = function(){
                var S = St - So;
                
                for(var i = 0, len = T; i < len; i++){
                    sArray[i] = parseInt(S * Math.pow(Math.sin(i/T*Math.PI/2),3)*100)/100 + So;
                }

            };

        swingHandle();

        return{
            Sn:function(Tn){
                return Tn > T? St : sArray[Tn];
            }
        };
    },

    JSON: !('JSON' in window)? function() {function f(n) {return n < 10 ? '0' + n: n; } Date.prototype.toJSON = function() {return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z'; }; var m = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'}; function stringify(value, whitelist) {var a, i, k, l, r = /["\\\x00-\x1f\x7f-\x9f]/g, v; switch (typeof value) {case 'string': return r.test(value) ? '"' + value.replace(r, function(a) {var c = m[a]; if (c) {return c; } c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16); }) + '"': '"' + value + '"'; case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) {return 'null'; } if (typeof value.toJSON === 'function') {return stringify(value.toJSON()); } a = []; if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {l = value.length; for (i = 0; i < l; i += 1) {a.push(stringify(value[i], whitelist) || 'null'); } return '[' + a.join(',') + ']'; } if (whitelist) {l = whitelist.length; for (i = 0; i < l; i += 1) {k = whitelist[i]; if (typeof k === 'string') {v = stringify(value[k], whitelist); if (v) {a.push(stringify(k) + ':' + v); } } } } else {for (k in value) {if (typeof k === 'string') {v = stringify(value[k], whitelist); if (v) {a.push(stringify(k) + ':' + v); } } } } return '{' + a.join(',') + '}'; } } return {stringify: stringify, parse: function(text, filter) {var j; function walk(k, v) {var i, n; if (v && typeof v === 'object') {for (i in v) {if (Object.prototype.hasOwnProperty.apply(v, [i])) {n = walk(i, v[i]); if (n !== undefined) {v[i] = n; } else {delete v[i]; } } } } return filter(k, v); } if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {j = eval('(' + text + ')'); return typeof filter === 'function' ? walk('', j) : j; } throw new SyntaxError('parseJSON'); } }; }(): JSON,

    getCssProperty:function(cssProperty){
        var 
            firstLetter = cssProperty.substr(0,1),
            otherStrs = cssProperty.substr(1),
            fUpperStrs = firstLetter.toUpperCase() + otherStrs,
            fLowerStrs = firstLetter.toLowerCase() + otherStrs,
            privateAttrs = [
                fLowerStrs,
                "Webkit" + fUpperStrs,
                "Moz" + fUpperStrs,
                "O" + fUpperStrs,
                "-ms-" + fUpperStrs,
                "ms" + fUpperStrs
            ],
            style = document.documentElement.style;
        for(var i = 0,fCssAttr, len = privateAttrs.length; i < len; i++){
            fCssAttr = privateAttrs[i];
            if(fCssAttr in style){
                return fCssAttr;
            }
        }
        return null;
    }
});


if(typeof define != 'undefined' && define.amd){
    define([], function(){
        return util;
    });

}
window.util = util;
