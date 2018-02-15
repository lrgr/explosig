var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: ['./src/js/index.js', './src/scss/main.scss'],
  output: {
    filename: './dist/bundle.js'
  },
  module: {
    rules: [
      { // css / sass / scss loader
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        })
      },
      { // es2015 for d3 v4
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // where to save the file
      filename: './dist/[name].bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      filename: './dist/index.html',
      template: './src/index.html'
    }),
  ],
  devServer: {
    contentBase: 'dist'
  }
};
