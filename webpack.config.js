const path = require('path');
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name].css');


module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/js/index.js'),
        list: path.resolve(__dirname, './src/js/list.js'),
        vendor: ["./src/js/libs/jquery203"],
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'js/[name][hash].js',
        chunkFilename: 'js/[chunkhash:8].chunk.js'
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader', //在webpack的module部分的loaders里进行配置即可
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader'])
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "./build"),
        compress: true,
        port: 9000
    },
    plugins: [
        extractCSS,
        new webpack.BannerPlugin('QQ:505038730 ! Github:https://github.com/monw3c'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + "/src/index.tmpl.html",
            thunks: ['common', 'index'],
            excludeChunks: ['list']
        }),
        new HtmlWebpackPlugin({
            filename: 'list.html',
            template: __dirname + "/src/list.tmpl.html",
            thunks: ['common', 'list'],
            excludeChunks: ['index']
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
            filename: "js/common.js",
        })
    ],
};