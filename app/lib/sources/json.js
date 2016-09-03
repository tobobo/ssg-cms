const root = '../../..';
const {readFileP, writeFileP} = require(`${root}/app/lib/file_utils`);
const traverseAndExtend = require(`${root}/app/lib/traverse_and_extend`);

function read(path) {
  return readFileP(path, 'utf8')
    .then(data => JSON.parse(data));
}

function write(path, data) {
  return read(path)
    .then(editorSource => {
      traverseAndExtend(editorSource, data);
      const newConfigJson = JSON.stringify(editorSource, null, 2);
      return writeFileP(path, newConfigJson);
    });
}

module.exports = {read, write};
