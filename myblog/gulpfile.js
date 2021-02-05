// including plugins
const gulp = require('gulp')
const minifyCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const gp_concat = require('gulp-concat')
const gp_rename = require('gulp-rename')
const gp_uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const path = require('path')

// Add CSS files
gulp.task('css', function(){
    return gulp.src(
            [
                './public/plugins/vendors/morrisjs/morris.css',
                './public/css/style.css'
            ]
        )
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gp_concat('style.min.css'))
        .pipe(gulp.dest('./public/dist/css/'))
})

/*
// When using a theme, usuually there is a fonts
// directory that should be copied to dist
*/
gulp.task('copy-fonts', function(){
    return gulp.src(
            [
                './public/fonts/**'
            ]
        )
        .pipe(gulp.dest('./public/dist/fonts/'))
})

gulp.task('style', ['css', 'copy-fonts'], function(){})

// Add javascript files here
gulp.task('vendor', function(){
    return gulp.src(
            [
                './public/js/vendor-all.min.js',
                './public/js/plugins/bootstrap.min.js',
                './public/js/plugins/mustache.min.js',
                './public/js/pcoded.min.js',
                './public/js/utils.js'
            ]
        )
        .pipe(gp_concat('vendor.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(gp_rename('vendor.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/'))
});

gulp.task('copy-home', function(){
    return gulp.src(
            [
                './public/js/pages/home.js'
            ]
        )
        .pipe(gp_rename('home.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/pages/'))
})

gulp.task('copy-link', function(){
    return gulp.src(
            [
                './public/js/pages/link.js'
            ]
        )
        .pipe(gp_rename('link.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/pages/'))
})

gulp.task('copy-post', function(){
    return gulp.src(
            [
                './public/js/pages/post.js'
            ]
        )
        .pipe(gp_rename('post.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/pages/'))
})

gulp.task('copy-pages', ['copy-home', 'copy-link', 'copy-post'], function(){})
gulp.task('js', ['vendor', 'copy-pages'], function(){})

gulp.task('minify-apps', () => {
  return gulp.src(
        [
            './public/apps/**/template.html'
        ]
    )
    .pipe(htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        keepClosingSlash: true
    }))
    .pipe(gulp.dest('./public/dist/apps/'));
});

gulp.task('prod', ['style', 'js', 'minify-apps'], function(){})
gulp.task('default', ['prod'], function(){})
