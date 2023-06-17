const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
gulp.task("sass", function () {
    return gulp.src("./static/styles/*.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./static/styles/css"))
})
gulp.task("watch", function () {
    gulp.watch("./static/styles/*.scss", gulp.series("sass"))
})
// Default Task
gulp.task("default", gulp.parallel("watch"))
