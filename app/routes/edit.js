const root = '../..';
const config = require(`${root}/config`);
const traverse = require('traverse');
const metaMarked = require('meta-marked');
const YAML = require('yamljs');
const _ = require('lodash');

const {readFileP, writeFileP} = require(`${root}/app/lib/file_utils`);

function traverseAndExtend(base, newData) {
  traverse(newData).forEach(function(datum) {
    if (this.isLeaf) _.set(base, this.path, datum);
  });
  return base;
}

function metaMarkToString(metaMarkObj) {
  return '---\n' +
    YAML.stringify(metaMarkObj.meta) +
    '---\n' +
    `${metaMarkObj.markdown}\n`;
}

function readSource(sourceConfig) {
  const filePath = `${config.sitePath}/${sourceConfig.filename}`;
  if (sourceConfig.type === 'json') {
    return readFileP(filePath, 'utf8')
      .then(data => JSON.parse(data));
  } else if (sourceConfig.type === 'md') {
    return readFileP(filePath, 'utf8')
      .then((data) => {
        const pageData = metaMarked(data.toString());
        pageData.markdown = _.trim(pageData.markdown);
        return pageData;
      });
  }
}

function writeSource(sourceConfig, newData) {
  const filePath = `${config.sitePath}/${sourceConfig.filename}`;
  if (sourceConfig.type === 'json') {
    return readSource(sourceConfig)
      .then(editorSource => {
        traverseAndExtend(editorSource, newData);
        const newConfigJson = JSON.stringify(editorSource, null, 2);
        return writeFileP(filePath, newConfigJson);
      });
  } else if (sourceConfig.type === 'md') {
    return readSource(sourceConfig)
      .then(editorSource => {
        traverseAndExtend(editorSource, newData);
        editorSource.markdown = _.trim(editorSource.markdown);
        return writeFileP(filePath, metaMarkToString(editorSource));
      });
  }
}

module.exports = app => {
  app.get('/edit/:editor', (req, res) => {
    const editorConfig = _.find(config.editors, {name: req.params.editor});
    readSource(editorConfig.source)
      .then(editorSource => {
        res.render('edit', {
          editorConfig,
          editorSource,
        });
      });
  });

  app.post('/edit/:editor', (req, res) => {
    const editorConfig = _.find(config.editors, {name: req.params.editor});
    writeSource(editorConfig.source, req.body)
      .then(() => res.redirect(req.path))
      .catch(err => { console.log(err, err.stack); res.sendStatus(500); });
  });
};
