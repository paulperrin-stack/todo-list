const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Your main JS file
    output: {
        filename: 'main.js', // Bundled output file
        path: path.resolve(__dirname, 'dist'), // Output directory
        clean: true, // good addition: cleans dist folder before each build
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader', // Injects CSS into the DOM (<style> tag)
                    'css-loader'    // Interprets @import/url() and resolves paths
                ],
            },
        ],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        open: true,     // auto-opens browser
        hot: true,      // uncommented - enables hot module replacement
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        })
    ]
}