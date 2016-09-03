const express = require('express');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watch = require('gulp-watch');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

module.exports = app => {
  const jsBundler = watchify(browserify('./app/client/index.js', {debug: true}).transform(babel));
  const cssBundler = watch('./app/client/**/*.css', {ignoreInitial: false});

  function rebundle() {
    jsBundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/public'));

    cssBundler
      .pipe(gulp.dest('./app/public'));
  }

  jsBundler.on('update', () => {
    console.log('bundling...');
    rebundle();
  });

  rebundle();

  app.locals = _.extend(app.locals, {assetBaseUrl: `/edit/assets`});
  app.use('/edit/assets', express.static('./app/public'));
};
