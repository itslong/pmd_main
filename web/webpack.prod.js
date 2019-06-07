const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './web/src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      filename: 'web/webpack-stats.prod.json',
      // path: path.resolve('./static/dist/')
    }),
    new Dotenv({path: 'web/.env'})
  ],
  output: {
    filename: '[name]-[hash].prod.bundle.js',
    path: path.resolve('./web/bundles/dist/')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react', 
              {
                'plugins': ['transform-class-properties']
              },
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
