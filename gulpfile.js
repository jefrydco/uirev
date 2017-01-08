'use strict'

// Import packages
const   autoprefixer        = require('gulp-autoprefixer'),
        babel               = require('gulp-babel'),
        browserSync         = require('browser-sync').create(),
        cache               = require('gulp-cache'),
        clean               = require('gulp-clean'),
        concat              = require('gulp-concat'),
        gulp                = require('gulp'),
        imagemin            = require('gulp-imagemin'),
        imageminGiflosy     = require('imagemin-giflossy'),
        imageminJpgtran     = require('imagemin-jpegtran'),
        imageminPngquant    = require('imagemin-pngquant'),
        imageminSvgo        = require('imagemin-svgo'),
        livereload          = require('gulp-livereload'),
        minifyCSS            = require('gulp-clean-css'),
        pug                 = require('gulp-pug'),
        pugLint             = require('gulp-pug-lint'),
        scss                = require('gulp-sass'),
        sourcemaps          = require('gulp-sourcemaps'),
        uglify              = require('gulp-uglify')

//  Source path
const src = {
    fontSource: './src/assets/scss/fonts/*',
    imgSource: './src/assets/img/*',
    jsSource: ['./src/assets/js/vendor/jquery.min.js', './src/assets/js/vendor/bootstrap.min.js', './src/assets/js/*.js'],
    pugSource: './src/pug/index.pug',
    sassSource: ['./src/assets/scss/vendor/*.scss', './src/assets/scss/*.scss']
}

//  Destionation path
const dist = {
    fontDist: './dist/assets/fonts',
    cssDist: './dist/assets/css',
    htmlDist: './dist',
    imgDist: './dist/assets/img',
    jsDist: './dist/assets/js',
}

//  Plugins for processing image
const plugins = [
    imageminGiflosy({
        lossy: 80
    }),
    imageminJpgtran({
        progressive: true
    }),
    imageminPngquant({
        quality: '65 - 80'
    }),
    imageminSvgo({
        removeViewBox: false
    })
]

// Source for watch files
const srcWatch = [
    './src/assets/js/**/*.js',
    './src/pug/**/*.pug',
    './src/assets/scss/**/*.scss'
]

// Font
gulp.task('font', function () {
    return gulp.src(src.fontSource)
        .pipe(gulp.dest(dist.fontDist))
})

// Image
gulp.task('img', function () {
    return gulp.src(src.imgSource)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            use: plugins
        })))
        .pipe(gulp.dest(dist.imgDist))
})

// JS
gulp.task('js', function () {
    return gulp.src(src.jsSource)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('main.js', {newLine: '\n\n\n'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.jsDist))
        .pipe(browserSync.stream())
})

// Pug
gulp.task('pug', function () {
    return gulp.src(src.pugSource)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(dist.htmlDist))
        .pipe(browserSync.stream())
})

// SCSS
gulp.task('scss', function () {
    return gulp.src(src.sassSource)
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(minifyCSS({debug: true}, function (details) {
            console.log('Original Size: ' + details.stats.originalSize)
            console.log('Minified Size: ' + details.stats.minifiedSize)
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.cssDist))
        .pipe(browserSync.stream())
})

// Clean dist directory
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean())
})


// Create server
gulp.task('serve', ['font', 'img', 'js', 'pug', 'scss'], function () {
    browserSync.init({
        notify: false,
        server: './dist'
    })

    gulp.watch(srcWatch[0], ['js'])
    gulp.watch(srcWatch[1], ['pug'])
    gulp.watch(srcWatch[2], ['scss'])
})

// Default
gulp.task('default', ['serve'])