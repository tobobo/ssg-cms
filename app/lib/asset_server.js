const _ = require('lodash');
const express = require('express');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

const ASSET_PORT = 8089;

module.exports = app => () => {
  const bundler = watchify(browserify('./app/public/index.js', {debug: true}).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', (err) => { console.error(err); this.emit('end'); })
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./live-assets'));
  }

  bundler.on('update', () => {
    console.log('bundling...');
    rebundle();
  });

  rebundle();

  const assetApp = express();
  assetApp.use(express.static('live-assets'));
  assetApp.listen(ASSET_PORT);

  app.locals = _.extend(app.locals, {assetBaseUrl: `http://localhost:${ASSET_PORT}`});
};
