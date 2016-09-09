const root = '../..';

const config = require(`${root}/config`);
const generator = require(`${root}/app/lib/generators/wintersmith`);
const git = require(`${root}/app/lib/git`);

const uploadPath = `/${config.editBasePath}/upload`;
const upload = require(`${root}/app/lib/uploaders/s3`);

const runWithOutput = require(`${root}/app/lib/run_with_output`);
const baseEnv = _.extend({}, process.env, {
  SSGCMS_SITE_DIR: config.siteDir,
});

const execMakeCommand = (commandName, env, data) => {
  return runWithOutput({
    cmd: 'make',
    opts: [commandName],
    env: _.extend({}, baseEnv, env),
    data,
  });
};

function throwBuildError(type, message) {
  const err = new Error(message);
  err.type = type;
  throw err;
}

module.exports = app => {
  app.get(uploadPath, (req, res) => res.render('upload'));

  app.post(uploadPath, (req, res) => {
    const io = app.get('socketIo');
    const sendStdout = data => io.emit('build_stdout', String(data));
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const revisionName = `revision-${timestamp}`;
    io.emit('build_start');
    execMakeCommand('has_diff', {
      SSGCMS_BASE_BRANCH: 'origin/deployed-to-production',
    }, sendStdout)
      .catch(err => {
        console.log(err);
        throwBuildError('no_diff', 'There are no changes to upload.');
      })
      .then(result => {
        console.log('result', result);
        io.emit('build_stdout', 'fetched site changes\n');
        return generator.build({data: sendStdout});
      })
      .then(() => {
        io.emit('build_upload_start');
        return upload({data: data => io.emit('build_stdout', String(data))});
      })
      .then(() => {
        io.emit('upload_complete');
        return execMakeCommand('push_revisions', {
          SSGCMS_SOURCE_BRANCH: revisionName,
          SSGCMS_DESTINATION_BRANCH: 'deployed-to-production',
          SSGCMS_COMMIT_MESSAGE: `Automated update at ${new Date().toString()}`,
        }, sendStdout);
      })
      .then(() => {
        io.emit('build_stdout', config.productionUrl);
        io.emit('build_complete', config.productionUrl);
        res.sendStatus(200);
      })
      .catch(err => {
        io.emit('build_stdout', err.message);
        if (err.type === 'no_diff') {
          return res.status(400).send(err);
        }
        console.log('err', err);
        res.sendStatus(500);
      });
  });
};
