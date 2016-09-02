const spawn = require('child_process').spawn;
const chalk = require('chalk');

module.exports = (opts) => {
  const proc = spawn(opts.cmd, opts.opts);
  const prefix = opts.logPrefix || 'subprocess';

  proc.stdout.on('data', data => {
    process.stdout.write(chalk.cyan(`${prefix}: ${data}`));
    if (opts.data) opts.data(data);
  });

  proc.stderr.on('error', err => {
    process.stderr.write(chalk.red(`${prefix}: ${err}`));
    if (opts.error) opts.error(err);
  });

  proc.on('exit', () => {
    if (opts.exit) opts.exit();
  });

  return proc;
};
