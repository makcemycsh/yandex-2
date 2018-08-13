'use strict';

const gulp         = require('gulp'),
      notify       = require('gulp-notify'),
      sass         = require('gulp-sass'),
      sassGlob     = require('gulp-sass-glob'),
      plumber      = require('gulp-plumber'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssnano      = require('cssnano'),
      browserSync  = require('browser-sync').create(),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      rigger       = require('gulp-rigger'),
      imagemin     = require('gulp-imagemin');

// Обработка ошибок
const handleError = err => {
  notify.onError({
    title:   'Gulp error',
    message: err.message
  })(err);
};

// 1. Девсервер на build/
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    host:   'localhost',
    port:   9000,
    notify: false
  });
});

gulp.task('server:refresh', () => {
  browserSync.reload();
});
gulp.task('server:inject', () => {
  gulp.src('build/styles/**/*.*')
    .pipe(browserSync.stream());
});

// 2. Билды
gulp.task('build:html', () => {
  gulp.src('src/pages/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('build/'));
});

gulp.task('build:styles', () => {
  gulp.src('src/styles/*.scss')
    .pipe(plumber(handleError))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['last 3 version']})
      // cssnano({
      //   zindex:       false,
      //   reduceIdents: false
      // })
    ]))
    .pipe(gulp.dest('build/styles/'));

  gulp.src('src/blocks/**/*.scss')
    .pipe(plumber(handleError))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['last 3 version']})
    ]))
    .pipe(gulp.dest('build/styles/components/'));
});
gulp.task('build:scripts', () => {
  gulp.src('src/scripts/vendor/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts/vendor/'));

  gulp.src('src/scripts/**/*.js')
    .pipe(plumber(handleError))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts/'));
});
gulp.task('build:assets', () => {
  gulp.src('src/assets/fonts/**/*.*')
    .pipe(gulp.dest('build/assets/fonts/'));

  gulp.src('src/assets/other/**/*.*')
    .pipe(gulp.dest('build/assets/other/'));

  gulp.src('src/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets/img/'));

  gulp.src('src/assets/favicon/**/*.*')
    .pipe(gulp.dest('build/assets/favicon/'));
});

// 3. Вотчеры
gulp.task('watch:build', ['server', 'build:html', 'build:styles', 'build:scripts', 'build:assets'],
  () => {
    gulp.watch([
        'src/pages/**/*.twig',
        'src/pages/**/*.html',
        'src/blocks/**/*.twig',
        'src/blocks/**/*.html'
      ],
      ['build:html']);
    gulp.watch([
        'src/styles/**/*.*',
        'src/blocks/**/*.scss'
      ],
      ['build:styles']);
    gulp.watch('src/scripts/**/*.*', ['build:scripts']);
    gulp.watch('src/assets/**/*.*', ['build:assets']);
  });
gulp.task('watch:update', () => {
  gulp.watch([
    'build/**/*.*',
    '!build/styles/**/*.*'
  ], ['server:refresh']);

  gulp.watch('build/styles/**/*.*', ['server:inject']);
});

gulp.task('default', ['watch:build', 'watch:update']);
