const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');

function serve() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("src/stylesheets/sass/*.sass", gulp.series(sass));
    // gulp.watch("templates/main.sass", gulp.series());
    gulp.watch("index.html").on('change', browserSync.reload);
}

function sass() {
    return gulp.src("src/stylesheets/sass/main.sass")
        .pipe(sassGlob())
        .pipe(gulpSass())
        .pipe(gulp.dest("src/stylesheets/css"))
        .pipe(browserSync.stream());
}

exports.default = gulp.series(sass, serve);