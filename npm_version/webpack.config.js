const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './easyUpload'),
        filename: './index.js'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/index.css'
        }),
        new HtmlWebpackPlugin({
            template: './src/template.html',
            filename: './index.html'
        })
    ]
};