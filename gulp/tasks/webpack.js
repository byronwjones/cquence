 // Create UMD using Webpack

 const gulp = require('gulp');
 const webpack = require('webpack');
 const gWebpack = require('webpack-stream');
  
 const tsConfigFile = './tsconfig.json';
 
 module.exports = function () {
    return gulp.src('./dist/esm/index.js')
    .pipe(gWebpack({
      watch: false,
      mode: 'production',
      devtool: 'source-map',
      output: {
        filename: 'cquence.js',
        library: 'cq', // window.cq
        libraryTarget: 'umd', // supports commonjs, amd and web browsers
        globalObject: 'this'
      }
    }, webpack))
    .pipe(gulp.dest('./dist/umd'));
 };