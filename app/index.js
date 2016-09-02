const root = '..';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const config = require(`${root}/config`);
const SITE_CONFIG_PATH = `${config.sitePath}/${config.siteConfig}`;

const app = express();
const jsonParser = bodyParser.urlencoded({extended: true});

const {readFileP} = require(`${root}/app/lib/file_utils`);

app.engine('.hbs', exphbs({defaultLayout: 'app', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use((req, res, next) => {
  readFileP(`${SITE_CONFIG_PATH}`)
    .then(data => {
      app.locals = _.extend({}, app.locals, {
        siteConfig: JSON.parse(data),
        currentTime: Date.now(),
      });
      next();
    });
});

app.use((req, res, next) => {
  if (_.includes(['POST', 'PUT'], req.method)) return jsonParser(req, res, next);
  return next();
});

_.forEach([
  `${root}/app/routes/preview`,
  `${root}/app/routes/edit`,
  `${root}/app/routes/index`,
], modulePath => require(modulePath)(app));

module.exports = app;
