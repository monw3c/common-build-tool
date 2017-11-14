//const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DashboardPlugin = require('webpack-dashboard/plugin');

config.devServer = {
    contentBase: './build',
    host: 'localhost',
    port: 9001,
    inline: true, // 可以监控js变化
    hot: true, // 热启动
    compress: true,
    quiet: true,
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
        new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new DashboardPlugin()
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