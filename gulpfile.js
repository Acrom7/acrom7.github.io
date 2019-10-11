const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const useref = require('gulp-useref');
const autoprefixer = require('gulp-autoprefixer');

function serve() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false
    });

    gulp.watch("src/sass/*.sass", gulp.series(sass));
    gulp.watch("src/js/*.js").on("change", gulp.series(bundle, browserSync.reload));
    gulp.watch("src/index.html").on('change', gulp.series(bundle, browserSync.reload));
    gulp.watch("src/orders.html").on('change', gulp.series(bundle, browserSync.reload));
}

function sass() {
    return gulp.src("src/sass/main.sass")
        .pipe(sassGlob())
        .pipe(gulpSass({outputStyle: 'expanded'}))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.stream());
}

function bundle() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('./'));
}

exports.bundle = gulp.parallel(sass, bundle);
exports.serve = gulp.series(gulp.parallel(sass, bundle), serve);