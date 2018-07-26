var gulp = require('gulp');
var flatten = require('gulp-flatten');

module.exports = function () {
    var g = gulp;
    
    g.src([
            './index.html'
        ])
        .pipe(gulp.dest('dist'));
    
    g.src([
            './src/controllers/**/*.html'
        ])
        .pipe(flatten())
        .pipe(gulp.dest('dist/templates/controller'));
    
    g.src([
            './src/components/**/*.html',
            './src/directives/**/*.html'
        ])
        .pipe(flatten())
        .pipe(gulp.dest('dist/templates/component'));
    
    return g;
};
