const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const autoprefixer = require("gulp-autoprefixer")
const cleanCSS = require("gulp-clean-css")
const livereload = require("gulp-livereload")
const bundleJS = require("gulp-uglify")

const uglify = require("gulp-uglify")
const rename = require("gulp-rename")
const argv = require("yargs").argv

gulp.task("bundleJS", () => {
    return gulp.src("./static/js/*.js").pipe(bundleJS()).pipe(gulp.dest("./static/js/gulp-js")).pipe(livereload())
})

gulp.task("server-uglify", () => {
    const compress = argv.c || argv.compress
    const mangle = argv.m || argv.mangle
    const output = argv.o || argv.output || "ugly.js"

    return gulp.src("server.js").pipe(uglify({ compress, mangle })).pipe(rename(output)).pipe(gulp.dest("./")).pipe(livereload())
})

gulp.task("sass", () => {
    return gulp
        .src("./static/styles/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./static/styles/css"))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(livereload())
})
gulp.task("watch", () => {
    livereload.listen() // Start livereload
    gulp.watch("./static/styles/*.scss", gulp.series("sass"))
    gulp.watch("./static/js/*.js", gulp.series("bundleJS"))
    gulp.watch("server.js", gulp.series("server-uglify"))
})
// Default Task
gulp.task("default", gulp.parallel("watch", "sass", "bundleJS"))
