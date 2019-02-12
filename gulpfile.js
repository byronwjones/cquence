var tasks = [
    {name: 'clean', deps: null},
    {name: 'tsbuild', deps: ['clean']},
    {name: 'esmmin', deps: ['tsbuild']},
    {name: 'webpack', deps: ['tsbuild']}
];
var taskNames = tasks.map((t) => t.name);

var gulp = require('./gulp')(tasks);

gulp.task('default', taskNames);