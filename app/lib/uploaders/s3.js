const root = '../../..';
const config = require(`${root}/config`);
const gulp = require('gulp');
const gulpS3 = require('gulp-s3-upload')(config.s3Config);

module.exports = ({error, exit}) => {
  const stream = gulp.src(`${config.distPath}/**`)
    .pipe(gulpS3({
      bucket: config.s3Config.bucket,
    }));
  if (error) stream.on('error', error);
  stream.on('end', exit);
};
