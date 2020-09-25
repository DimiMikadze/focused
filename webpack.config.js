/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');

const STATIC_FILES = ['static', 'manifest.json'];
const HTML_FILES = ['popup', 'options', 'blocked'];
const ENTRY_POINTS = ['popup', 'options', 'background', 'blocked'];

const entryPoints = {};
ENTRY_POINTS.map((name) => {
  entryPoints[name] = path.join(srcPath, 'app/', name + '/', name + '.ts');
});

module.exports = (env, options) => {
  const isDevelopment = options.mode === 'development';

  return {
    devtool: isDevelopment && 'cheap-module-source-map',

    entry: entryPoints,

    output: {
      path: path.join(buildPath),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDevelopment,
              },
            },
            'css-loader',
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },

    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false,
      }),

      ...STATIC_FILES.map((name) => {
        return new CopyWebpackPlugin([
          {
            from: path.join(srcPath, name),
            to: path.join(buildPath, name),
          },
        ]);
      }),

      ...HTML_FILES.map((fileName) => {
        return new HtmlWebpackPlugin({
          template: path.join(srcPath, fileName + '.html'),
          filename: fileName + '.html',
          chunks: [fileName],
        });
      }),
    ],
  };
};
