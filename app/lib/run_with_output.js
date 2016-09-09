const spawn = require('child_process').spawn;
const chalk = require('chalk');

module.exports = (opts) => {
  const proc = spawn(opts.cmd, opts.opts, _.pick(opts, 'env'));
  const prefix = opts.logPrefix || 'subprocess';

  proc.stdout.on('data', data => {
    process.stdout.write(chalk.cyan(`${prefix}: ${data}`));
    if (opts.data) opts.data(data);
  });

  if (opts.getProc) opts.getProc(proc);

  return new Promise((resolve, reject) => {
    proc.stderr.on('data', err => {
      process.stderr.write(chalk.red(`${prefix}: ${err}`));
      if (opts.error) opts.error(err);
    });

    proc.on('exit', status => {
      console.log('status', status);
      if (status === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
