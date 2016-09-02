const root = '..';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const config = require(`${root}/config`);

const app = express();
const jsonParser = bodyParser.urlencoded({extended: true});

app.engine('.hbs', exphbs({
  defaultLayout: 'app',
  extname: '.hbs',
  helpers: {
    get: _.get,
    pathToParam: (path) => {
      const pathSegments = path.split('.');
      return _.first(pathSegments) + _.reduce(_.tail(pathSegments), (memo, segment) =>
        `${memo}[${segment}]`
      , '');
    },
    equal: require('handlebars-helper-equal'),
  },
}));

app.set('view engine', '.hbs');

app.use((req, res, next) => {
  res.locals = _.extend({}, res.locals, {
    currentTime: Date.now(),
    previewBase: config.previewBase,
  });
  next();
});

app.use((req, res, next) => {
  if (_.includes(['POST', 'PUT'], req.method)) return jsonParser(req, res, next);
  return next();
});

_.forEach([
  `${root}/app/routes/index`,
  `${root}/app/routes/edit`,
  `${root}/app/routes/preview`,
], modulePath => require(modulePath)(app));

module.exports = app;
