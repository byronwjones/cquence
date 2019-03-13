const gulp = require('gulp');
 const minify = require('gulp-uglify');
 const pump = require('pump');
 const rename = require('gulp-rename');
 
 module.exports = function () {
     pump([
        gulp.src('./dist/es3/cquence.js'),
        minify(),
        rename({ suffix: '.min' }),
        gulp.dest('./dist/es3/')
     ], function callback(err){
         if(!!err) {
             console.log(err);
         }
     });
     
     return gulp;
 };