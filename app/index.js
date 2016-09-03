const root = '..';

const _ = require('lodash');
const express = require('express');
const createServer = require('http').Server;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const config = require(`${root}/config`);
const setupSocket = require(`${root}/app/lib/setup_socket.js`);

const app = express();
const httpServer = createServer(app);
app.set('socketIo', setupSocket(httpServer));
const urlencodedParser = bodyParser.urlencoded({extended: true});
const viewsDir = 'app/views';

app.set('views', viewsDir);
app.engine('.hbs', exphbs({
  defaultLayout: 'app',
  extname: '.hbs',
  layoutsDir: `${viewsDir}/layouts`,
  partialsDir: `${viewsDir}/partials`,
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

app.set('getAssetServer', require(`${root}/app/lib/asset_server`)(app));

const middlewareRoot = `${root}/app/middleware`;
_.forEach([
  `${middlewareRoot}/preview`,
  `${middlewareRoot}/public`,
], modulePath => require(modulePath)(app));

const routeRoot = `${root}/app/routes`;
_.forEach([
  `${routeRoot}/index`,
  `${routeRoot}/upload`,
  `${routeRoot}/edit`,
], modulePath => require(modulePath)(app));

app.set('startCmsServer', () => {
  httpServer.listen(config.port, () => console.log(`cms server listening on port ${config.port}`))
});

module.exports = app;
