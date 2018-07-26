var connect = require('gulp-connect');

module.exports = function () {
    return connect.server({
        root: 'dist'
    });
};
