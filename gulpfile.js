'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var mqpacker = require("css-mqpacker");

var watchify = require('watchify');
var browserify = require('browserify');

var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
imagemin.mozjpeg = require('imagemin-mozjpeg');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var source = require('vinyl-source-stream');
var del = require('del');
var favicons = require("gulp-favicons");
var newer = require('gulp-newer');
var svgSprite = require('gulp-svg-sprite');
var fileinclude = require('gulp-file-include');

gulp.task('clean', function () {
  return del(['*.html','img','css','js']);
});

gulp.task('favicon', function () {
  return gulp.src('src/img/favicon.png')
    .pipe(favicons({
      path: 'img/favicons/',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: {offset: 25},
        favicons: true,
        firefox: false,
        windows: false,
        yandex: false
      }
    }))
    .pipe(gulp.dest('./img/favicons'));
});

gulp.task('html', function () {
  return gulp.src('src/html/*.html')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(fileinclude({
      prefix: '@'
    }))
    .pipe(gulp.dest('./'))
});

// Basic configuration example
var config = {
  mode: {
    symbol: {
      sprite: '../img/sprite.svg',
      render: {
        scss: {
          dest: '../src/sass/inc/_sprite.scss',
        }
      }
    }
  }
};

gulp.task('svg', function () {
  gulp.src('src/img/sprite/**/*.svg')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeAttrs: {attrs: 'fill'}}
        ]
      })
    ]))
  	.pipe(svgSprite(config))
  	.pipe(gulp.dest('./'));
});

/* browserify */
gulp.task('js:build', function() {
  return browserify({
    entries: ['./src/js/main.js'],
    debug: true
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./js'));
});

/* watchify */
gulp.task('js:watch', function () {
  var b = watchify(browserify({
    entries: ['./src/js/main.js'],
    debug: true
  }));
  b.on('update', bundle);

  function bundle() {
    return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
  }

  return bundle();
});

gulp.task('img', function () {
  return gulp.src(['src/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)', '!src/img/favicon.png', '!src/img/sprite', '!src/img/sprite/**'])
    .pipe(newer('./img'))
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 50}),
      imagemin.optipng({optimizationLevel: 2})
    ], {verbose: true}))
    .pipe(gulp.dest('./img'));
});


gulp.task('sass', function() {
  var postCssPlugins = [
    autoprefixer(),
    cssnano(),
    mqpacker()
  ]
  return gulp.src('./src/sass/**/*.{sass, scss}')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('dev', ['build', 'js:watch'], function() {
  browserSync.init({
    server: './',
    files: ['./img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)', './*.html'],
    open: false,
    notify: false
  });

  gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('src/img/sprite/**/*.svg', ['svg']);
  gulp.watch(['src/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)', '!src/img/sprite', '!src/img/sprite/**'], ['img']);
});

gulp.task('build', ['sass', 'html', 'img', 'svg', 'favicon', 'js:build']);
gulp.task('default', ['dev']);
