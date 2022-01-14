const path = require('path');

module.exports = {
  /*  entry: './src/libs/mobile-api.ts',
    output: {
      path: path.join(__dirname, '/static'),
      filename: 'mobile-api-bundle.js',
      library: 'MobileApi',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },*/

  entry: './src/libs/nbridge/nbridge.ts',
  output: {
    path: path.join(__dirname, '/static'),
    filename: 'nbridge-bundle.js',
    library: 'nbridge',
    libraryTarget: 'umd',
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
