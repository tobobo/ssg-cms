const root = '../..';
const _ = require('lodash');
const request = require('request');
const pathToRegexp = require('path-to-regexp');

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);
const PORT = config.port;
const PREVIEW_PORT = PORT + 1;
const PREVIEW_DELAY = 100;
const PREVIEW_RETRY = 100;
const PREVIEW_TIMEOUT = 10000;

const editPathRegexp = pathToRegexp(`/${config.editBasePath}/:edit_path*`);

function trySendPreview(startTime, req, res) {
  if (Date.now() - startTime > PREVIEW_TIMEOUT) res.sendStatus(500).end();
  request.get({
    uri: `http://127.0.0.1:${PREVIEW_PORT}${req.path}`,
    qs: req.query,
  })
    .on('error', err => {
      _.delay(() => trySendPreview(startTime, req, res), PREVIEW_RETRY);
      res.status(500).send(`preview error: ${err}`);
    })
    .pipe(res);
}

module.exports = app => {
  app.use((req, res, next) => {
    if (req.path.match(editPathRegexp)) return next();
    _.delay(() => trySendPreview(Date.now(), req, res), PREVIEW_DELAY);
  });

  app.set('startPreviewServer', generator.preview);
};
