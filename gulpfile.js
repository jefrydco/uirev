'use strict'

// Import packages
const   autoprefixer        = require('gulp-autoprefixer'),
        babel               = require('gulp-babel'),
        browserSync         = require('browser-sync').create(),
        clean               = require('gulp-clean'),
        concat              = require('gulp-concat'),
        gulp                = require('gulp'),
        imagemin            = require('gulp-imagemin'),
        imageResize         = require('gulp-image-resize'),
        mediaQueries        = require('gulp-group-css-media-queries'),
        cssnano             = require('gulp-cssnano'),
        plumber             = require('gulp-plumber'),
        pug                 = require('gulp-pug'),
        rename              = require('gulp-rename'),
        scss                = require('gulp-sass'),
        sourcemaps          = require('gulp-sourcemaps'),
        uglify              = require('gulp-uglify')

//  Source path
const pathSrc = {
    fonts           : './src/assets/scss/fonts/',
    img             : './src/assets/img/',
    js              : './src/assets/js/',
    jsVendor        : './src/assets/js/vendor/',
    scss            : './src/assets/scss/',
    scssVendor      : './src/assets/scss/vendor/',
    pug             : './src/pug/'
}

// Dist path
const pathDist = './dist/assets/'

// Source
const src = {
    fonts: pathSrc.fonts + '*',
    img: {
        hd: pathSrc.img + 'hd/**/*',
        md: pathSrc.img + 'md/**/*',
        sm: pathSrc.img + 'sm/**/*'
    },
    js: {
        vendorCopy: pathSrc.jsVendor + 'copy/**/*.js',
        devVendor: [
            '!' + pathSrc.jsVendor + 'copy/**/*.js',
            pathSrc.jsVendor + 'jquery.js',
            pathSrc.jsVendor + 'jquery.easing.js',
            pathSrc.jsVendor + 'jquery.smartmenus.js',
            pathSrc.jsVendor + 'bootstrap.js',
            pathSrc.jsVendor + 'bootstrap.smartmenus.js',
        ],
        dev: [
            '!' + pathSrc.jsVendor + '**/*.js',
            pathSrc.js + 'main.js'
        ],
        build: [
            '!' + pathSrc.jsVendor + 'copy/**/*.js',
            pathSrc.jsVendor + 'jquery.js',
            pathSrc.jsVendor + 'jquery.easing.js',
            pathSrc.jsVendor + 'jquery.smartmenus.js',
            pathSrc.jsVendor + 'bootstrap.js',
            pathSrc.jsVendor + 'bootstrap.smartmenus.js',
            pathSrc.js + 'main.js'
        ]
    },
    scss: {
        devVendor: [
            pathSrc.scssVendor + 'bootstrap.scss',
            pathSrc.scssVendor + 'bootstrap.smartmenus.scss',
            pathSrc.scssVendor + 'font-awesome.scss',
            pathSrc.scssVendor + 'animate.scss'
        ],
        dev: pathSrc.scss + 'main.scss',
        buildVendor: [
            pathSrc.scssVendor + 'bootstrap.scss',
            pathSrc.scssVendor + 'bootstrap.smartmenus.scss',
            pathSrc.scssVendor + 'font-awesome.scss',
            pathSrc.scssVendor + 'animate.scss'
        ],
        build: [
            pathSrc.scss + 'main.scss',
            // pathSrc.scssVendor + ''
        ]
    },
    pug: pathSrc.pug + 'index.pug'
}

// Dist
const dist = {
    fonts: pathDist + 'fonts',
    img: pathDist + 'img',
    js: pathDist + 'js',
    img: {
        hd: pathDist + 'img/hd',
        md: pathDist + 'img/md',
        sm: pathDist + 'img/sm'
    },
    scss: pathDist + 'css',
    pug: './dist'
}

// Watch source
const srcWatch = {
    js: pathSrc.js + '**/*.js',
    scss: pathSrc.scss + '**/*.scss',
    pug: pathSrc.pug + '**/*.pug'
}

// Plugin config for imagemin
const plugImagemin = [
    imagemin.optipng({
        optimizationLevel: 7
    }),
    imagemin.jpegtran({
        arithmetic: true
    }),
    imagemin.gifsicle({
        optimizationLevel: 3
    })
]

