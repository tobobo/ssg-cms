const root = '../../..';
const config = require(`${root}/config`);
const gulp = require('gulp');
const gulpS3 = require('gulp-s3-upload')({
  key: 'AKIAIEPVZVQL3LSFVERQ',
  secret: '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',
  region: 'us-west-2',
});

module.exports = (done) => {
  const stream = gulp.src(`${config.distPath}/**`)
    .pipe(gulpS3({
      bucket: 'ssg-cms-test',
    }));
  stream.on('error', done);
  stream.on('end', done);
};
