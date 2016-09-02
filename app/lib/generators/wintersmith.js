const spawn = require('child_process').spawn;
const chalk = require('chalk');

const root = '../../..';
const config = require(`${root}/config`);

const PREVIEW_PORT = config.port + 1;

const PREVIEW_CMD = 'node_modules/.bin/wintersmith';
const PREVIEW_OPTS = ['preview', '-C', config.sitePath, '-p', PREVIEW_PORT];

const BUILD_COMMAND = 'node_modules/.bin/wintersmith';
const BUILD_OPTS = ['build', '-C', config.sitePath, '-o', '../dist'];

module.exports = {
  preview() {
    const previewProc = spawn(PREVIEW_CMD, PREVIEW_OPTS);
    previewProc.stdout.on('data', data => {
      process.stdout.write(chalk.cyan(`preview: ${data}`));
    });
    previewProc.stderr.on('error', err => {
      process.stderr.write(chalk.red(`preview: ${err}`));
    });
    return previewProc;
  },

  build({exit}) {
    const buildProc = spawn(BUILD_COMMAND, BUILD_OPTS);
    buildProc.stdout.on('data', data =>
      process.stdout.write(chalk.cyan(`build: ${data}`))
    );
    buildProc.stderr.on('error', err =>
      process.stderr.write(chalk.red(`build: ${err}`))
    );
    buildProc.on('exit', exit);
    return buildProc;
  },
};
