const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const autoprefixer = require("gulp-autoprefixer")
const cleanCSS = require("gulp-clean-css")
const livereload = require("gulp-livereload")
const bundleJS = require("gulp-uglify")

gulp.task("bundleJS", function () {
    return gulp.src("./static/js/*.js").pipe(bundleJS()).pipe(gulp.dest("./static/js/")).pipe(livereload())
})

gulp.task("sass", function () {
    return gulp
        .src("./static/styles/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./static/styles/css"))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(livereload())
})
gulp.task("watch", function () {
    livereload.listen() // Start livereload
    gulp.watch("./static/styles/*.scss", gulp.series("sass", "bundleJS"))
})
// Default Task
gulp.task("default", gulp.parallel("watch", "sass", "bundleJS"))
