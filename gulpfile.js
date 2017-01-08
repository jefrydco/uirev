'use strict'

// Import packages
const   autoprefixer        = require('gulp-autoprefixer'),
        babel               = require('gulp-babel'),
        browserSync         = require('browser-sync').create(),
        cache               = require('gulp-cache'),
        clean               = require('gulp-clean'),
        concatJS            = require('gulp-concat'),
        gulp                = require('gulp'),
        imagemin            = require('gulp-imagemin'),
        imageminGiflosy     = require('imagemin-giflossy'),
        imageminJpgtran     = require('imagemin-jpegtran'),
        imageminPngquant    = require('imagemin-pngquant'),
        imageminSvgo        = require('imagemin-svgo'),
        minifyCSS           = require('gulp-clean-css'),
        pug                 = require('gulp-pug'),
        rename              = require('gulp-rename'),
        scss                = require('gulp-sass'),
        sourcemaps          = require('gulp-sourcemaps'),
        uglify              = require('gulp-uglify')

//  Source path
const src = {
    fontSource: './src/assets/scss/fonts/*',
    imgSource: './src/assets/img/*',
    jsSourceBuild: [
        './src/assets/js/vendor/jquery.min.js',
        './src/assets/js/vendor/bootstrap.min.js',
        './src/assets/js/main.js'
    ],
    jsSourceDev: [
        './src/assets/js/main.js',
        '!./src/assets/vendor/*.js'
    ],
    jsSourceDevVendor: [
        './src/assets/js/vendor/jquery.min.js',
        './src/assets/js/vendor/bootstrap.min.js'
    ],
    pugSource: './src/pug/index.pug',
    sassSourceBuild: [
        './src/assets/scss/vendor/bootstrap.scss',
        './src/assets/scss/animate.scss',
        './src/assets/scss/main.scss'
    ],
    sassSourceDev: './src/assets/scss/main.scss',
    sassSourceDevVendor: [
        './src/assets/scss/vendor/bootstrap.scss',
        './src/assets/scss/animate.scss'
    ]
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

// JS Build
gulp.task('js-build', function () {
    return gulp.src(src.jsSourceBuild)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concatJS('main.min.js', {newLine: '\n\n\n'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist.jsDist))
        .pipe(browserSync.stream())
})

// JS Dev Vendor
gulp.task('js-dev-vendor', function () {
    return gulp.src(src.jsSourceDevVendor)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concatJS('vendor.js', {newLine: '\n\n\n'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist.jsDist))
        .pipe(browserSync.stream())
})

// JS Dev
gulp.task('js-dev', ['js-dev-vendor'],function () {
    return gulp.src(src.jsSourceDev)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concatJS('main.js', {newLine: '\n\n\n'}))
        .pipe(sourcemaps.write('./maps'))
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

// Scss Build
gulp.task('scss-build', function () {
    return gulp.src(src.sassSourceBuild)
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(minifyCSS({debug: true}, function (details) {
            console.log('Original Size: ' + details.stats.originalSize)
            console.log('Minified Size: ' + details.stats.minifiedSize)
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist.cssDist))
        .pipe(browserSync.stream())
})

// Scss Dev Vendor
gulp.task('scss-dev-vendor', function () {
    return gulp.src(src.sassSourceDevVendor)
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist.cssDist))
})

// Scss Dev
gulp.task('scss-dev', ['scss-dev-vendor'], function () {
    return gulp.src(src.sassSourceDev)
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist.cssDist))
        .pipe(browserSync.stream())
})

// Clean dist directory
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean())
})

// Create server for dev
gulp.task('serve-dev', ['font', 'img', 'js-dev', 'pug', 'scss-dev'], function () {
    browserSync.init({
        notify: false,
        server: './dist'
    })

    gulp.watch(srcWatch[0], ['js-dev'])
    gulp.watch(srcWatch[1], ['pug'])
    gulp.watch(srcWatch[2], ['scss-dev'])
})

// Create server for build
gulp.task('serve-build', ['font', 'img', 'js-build', 'pug', 'scss-build'], function () {
    browserSync.init({
        notify: false,
        server: './dist'
    })

    gulp.watch(srcWatch[0], ['js-build'])
    gulp.watch(srcWatch[1], ['pug'])
    gulp.watch(srcWatch[2], ['scss-build'])
})

// Default dev
gulp.task('default', ['serve-dev'])

// Build production
gulp.task('build', ['serve-build'])