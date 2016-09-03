const root = '..';

global._ = require('lodash');
const express = require('express');
const session = require('express-session');
const createServer = require('http').Server;
const exphbs = require('express-handlebars');

const config = require(`${root}/config`);
const setupSocket = require(`${root}/app/lib/setup_socket.js`);

const app = express();
const httpServer = createServer(app);
app.set('socketIo', setupSocket(httpServer));
const viewsDir = 'app/views';

app.use(session({
  secret: 'keyboard cat',
  cookie: {maxAge: 60000},
}));

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
    json: JSON.stringify,
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
  req.flash = (type, message) => {
    if (!req.session.flashes) req.session.flashes = [];
    req.session.flashes.push({type, message});
  };
  if (req.session.flashes) {
    res.locals = _.extend({}, res.locals, {
      flashes: req.session.flashes
    });
    delete req.session.flashes;
  }
  next();
});

const middlewareRoot = `${root}/app/middleware`;
_.forEach([
  `${middlewareRoot}/preview`,
  `${middlewareRoot}/body_parser`,
  `${middlewareRoot}/asset_server`,
], modulePath => require(modulePath)(app));

const routeRoot = `${root}/app/routes`;
_.forEach([
  `${routeRoot}/index`,
  `${routeRoot}/upload`,
  `${routeRoot}/edit`,
], modulePath => require(modulePath)(app));

app.set('startCmsServer', () => {
  httpServer.listen(config.port, () => console.log(`cms server listening on port ${config.port}`));
});

module.exports = app;
