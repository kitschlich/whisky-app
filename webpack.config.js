var path = require('path');

var webpack = require('webpack');

var packageData = require('./package.json');

var filename = [packageData.name, packageData.version, 'js'];

module.exports = {
  entry: path.resolve(__dirname, packageData.mainView),
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: filename.join('.'),
  },
  devtool: 'source-map'
};
