var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // where to save the file
      filename: './dist/[name].bundle.css',
      allChunks: true,
    }),
  ],
};
