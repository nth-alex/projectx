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
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var source = require('vinyl-source-stream');

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

gulp.task('copy', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./'));
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
    open: false,
    notify: false
  });

  gulp.watch('./src/sass/**/*.{sass,scss}', ['sass']);
  gulp.watch('src/**/*.html', ['copy']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('build', ['sass', 'copy', 'js:build']);
gulp.task('default', ['dev']);
