const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const prod = process.env.NODE_ENV === 'production'
const Extract = require("extract-text-webpack-plugin")
module.exports = {
    devtool: 'eval-source-map',
    // entry: __dirname + '/app/main.js',
    entry: {
        main: __dirname + '/app/main.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            // { enforce: 'pre', test: /\.(js|vue)$/, loader: 'eslint-loader' },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.pug$/,
                use: {
                    loader: "pug-loader"
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /(\.scss$|\.sass$)/,
                use: [{
                        loader: "style-loader" 
                    }, {
                        loader: "css-loader" 
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: "url-loader?limit=8192"
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-withimg-loader'
                    },
                    {
                        loader: 'html-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: './public',
        inline: true,
        port: 8888
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.html'
        })
    ]
}