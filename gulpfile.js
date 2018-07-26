var gulp = require('./gulp')([
    'browserify',
    'html',
    'serve'
]);

gulp.task('default', ['browserify', 'html', 'serve']);
gulp.task('build', ['browserify', 'html']);
