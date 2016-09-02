const root = '../..';

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);

const uploadPath = `/${config.editBasePath}/upload`;
const upload = require(`${root}/app/lib/uploaders/s3`);

module.exports = app => {
  app.get(uploadPath, (req, res) => res.render('upload'));

  app.post(uploadPath, (req, res) => {
    generator.build({
      exit: () => {
        upload(() => {
          res.redirect(req.path);
        });
      },
    });
  });
};
