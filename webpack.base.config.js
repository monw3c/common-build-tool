const path = require('path');
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name][contenthash].css');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const vendor = [path.resolve(__dirname,"./src/js/libs/jquery203.js")];

// 源代码的根目录（本地物理文件路径）
const SRC_PATH = path.resolve('./src');
// 打包后的资源根目录（本地物理文件路径）
const BUILD_PATH = path.resolve('./build');
// 资源根目录（可以是 CDN 上的绝对路径，或相对路径）
const ASSETS_PATH = '/assets/';

//获取项目入口js文件
function getEntry() {
    var jsPath = path.resolve(__dirname, 'src/js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve('src', 'js', item);
        }
    });
    //files.vendor = vendor
    return files;
}

module.exports = {
    // entry: {
    //     index: path.resolve(__dirname, './src/js/index.js'),
    //     list: path.resolve(__dirname, './src/js/list.js'),
    //     vendor: ["./src/js/libs/jquery203.js"],
    // },
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'js/[name][hash].js',
        chunkFilename: 'js/[chunkhash:8].chunk.js'
    },
    module: {
        loaders: [
        // {
        //     enforce: 'pre',
        //     test: /\.js?$/,
        //     exclude: /node_modules/,
        //     loader: 'eslint-loader'
        // },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        },
        {
            test: /\.css$/,
            use: extractCSS.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }]
            })
        },
        {
            // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            // 如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            include: path.resolve(__dirname, './src/imgs'),
            // loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: './imgs/[hash].[ext]',
            }
        },
        {
            // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
            test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            include: path.resolve(__dirname, './src/fonts'),
            // exclude: /glyphicons/,
            // loader: 'file-loader?name=static/fonts/[name].[ext]',
            loader: 'file-loader',
            options: {
                name: './fonts/[name].[hash].[ext]',
            }
        },
        // {
        //     test: /\.ejs$/,
        //     include: path.resolve(__dirname, './src/ejs'),
        //     loader: 'ejs-loader',
        // },
        ]
    },
    
    resolve: {
        extensions: ['.js','.scss','.ts'],
        modules: ['node_modules'],
        alias: {
            jquery: path.resolve(__dirname,'./src/js/libs/jquery203.js')
        }
    },
    plugins: [
        extractCSS,
        new CleanWebpackPlugin([BUILD_PATH], {
            root: '',
            verbose: true,
            dry: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 4
            //filename: "js/common.js",
        }),
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
        })
    ],
};

