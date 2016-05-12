'use strict';
 
module.exports = {
    //页面入口文件配置
    entry: {
        'util.pc' : './src/pc/util.pc.js',
        'util.mobile' : './src/mobile/util.mobile.js'
    },
    //入口文件输出配置
    output: {
        path: './dist',
        filename: '[name].js'
    }
};