// Fonts
gulp.task('fonts', () => {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(dist.fonts))
})

// Image HD
gulp.task('img:hd', () => {
    return gulp.src(src.img.hd)
        .pipe(plumber())
        .pipe(imageResize({
            width: 1920,
            format: 'jpg',
            upscale: true
        }))
        .pipe(imagemin({
            progressive: true,
            verbose: true,
            use: plugImagemin
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.img.hd))
})

// Image Medium
gulp.task('img:md', () => {
    return gulp.src(src.img.md)
        .pipe(plumber())
        .pipe(imageResize({
            width: 1366,
            format: 'jpg',
            upscale: true
        }))
        .pipe(imagemin({
            progressive: true,
            verbose: true,
            use: plugImagemin
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.img.md))
})

// Image Small
gulp.task('img:sm', () => {
    return gulp.src(src.img.sm)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            verbose: true,
            use: plugImagemin
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.img.sm))
})

// Img
gulp.task('img', ['img:hd', 'img:md', 'img:sm'])

// Js Vendor Copy
gulp.task('js:vendor-cp', () => {
    return gulp.src(src.js.vendorCopy)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.js))
        .pipe(browserSync.stream())
})

// JS Dev Vendor
gulp.task('js:dev-vendor', () => {
    return gulp.src(src.js.devVendor)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.js))
        .pipe(browserSync.stream())
})

// JS Dev
gulp.task('js:dev', ['js:vendor-cp', 'js:dev-vendor'], () => {
    return gulp.src(src.js.dev)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js', {
            newLine: '\n\n\n'
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.js))
        .pipe(browserSync.stream())
})

// JS Build
gulp.task('js:build', ['js:vendor-cp'], () => {
    return gulp.src(src.js.build)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.js))
})

// SCSS Dev Vendor
gulp.task('scss:dev-vendor', () => {
    return gulp.src(src.scss.devVendor)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(mediaQueries())
        .pipe(sourcemaps.write('./maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.scss))
        .pipe(browserSync.stream())
})

// SCSS Dev
gulp.task('scss:dev', ['scss:dev-vendor'], () => {
    return gulp.src(src.scss.dev)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(mediaQueries())
        .pipe(sourcemaps.write('./maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.scss))
        .pipe(browserSync.stream())
})

// SCSS Build Vendor
gulp.task('scss:build-vendor', () => {
    return gulp.src(src.scss.buildVendor)
        .pipe(plumber())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(mediaQueries())
        .pipe(cssnano())
        .pipe(concat('vendor.min.css'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.scss))
        .pipe(browserSync.stream())
})

// SCSS Build
gulp.task('scss:build', ['scss:build-vendor'], () => {
    return gulp.src(src.scss.build)
        .pipe(plumber())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(mediaQueries())
        .pipe(cssnano())
        .pipe(concat('main.min.css'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.scss))
        .pipe(browserSync.stream())
})

// Pug
gulp.task('pug', () => {
    return gulp.src(src.pug)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist.pug))
        .pipe(browserSync.stream())
})

// Clean dist
gulp.task('clean', () => {
    return gulp.src('./dist')
        .pipe(clean())
})

// Dev Server
gulp.task('serve:dev', ['fonts', 'img', 'js:dev', 'scss:dev', 'pug'], () => {
    browserSync.init({
        notify: false,
        server: './dist'
    })

    gulp.watch(srcWatch.js, ['js:dev'])
    gulp.watch(srcWatch.scss, ['scss:dev'])
    gulp.watch(srcWatch.pug, ['pug'])
})

// Build Server
gulp.task('serve:build', ['fonts', 'img', 'js:build', 'scss:build', 'pug'], () => {
    browserSync.init({
        notify: false,
        server: './dist'
    })

    gulp.watch(srcWatch.js, ['js:build'])
    gulp.watch(srcWatch.scss, ['scss:build'])
    gulp.watch(srcWatch.pug, ['pug'])
})

// Default dev
gulp.task('default', ['serve:dev'])

// Default Build
gulp.task('build', ['serve:build'])