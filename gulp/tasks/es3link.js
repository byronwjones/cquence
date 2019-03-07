const gulp = require('gulp');
const linker = require('./inlinify');
 
const tsMain = './src/lib/index.es3.ts';

module.exports = function () {
    return gulp.src(tsMain, {buffer: false})
        .pipe(linker())
        .pipe(gulp.dest('./src/lib/temp'));
};