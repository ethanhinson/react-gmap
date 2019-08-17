/* eslint import/no-extraneous-dependencies: ["error", {devDependencies: true}] */
const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common');

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};
const reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

module.exports = merge(common, {
  entry: {
    'react-gmaps': './src/index.js',
    'react-gmaps.min': './src/index.js',
  },

  externals: {
    react: reactExternal,
    'react-dom': reactDOMExternal,
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'ReactGmaps',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      defaultSizes: 'gzip',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
});
