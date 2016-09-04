const path = require('path');
const express = require('express');
const handlebars = require('handlebars');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const gulpHbs = require('gulp-handlebars');
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

module.exports = app => {
  const jsBundler = watchify(browserify('./app/client/index.js', {debug: true}).transform(babel));
  const cssBundler = watch('./app/client/**/*.css', {ignoreInitial: false});
  const hbsBundler = watch('./app/views/**/*.hbs', {ignoreInitial: false});

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

    hbsBundler
      .pipe(gulp.src(['**/*.hbs', '!partials', '!partials/**']))
      .pipe(gulpHbs({
        handlebars,
      }))
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
        namespace: 'App.templates',
        noRedeclare: true,
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('./app/public'));

    gulp.src('./app/views/partials/**/*.hbs')
      .pipe(gulpHbs({
        handlebars,
      }))
      .pipe(wrap(
        'Handlebars.registerPartial(<%= processPartialName(file.relative) %>, ' +
        'Handlebars.template(<%= contents %>));',
      {}, {
        imports: {
          processPartialName: fileName =>
            // Strip the extension and the underscore
            // Escape the output with JSON.stringify
            JSON.stringify(path.basename(fileName, '.js')),

        },
      }))
      .pipe(concat('partials.js'))
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
