const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');


module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      filename: 'webpack-stats.prod.json',
      path: path.resolve(__dirname, './static/web/prod/')
    }),
  ],
  output: {
    filename: '[name]-[hash].prod.bundle.js',
    path: path.resolve(__dirname, './static/web/prod/bundles/')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
