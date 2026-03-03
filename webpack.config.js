const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Your main JS file
    output: {
        filename: 'main.js', // Bundled output file
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    mode: 'development', // Change to 'production' later for minification
    /*
    module: {
        rules: [
            {
                test: /\.js$/, // For JS files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    }, */
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Serve from dist
            },
            compress: true,
            port: 9000, // Or any port
            client: {
                logging: 'warn',
                overlay: true,
            }
            hot: true, // Hot module replacement
            open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
        })
    ]
};