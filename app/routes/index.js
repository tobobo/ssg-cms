const root = '../..';
const config = require(`${root}/config`);

module.exports = app => {
  app.get(`/${config.editBasePath}`, (req, res) =>
    res.render('editors', {editors: config.editors})
  );
};
