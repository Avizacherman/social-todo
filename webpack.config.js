var webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: './public/javascript',
    filename: '[name].js',
    chunkFilename: "[id].js"
  },
  module: {
    loaders: [{
      test: /\.js/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel?presets[]=es2015', 'ng-annotate'],
    },
    {
      test: /\.html/,
      loader: 'html'
    }]
  }
}
