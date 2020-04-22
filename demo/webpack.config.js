#!/usr/bin/env node
/**
 * @File   : webpack.config.js
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-6-8 15:55:42
 * @Description:
 */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDEV = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDEV ? 'development' : 'production',
  devtool: 'none',

  entry: {
    main: isDEV
    ? [
      'webpack-dev-server/client?/',
      'webpack/hot/dev-server',
      path.resolve(__dirname, './index.ts')
    ]
    : path.resolve(__dirname, './index.ts')
    
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(atlas|atlas\.json)$/,
        use: [
          {
            loader: path.resolve(__dirname, '../lib/index.js'),
            options: {
              base64: {
                enabled: false,
                threshold: 100,
                includeIndex: true,
                excludes: []
              },
              process: {
                enabled: true,
                processors: [{
                  test: /\.png/g,
                  async process(options) {
                    console.log('process', options);

                    return options.data;
                  }
                }]
              },
              publish: {
                enabled: !isDEV,
                exclude: [],
                publisher: {
                  async publish(options) {
                    console.log('publish', options);

                    return options.distPath;
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 15000
          }
        }
      }
    ]
  },

  plugins: isDEV
    ? [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({template: './demo/index.html'})
    ]
    : [
      new HtmlWebpackPlugin({template: './demo/index.html'})
    ]
};
