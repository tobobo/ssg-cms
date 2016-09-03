const metaMarked = require('meta-marked');
const YAML = require('yamljs');

const root = '../../..';
const {readFileP, writeFileP} = require(`${root}/app/lib/file_utils`);
const traverseAndExtend = require(`${root}/app/lib/traverse_and_extend`);

function metaMarkToString(metaMarkObj) {
  return '---\n' +
    YAML.stringify(metaMarkObj.meta) +
    '---\n' +
    `${metaMarkObj.markdown}\n`;
}

function read(path) {
  return readFileP(path, 'utf8')
    .then((data) => {
      const pageData = metaMarked(data.toString());
      pageData.markdown = _.trim(pageData.markdown);
      return pageData;
    });
}

function write(path, data) {
  return read(path)
    .then(editorSource => {
      traverseAndExtend(editorSource, data);
      editorSource.markdown = _.trim(editorSource.markdown);
      return writeFileP(path, metaMarkToString(editorSource));
    });
}

module.exports = {read, write};
