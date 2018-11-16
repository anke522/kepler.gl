// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import webpack from 'webpack';
import {StatsWriterPlugin} from 'webpack-stats-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import path from 'path';

const webpackConfig = require('./config')();

const src = path.resolve(__dirname, '../src');

export default {

  ...webpackConfig,

  output: {
    ...webpackConfig.output,
    filename: 'main-[hash].js',
    sourceMapFilename: '../_maps/main.map'
  },

  devtool: 'source-map',

  module: {
    rules: [...webpackConfig.module.rules, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: src
    },
    // {
    //   test: /\.scss$/,
    //   loader: ExtractTextPlugin.extract({
    //     fallbackLoader: 'style-loader',
    //     // TODO: need to add postcss to replace the autoprefix-loader that is deprecated
    //     loader: 'css-loader!sass-loader'
    //   }),
    //   include: src
    // }
    ]
  },

  plugins: [

    ...webpackConfig.plugins,

    // new ExtractTextPlugin({filename: 'styles-[hash].css'}),

    // new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true, compressor: {comparisons: false, warnings: false}}),

    // new StatsWriterPlugin({
    //   fields: null,
    //   transform: (data, opts) => {
    //     const stats = opts.compiler.getStats().toJson({ chunkModules: true });
    //     return JSON.stringify(stats, null, 2);
    //   },
    // }),
    new StatsWriterPlugin({
      filename: 'files.json',
      transform: data => JSON.stringify({
        main: data.assetsByChunkName.main[0],
        style: data.assetsByChunkName.main[1]
      })
    }),
    // new StatsWriterPlugin({
    //   fields: null,
    //   filename: 'manifest.json',
    //   transform: data => JSON.stringify(data.assets.reduce((out, cur) => {
    //     if (cur.name.startsWith('.')) {
    //       return out;
    //     }
    //     return {
    //       ...out, [cur.name]: `dist/${cur.name}`
    //     };
    //   }, {}))
    // }),

    new ProgressBarPlugin()
  ],

  stats: {
    colors: true,
    reasons: false,
    hash: false,
    version: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    cached: false,
    cachedAssets: false
  }

};