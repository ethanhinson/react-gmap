/* eslint import/no-extraneous-dependencies: ["error", {devDependencies: true}] */
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    app: [
      '@babel/polyfill',
      './demo/index.jsx',
    ],
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './demo',
    hot: true,
    disableHostCheck: true,
    overlay: true,
    port: 8082,
  },
  devtool: 'inline-source-map',
});
