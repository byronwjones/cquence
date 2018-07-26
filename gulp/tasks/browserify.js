var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function () {
    var b = browserify({
        entries: 'src/app.js',
        debug: (process.env.NODE_ENV !== 'production')
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('dist/js'));

    return b;
};
