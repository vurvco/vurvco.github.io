const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function getDevTool() {
    return 'source-map';
}

const webpackConfig = {
    entry: [
        './src/index.js', 
        './src/main.scss'
    ],
    output: {
        filename: './dist/build/index.[hash:7].js'
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
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
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
        new CleanWebpackPlugin(['./dist/build/']),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }), 
        new Webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: 'development',
          },
        }),
         new ExtractTextPlugin({
            filename: 'dist/build/[name].[hash:7].css',
            allChunks: true,
        }),
        new CopyWebpackPlugin([
            {from:'./src/data',to:'./dist/data'} 
        ]), 
    ],
    resolve: {
        modules: [Path.resolve(__dirname, './src'), 'node_modules']
    }
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
