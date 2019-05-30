
var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');


module.exports = {
  context: __dirname,
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/index',
  ],
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('./static/dist/'),
    filename: '[name]-[hash].js',
    publicPath: 'http://localhost:3000/static/web/bundles/',
  },
  devServer: {
    contentBase: './static/dist/',
    historyApiFallback: true,
    hot: true,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },

    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({
      filename: 'webpack-stats.prod.json',
      path: path.resolve('./static/dist/')
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
