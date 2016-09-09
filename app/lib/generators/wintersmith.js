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
      opts: ['preview', '-C', config.siteDir, '-p', PREVIEW_PORT],
      logPrefix: 'preview',
    });
  },

  build({data, error, exit}) {
    return runWithOutput({
      cmd: WINTERSMITH_COMMAND,
      opts: ['build', '-C', config.siteDir, '-o', path.join('..', config.distDir)],
      logPrefix: 'build',
      data,
      error,
      exit,
    });
  },
};
