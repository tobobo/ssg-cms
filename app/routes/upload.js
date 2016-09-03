const root = '../..';

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);

const uploadPath = `/${config.editBasePath}/upload`;
const upload = require(`${root}/app/lib/uploaders/s3`);

module.exports = app => {
  app.get(uploadPath, (req, res) => res.render('upload'));

  app.post(uploadPath, (req, res) => {
    const io = app.get('socketIo');
    io.emit('build_start');
    generator.build({
      data: data => io.emit('build_stdout', String(data)),
      exit: () => {
        io.emit('build_upload_start');
        upload({
          data: data => io.emit('build_stdout', String(data)),
          exit: () => {
            io.emit('build_complete', config.productionUrl);
            res.sendStatus(200);
          },
        });
      },
    });
  });
};
