let path = require('path');
let webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: {
                    glob: 'src/index.html',
                    dot: true
                },
                to: 'index.html'
            },
            {
                from: 'src/img',
                to: 'img',
            },
        ])
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};