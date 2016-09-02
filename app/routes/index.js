const root = '../..';
const config = require(`${root}/config`);
const SITE_CONFIG_PATH = `${config.sitePath}/${config.siteConfig}`;
const _ = require('lodash');

const {writeFileP} = require(`${root}/app/lib/file_utils`);

module.exports = app => {
  app.get('/', (req, res) =>
    res.render('config')
  );

  app.post('/', (req, res) => {
    const newConfig = _.extend({}, app.locals.siteConfig, req.body.siteConfig);
    const newConfigJson = JSON.stringify(newConfig, null, 2);
    writeFileP(SITE_CONFIG_PATH, newConfigJson)
      .then(() => res.redirect(req.path))
      .catch(err => { console.log(err, err.stack); res.sendStatus(500); });
  });
};
