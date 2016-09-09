const root = '../..';
const config = require(`${root}/config`);
const sources = require(`${root}/app/lib/sources`);

function sourceError(sourceConfig) {
  return new Error(`no such source: ${sourceConfig.type}`);
}

function sourcePath(sourceConfig) {
  return `${config.siteDir}/${sourceConfig.filename}`;
}

function readSource(sourceConfig) {
  const source = sources[sourceConfig.type];
  if (source) return source.read(sourcePath(sourceConfig));
  throw sourceError(sourceConfig);
}

function writeSource(sourceConfig, newData) {
  const source = sources[sourceConfig.type];
  if (source) return source.write(sourcePath(sourceConfig), newData);
  throw sourceError(sourceConfig);
}

module.exports = app => {
  app.get(`/${config.editBasePath}/:editor`, (req, res) => {
    const editorConfig = _.find(config.editors, {name: req.params.editor});
    readSource(editorConfig.source)
      .then(editorSource => res.render('edit', {editorConfig, editorSource}));
  });

  app.post(`/${config.editBasePath}/:editor`, (req, res) => {
    const editorConfig = _.find(config.editors, {name: req.params.editor});
    writeSource(editorConfig.source, req.body)
      .then(() => {
        req.flash('success', `${editorConfig.title} saved`);
        res.redirect(req.path);
      })
      .catch(err => { console.log(err, err.stack); res.sendStatus(500); });
  });
};
