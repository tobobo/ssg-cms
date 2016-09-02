const root = '../..';
const _ = require('lodash');
const request = require('request');

const config = require(`${root}/config`);
const PORT = config.port;
const SITE_PATH = config.sitePath;
const PREVIEW_PORT = PORT + 1;
const PREVIEW_DELAY = 0;
const PREVIEW_RETRY = 100;
const PREVIEW_TIMEOUT = 10000;
const PREVIEW_BASE = 'preview';

const spawn = require('child_process').spawn;
const chalk = require('chalk');

const PREVIEW_CMD = 'wintersmith';
const PREVIEW_OPTS = ['preview', '-C', SITE_PATH, '-p', PREVIEW_PORT];

function sitePreviewCommand() {
  return [PREVIEW_CMD, PREVIEW_OPTS];
}

function sendPreview(req, res, path) {
  const startTime = Date.now();
  _.delay(() => trySendPreview(startTime, req, res, path), PREVIEW_DELAY);
}

function trySendPreview(startTime, req, res, path) {
  if (Date.now() - startTime > PREVIEW_TIMEOUT) res.sendStatus(500).end();
  request.get({
    uri: `http://127.0.0.1:${PREVIEW_PORT}${path}`,
    qs: req.query,
  })
    .on('error', err => {
      _.delay(() => trySendPreview(startTime, res, path), PREVIEW_RETRY);
      res.status(500).send(`preview error: ${err}`);
    })
    .pipe(res);
}

module.exports = app => {
  app.locals = _.extend(app.locals, {previewBase: PREVIEW_BASE});

  app.get(`/${PREVIEW_BASE}/:preview_path?*`, (req, res) => {
    const path = req.params[0];
    sendPreview(req, res, path);
  });

  app.set('startPreviewServer', () => {
    const previewProc = spawn.call(null, ...sitePreviewCommand());
    previewProc.stdout.on('data', data => {
      process.stdout.write(chalk.cyan(`${PREVIEW_CMD}: ${data}`));
    });
    previewProc.stderr.on('error', err => {
      process.stdout.write(chalk.red(`${PREVIEW_CMD}: ${err}`));
    });
    return previewProc;
  });
};
