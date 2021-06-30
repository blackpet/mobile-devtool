const path = require('path');

module.exports = {
  entry: './src/libs/firb-mobile-api.ts',
  output: {
    path: path.join(__dirname, '/static'),
    filename: 'firb-mobile-api-bundle.js',
    library: 'FirbMobile',
    libraryTarget: "umd",
    libraryExport: 'default',
  },

  module: {
    rules: [
      {
        test: /[\.js]$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /[\.ts]$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ]
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.js'],
  },

  mode: 'development',
}
