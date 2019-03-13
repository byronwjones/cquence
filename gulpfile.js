var tasks = [
    {name: 'clean', deps: null},
    {name: 'tsbuild', deps: ['clean']},
    {name: 'esmmin', deps: ['tsbuild']},
    {name: 'webpack', deps: ['tsbuild']},

    {name: 'testbuild', deps: ['tsbuild']},
    {name: 'runtests', deps: ['testbuild']},
    {name: 'tslink', deps: ['tsbuild']},
    {name: 'es3build', deps: ['tslink']},
    {name: 'es3min', deps: ['es3build']}
];
var taskNames = tasks.map((t) => t.name);

var gulp = require('./gulp')(tasks);

gulp.task('default', taskNames);