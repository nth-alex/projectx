'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var mqpacker = require("css-mqpacker");

var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");


gulp.task('dev', ['sass'], function() {
  browserSync.init({
    server: './',
    open: false,
    notify: false
  });

  gulp.watch('./src/sass/**/*.{sass,scss}', ['sass']);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('src/**/*.html', ['copy']);
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


gulp.task('build', ['sass', 'copy']);
gulp.task('default', ['build', 'dev']);
