'use strict';
 
module.exports = {
    //页面入口文件配置
    entry: {
        pc : './src/pc/util.pc.js',
        mobile : './src/mobile/util.mobile.js'
    },
    //入口文件输出配置
    output: {
        path: './dist',
        filename: '[name].js'
    }
};
