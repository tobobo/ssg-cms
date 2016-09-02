const root = '..';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const config = require(`${root}/config`);

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: true});

app.engine('.hbs', exphbs({
  defaultLayout: 'app',
  extname: '.hbs',
  helpers: {
    get: _.get,
    pathToParam: (path) => {
      const pathSegments = path.split('.');
      return _.reduce(_.tail(pathSegments), (memo, segment) =>
        `${memo}[${segment}]`
      , _.first(pathSegments));
    },
    equal: require('handlebars-helper-equal'),
  },
}));

app.set('view engine', '.hbs');

app.use((req, res, next) => {
  res.locals = _.extend({}, res.locals, {
    currentTime: Date.now(),
    config,
  });
  next();
});

app.use((req, res, next) => {
  if (_.includes(['POST', 'PUT'], req.method)) return urlencodedParser(req, res, next);
  return next();
});

const routeRoot = `${root}/app/routes`;
_.forEach([
  `${routeRoot}/preview`,
  `${routeRoot}/index`,
  `${routeRoot}/upload`,
  `${routeRoot}/edit`,
], modulePath => require(modulePath)(app));

module.exports = app;
