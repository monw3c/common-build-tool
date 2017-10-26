const webpack = require("webpack");
const config = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const path = require('path');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const extractCSS = new ExtractTextPlugin('css/[name][contenthash].css');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const vendor = [path.resolve(__dirname,"./src/js/libs/jquery203.js")];

config.plugins.push(
        new webpack.BannerPlugin('Github:https://github.com/monw3c'),
        //new webpack.HotModuleReplacementPlugin(), //热加载插件
        new CleanWebpackPlugin(['./build'], {
            root: '',
            verbose: true,
            dry: false
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          uglifyOptions: {
            ie8: false,
            output: {
              comments: false,
              beautify: false,
            },
            mangle: {
              keep_fnames: true
            },
            compress: {
              warnings: false,
              drop_console: true
            },
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + "/src/index.tmpl.html",
            thunks: ['common', 'index'],
            excludeChunks: ['list'],
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'list.html',
            template: __dirname + "/src/list.tmpl.html",
            thunks: ['common', 'list'],
            excludeChunks: ['index']
        })
)


module.exports = config;