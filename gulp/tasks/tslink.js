const gulp = require('gulp');
const tslink = require('gulp-ts-link');
 
const tsMain = './src/lib/index.tslink.ts';

module.exports = function () {
    return gulp.src(tsMain, {buffer: false})
        .pipe(tslink('cquence.ts'))
        .pipe(gulp.dest('./src/lib/temp'));
};