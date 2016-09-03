const root = '..';

global._ = require('lodash');
const express = require('express');
const createServer = require('http').Server;

const config = require(`${root}/config`);

const app = express();
app.set('server', createServer(app));
app.set('config', config);

const requireWithApp = (modules) =>
  _.forEach(modules, modulePath => require(modulePath)(app));

const libRoot = `${root}/app/lib`;
const middlewareRoot = `${root}/app/middleware`;
const routeRoot = `${root}/app/routes`;
requireWithApp([
  `${libRoot}/setup_templates`,
  `${libRoot}/setup_socket`,

  `${middlewareRoot}/session`,
  `${middlewareRoot}/preview`,
  `${middlewareRoot}/flash`,
  `${middlewareRoot}/app_locals`,
  `${middlewareRoot}/body_parser`,
  `${middlewareRoot}/asset_server`,

  `${routeRoot}/index`,
  `${routeRoot}/upload`,
  `${routeRoot}/edit`,
]);

app.set('startCmsServer', () => {
  app.get('server')
    .listen(config.port, () => console.log(`cms server listening on port ${config.port}`));
});

module.exports = app;
