var gulp = require('gulp');

module.exports = function (tasks) {
    tasks.forEach(function (task) {
        if (task instanceof Object) {
            gulp.task(task.name, task.deps, require('./tasks/' + task.name));
        } else {
            gulp.task(task, require('./tasks/' + task));
        }
    });

    return gulp;
};
