const gulp = require('gulp');
const tsc = require('gulp-use-tsconfig');
 
const tsConfigFile = './tsconfig.tests.json';

module.exports = function () {
    return gulp.src(tsConfigFile)
        .pipe(tsc.build());
};