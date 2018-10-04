const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function getDevTool() {
    return 'source-map';
}

const webpackConfig = {
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
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.csv$/,
                loader: 'csv-loader',
                options: {
                  dynamicTyping: true,
                  header: true,
                  skipEmptyLines: true
                }
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
        new CopyWebpackPlugin([
            {from:'./src/data',to:'./dist/data'} 
        ]), 
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
