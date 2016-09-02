const root = '../..';

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);

const uploadPath = `/${config.editBasePath}/upload`;

module.exports = app => {
  app.get(uploadPath, (req, res) => res.render('upload'));

  app.post(uploadPath, (req, res) => {
    generator.build({exit: () => res.redirect(req.path)});
  });
};
