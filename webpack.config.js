const path = require('path');
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name][contenthash].css');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const vendor = [path.resolve(__dirname,"./src/js/libs/jquery203.js")];

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
    devtool: 'source-map',
    module: {
        loaders: [{
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
    devServer: {
        contentBase: path.join(__dirname, "./build"),
        compress: true,
        port: 9001
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
        new webpack.BannerPlugin('Github:https://github.com/monw3c'),
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
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: 4,
            filename: "js/common.js",
        }),
        new CleanWebpackPlugin(['build'], {
            root: '',
            verbose: true,
            dry: false
        }),
    ],
};