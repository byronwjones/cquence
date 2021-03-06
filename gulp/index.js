var gulp = require('gulp');

module.exports = function (tasks) {
    tasks.forEach(function (task) {
        if (!!task.deps) {
            gulp.task(task.name, task.deps, require('./tasks/' + task.name));
        } else {
            gulp.task(task.name, require('./tasks/' + task.name));
        }
    });

    return gulp;
};
