var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  // output: {
  //   filename: 'bundle.js',
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['latest', { modules: false }],
          ],
        },
      },
    ],
  },
};

// config.plugins = [
//   new BundleTracker({ filename: './djangostarter/apps/static/webpack/webpack-stats.production.json' }),
//   new webpack.DefinePlugin({
//     'process.env': {
//       NODE_ENV: JSON.stringify('production'),
//       BASE_URL: JSON.stringify('http://0.0.0.0/'),
//     }
//   }),
//   new webpack.LoaderOptionsPlugin({
//     minimize: true
//   }),
//   new webpack.optimize.UglifyJsPlugin({
//     mangle: false,
//     sourcemap: true,
//     compress: {
//       warnings: true
//     }
//   })
// ];

// var path = require('path');

// module.exports = {

//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'babel-loader',
//             options: {
//               presets: [['es2015', { modules: false }], 'stage-2', 'react']
//             }
//           }
//         ]
//       },
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
//       {
//         test: /\.styl$/,
//         use: [
//           'style-loader',
//           {
//             loader: 'css-loader',
//             options: {
//               modules: true,
//               localIdentName: '[name]__[local]___[hash:base64:5]'
//             }
//           },
//           'stylus-loader'
//         ]
//       }
//     ]
//   },
//   resolve: {
//     modules: [
//       path.join(__dirname, 'static/js/src'),
//       'node_modules'
//     ],
//     extensions: ['.js', '.jsx']
//   }
// };
