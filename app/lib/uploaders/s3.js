const root = '../../..';
const config = require(`${root}/config`);
const gulp = require('gulp');
const gulpS3 = require('gulp-s3-upload')(config.s3Config);

module.exports = () => {
  const stream = gulp.src(`${config.distDir}/**`)
    .pipe(gulpS3({
      bucket: config.s3Config.bucket,
    }));
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', () => resolve());
  });
};
