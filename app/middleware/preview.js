const root = '../..';
const request = require('request');
const pathToRegexp = require('path-to-regexp');

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);
const PORT = config.port;
const PREVIEW_PORT = PORT + 1;
const PREVIEW_DELAY = 0;
const PREVIEW_RETRY = 100;
const PREVIEW_TIMEOUT = 10000;

const editPathRegexp = pathToRegexp(`/${config.editBasePath}/:edit_path*`);

function trySendPreview(startTime, req, res) {
  console.log('trysend');
  if (Date.now() - startTime > PREVIEW_TIMEOUT) res.sendStatus(500).end();
  console.log(`http://localhost:${PREVIEW_PORT}${req.path}`);
  request.get({
    uri: `http://localhost:${PREVIEW_PORT}${req.path}`,
    qs: req.query,
  })
    .on('error', err => {
      console.log('trying again');
      _.delay(() => trySendPreview(startTime, req, res), PREVIEW_RETRY);
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
