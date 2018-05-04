const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    context: path.resolve(__dirname, './src/main/resources/static/app/'),
    entry: {
        vendor: [
            'react',
            'react-dom',
            'isomorphic-fetch',
            'mobx',
            'mobx-react',
            'babel-polyfill',
            'prop-types'
        ],
        login: './pages/framework/login/Login.jsx',
        main: './pages/framework/main/main.jsx'
    },
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/app/bundle/'),
        filename: '[name].js',
        publicPath: '/web/app/bundle'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-1'],
                        "plugins": ['transform-runtime', ['import', {
                            libraryName: 'antd',
                            style: 'css'
                        }], 'transform-decorators-legacy', 'transform-decorators']
                    }
                }]

            },
            {
                test: /\.css$/,
                exclude: [/node_modules|antd\.css/],
                loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
            },
            {
                test: /\.css$/,
                include: [/node_modules|antd\.css/],
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude: /^node_modules$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            }, {
                test: /\.(png|jpg|gif)$/,
                exclude: /^node_modules$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '/images/[hash:8].[name].[ext]',
                        limit: '8192'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['vendor', 'common', 'login'],
            inject: {
                head: ['vendor', 'common'],
                body: ['login']
            },
            hash: true,
            template: './pages/framework/main/main.html',
            filename: './login.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['vendor', 'common', 'main'],
            inject: {
                head: ['vendor', 'common'],
                body: ['main']
            },
            hash: true,
            template: './pages/framework/main/main.html',
            filename: './main.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        new webpack.DefinePlugin({ //正式版本开启
            'process.env': {
                NODE_ENV: JSON.stringify("production"),
            }
        }),
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['login', 'main'],
            filename: 'common.bundle.js',
            minChunks: 2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['common'],
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        })
    ]
};