//const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config');

config.devServer = {
    contentBase: './build',
    host: 'localhost',
    port: 9001,
    inline: true, // 可以监控js变化
		hot: true, // 热启动
		compress: true,
		watchContentBase: false
    // proxy: {
    //  '/test/*': {
    //    target: 'http://localhost',
    //    changeOrigin: true,
    //    secure: false
    //  }
    // }
}

config.plugins.push(
        new webpack.HotModuleReplacementPlugin() //热加载插件
)

config.module.loaders.push(
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: [
      'style-loader',
      'css-loader',
      'scss-loader'
    ]
  }
);

config.devtool='source-map',
// config.plugins.push(
//   new webpack.SourceMapDevToolPlugin({
//     filename: '[file].map',
//     exclude: ['vendor.js'] // vendor 通常不需要 sourcemap
//   })
// );

module.exports = config;