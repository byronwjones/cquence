const gulp = require('gulp');
const mocha = require('gulp-mocha');
 
const tsConfigFile = './tsconfig.json';

module.exports = function () {
    return gulp.src('./test/spec/test/index.spec.js', {read: false})
        .pipe(mocha({
            require: '@babel/register'
        }));
};