const gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    cssbeautify = require('gulp-cssbeautify'),
    del = require('del'),
    newer = require('gulp-newer')

//npm i --save-dev gulp-less browser-sync gulp-cssbeautify reset-css del
const srcChange = 'app/change' 

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
})

gulp.task('html', () => {
    return gulp.src('app/*.html')
        .pipe(browserSync.stream())
});

gulp.task('js', () => {
    return gulp.src('app/**/*.js')
        .pipe(browserSync.stream())
});

gulp.task('less', () => {
    return gulp.src(['app/less/**/*.less', '!app/less/**/_*.less'])
        .pipe(newer(srcChange))
        .pipe(gulp.dest(srcChange))
        .pipe(less())
        .pipe(cssbeautify())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
});

gulp.task('css', () => {
    return gulp.src('app/css/*.css')
        .pipe(cssbeautify())
        .pipe(gulp.dest('app/css/'))
})

function cleandist() {
    return del('dist/**/*', { force: true })
}

function buildcopy() {
    return gulp.src([
        'app/css/**/*.css',
        'app/js/**/*.js',
        'app/img/**/*',
        'app/fonts/**/*',
        'app/**/*.html'
    ], { base: 'app' })
        .pipe(gulp.dest('dist'))
}

gulp.task('build', gulp.series(cleandist, buildcopy))

gulp.task('watch', () => {
    gulp.watch('app/less/**/*.less', gulp.parallel('less'))
    gulp.watch('app/*.html', gulp.parallel('html'))
    gulp.watch('app/**/*.js', gulp.parallel('js'))
})

gulp.task('default', gulp.parallel('browser-sync', 'watch'))
