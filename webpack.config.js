const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index_bundle.js',
  },
  target: 'electron-preload',
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    }, 
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(scss)$/,
      use: [{
        loader: 'style-loader', // inject CSS to page
      }, {
        loader: 'css-loader', // translates CSS into CommonJS modules
      }, {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      }, {
        loader: 'sass-loader' // compiles Sass to CSS
      }]
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      filename: 'index.html',
      template: './public/index.html', // source html
    }),
  ],
};
