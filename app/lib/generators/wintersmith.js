const path = require('path');

const root = '../../..';
const config = require(`${root}/config`);
const runWithOutput = require(`${root}/app/lib/run_with_output`);

const PREVIEW_PORT = config.port + 1;

const WINTERSMITH_COMMAND = 'node_modules/.bin/wintersmith';

module.exports = {
  preview() {
    return runWithOutput({
      cmd: WINTERSMITH_COMMAND,
      opts: ['preview', '-C', config.sitePath, '-p', PREVIEW_PORT],
      logPrefix: 'preview',
    });
  },

  build({exit}) {
    return runWithOutput({
      cmd: WINTERSMITH_COMMAND,
      opts: ['build', '-C', config.sitePath, '-o', path.join('..', config.distPath)],
      logPrefix: 'build',
      exit,
    });
  },
};
