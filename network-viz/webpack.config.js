var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

function getDevTool() {
    return 'source-map';
}

var webpackConfig = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: './dist/scripts/[name].min.js'
    },
    devtool: getDevTool(),
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [  
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),  
        new Webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: 'development',
          },
        }),
        new ExtractTextPlugin('./dist/styles/main.css', {
            allChunks: true
        }),
    ]
};

webpackConfig.devServer = {
    contentBase: Path.join(__dirname, './src/'),
    publicPath: 'http://localhost:8080/',
    hot: true,
    port: 8080,
    inline: true,
    progress: true,
    historyApiFallback: true,
};

module.exports = webpackConfig;
