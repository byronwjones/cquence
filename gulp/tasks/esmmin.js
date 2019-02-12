 // Remoce all .js; .map and .d.ts files

 const gulp = require('gulp');
 const minify = require('gulp-uglify-es').default;
 const sourcemaps = require('gulp-sourcemaps');
 const pump = require('pump');
 
 module.exports = function () {
     pump([
        gulp.src('./dist/esm/**/*.js'),
        sourcemaps.init(),
        minify(),
        sourcemaps.write("./maps"),
        gulp.dest('./dist/esm-min')
     ], function callback(err){
         if(!!err) {
             console.log(err);
         }
     });
     //gulp.src('./dist/esm/**/*.js')
         //.pipe(minify())
        // .pipe(gulp.dest('./dist/esm-min'));
     
     return gulp;
 };