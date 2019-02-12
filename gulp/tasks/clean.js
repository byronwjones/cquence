 // Remoce all .js; .map and .d.ts files

const gulp = require('gulp');
const clean = require('gulp-clean');

module.exports = function () {
    gulp.src(['./dist/esm', './dist/esm-min', './dist/umd'], {read: false})
        .pipe(clean());
    
    return gulp;
};