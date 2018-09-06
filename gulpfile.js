'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var pump = require('pump');
var uglify = require('gulp-uglify');
var mqpacker = require('css-mqpacker');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
imagemin.mozjpeg = require('imagemin-mozjpeg');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var del = require('del');
var favicons = require('gulp-favicons');
var newer = require('gulp-newer');
var svgSprite = require('gulp-svg-sprite');
var fileinclude = require('gulp-file-include');
var beep = require('beepbeep');
var npm = './node_modules/';
var bower = './bower_components/';

var plugins = [
  npm + 'jquery/dist/jquery.js',
  npm + 'svg4everybody/dist/svg4everybody.js',
  // npm + 'js-cookie/src/js.cookie.js',
  // npm + 'gsap/TweenMax.js',
  // npm + 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
  // npm + 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
  // npm + 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
  // npm + 'jquery-parallax.js/parallax.js',
  // npm + 'air-datepicker/dist/js/datepicker.js',
  // npm+'magnific-popup/dist/jquery.magnific-popup.js',
  // npm+'slick-carousel/slick/slick.js'
];

function error_handler(error) {
  beep();
  return 'ERROR: ' + error.message;
}

gulp.task('clean', function() {
  return del(['*.html', 'img', 'css', 'js', 'fonts']);
});

gulp.task('favicon', function() {
  return gulp
    .src('src/img/favicon.png')
    .pipe(
      favicons({
        path: 'img/favicons/',
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: {
            offset: 25
          },
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      })
    )
    .pipe(gulp.dest('./img/favicons'));
});

gulp.task('html', function() {
  return gulp
    .src('src/html/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError(function(error) {
          return error_handler(error);
        })
      })
    )
    .pipe(
      fileinclude({
        prefix: '@'
      })
    )
    .pipe(gulp.dest('./'));
});

gulp.task('html:watch', ['html'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('fonts', function() {
  return gulp
    .src('src/fonts/**/*(*.eot|*.ttf|*.woff|*.woff2)')
    .pipe(gulp.dest('./fonts'));
});

gulp.task('svg', function() {
  gulp
    .src('src/img/sprite/**/*.svg')
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [{
            removeAttrs: {
              attrs: 'fill'
            }
          }]
        })
      ])
    )
    .pipe(svgSprite({
      mode: {
        symbol: '../img/sprite.svg'
      }
    }))
    .pipe(gulp.dest('./'));
});

// dependencies for project scripts
gulp.task('deps', function() {
  return gulp
    .src(plugins)
    .pipe(
      plumber({
        errorHandler: notify.onError(function(error) {
          return error_handler(error);
        })
      })
    )
    .pipe(concat('deps.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

// project scripts
gulp.task('scripts', function() {
  return (gulp
    .src(['src/js/inc/**/*.js', 'src/js/main.js'])
    .pipe(
      plumber({
        errorHandler: notify.onError(function(error) {
          return error;
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream()));
});

gulp.task('img', function() {
  return gulp
    .src([
      'src/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)',
      '!src/img/favicon.png',
      '!src/img/sprite',
      '!src/img/sprite/**'
    ])
    .pipe(newer('./img'))
    .pipe(
      imagemin(
        [
          imagemin.mozjpeg({
            quality: 70
          }),
          imagemin.optipng({
            optimizationLevel: 2
          })
        ], {
          verbose: true
        }
      )
    )
    .pipe(gulp.dest('./img'));
});

gulp.task('video', function() {
  return gulp.src('src/img/**/*.mp4').pipe(gulp.dest('./img'));
});

// sass task
gulp.task('sass', function() {
  var postCssPlugins = [
    autoprefixer(),
    cssnano({
      zindex: false
    }),
    mqpacker()
  ];
  return gulp
    .src('./src/sass/**/*.{sass,scss}')
    .pipe(
      plumber({
        errorHandler: notify.onError(function(error) {
          return error_handler(error);
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: [npm, bower]
      })
    )
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});

gulp.task('dev', ['build'], function() {
  browserSync.init({
    server: './',
    files: ['./img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)'],
    open: false,
    notify: false
  });

  gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/html/**/*.html', ['html:watch']);
  gulp.watch('src/img/sprite/**/*.svg', ['svg']);
  gulp.watch(
    [
      'src/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)',
      '!src/img/sprite',
      '!src/img/sprite/**'
    ], ['img']
  );
});

gulp.task('build', [
  'sass',
  'html',
  'fonts',
  'img',
  'video',
  'svg',
  'favicon',
  'deps',
  'scripts'
]);
gulp.task('default', ['dev']);